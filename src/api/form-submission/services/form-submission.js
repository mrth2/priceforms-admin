'use strict';

/**
 * form-submission service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::form-submission.form-submission', ({ strapi }) => ({
  async notifyNewSubmission(submissionId) {
    // get submission
    const submission = await strapi.db.query('api::form-submission.form-submission').findOne({
      where: {
        id: submissionId
      },
      populate: ['form', 'category', 'subscriber', 'owner']
    });
    // auto send email to form owner when the submission is updated with status complete
    // ignore notified submission to avoid duplicate emails
    if (submission.status === 'complete' && !submission.notified && submission.owner) {
      // strapi.log.info('-- sending email to form owner');
      const clientName = strapi.service('api::subscriber.subscriber').getFullName(submission.owner);
      const subscriberName = strapi.service('api::subscriber.subscriber').getFullName(submission.subscriber);
      // email to owner
      const ownerNotifyEmail = {
        from: {
          email: 'noreply@priceforms.net',
          name: 'PriceForms'
        },
        to: {
          email: submission.owner.email,
          name: clientName
        },
        replyTo: {
          email: 'admin@priceforms.net',
          name: 'PriceForms Admin'
        },
        template_id: 'd-666eb7c3184940459756f38e981d134f',
        dynamic_template_data: {
          client: {
            name: clientName
          },
          form: {
            name: submission.form.subDomain.charAt(0) + submission.form.subDomain.substring(1).toLowerCase(),
            case: submission.category.title
          },
          user: {
            name: subscriberName,
            email: submission.subscriber.email,
            phone: submission.subscriber.phone,
          },
          submissionURL: `https://${submission.form.subDomain}.${process.env.FRONTEND_DOMAIN}/admin/submissions/${submission.id}`,
          submissionData: submission.data.map(d => (
            `<li><strong>${d.title}:</strong> ${d.answer}</li>`
          )),
        }
      };
      if (submission.form.emailReceivers) {
        const extraReceivers = submission.form.emailReceivers.split('\n');
        if (extraReceivers.length) {
          ownerNotifyEmail.cc = extraReceivers;
        }
      }
      // email to subscriber
      const template = await strapi.db.query('api::form-email-template.form-email-template').findOne({
        where: {
          form: submission.form.id,
          type: 'subscriber_notification'
        }
      });
      const emails = [ownerNotifyEmail];
      if (template) {
        const subscriberNotifyEmail = {
          from: {
            email: 'noreply@priceforms.net',
            name: template.fromName || clientName,
          },
          to: {
            email: submission.subscriber.email,
            name: subscriberName
          },
          replyTo: {
            email: template.replyTo || submission.owner.email,
            name: template.fromName || clientName,
          },
          template_id: 'd-07bf0490105640b48c6607f5137af523',
          subject: template.subject,
          dynamic_template_data: {
            body: template.body.replace(/\{\{\{user.name\}\}\}/g, subscriberName),
          }
        }
        emails.push(subscriberNotifyEmail);
      };
      try {
        Promise.all(emails.map(email => strapi.plugin('email').service('email').send(email)))
          .then(async () => {
            // strapi.log.info('-- email sent');
            await strapi.db.query('api::form-submission.form-submission').update({
              where: {
                id: submission.id
              },
              data: {
                notified: true
              }
            })
          });
      } catch (e) {
        if (e.statusCode === 400) {
          throw new ApplicationError(e.message);
        } else {
          throw new Error(`Couldn't send test email: ${e.message}.`);
        }
      }
    }
  }
}));
