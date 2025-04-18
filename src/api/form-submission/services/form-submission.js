'use strict';
const util = require('util');

/**
 * form-submission service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

function isIsoDate(str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d instanceof Date && !isNaN(d) && d.toISOString() === str; // valid date 
}

module.exports = createCoreService('api::form-submission.form-submission', () => ({
  getFormDashboardUrl(form) {
    return `https://${form.subDomain}.${process.env.FRONTEND_DOMAIN}`;
  },
  async notifyNewSubmission(submission) {
    try {
      // auto send email to form owner when the submission is updated with status complete
      // ignore notified submission to avoid duplicate emails
      if ((submission.status === 'complete' || submission.status === 'partial') && !submission.notified && submission.owner && submission.subscriber) {
        // strapi.log.info(`-- Sending email to ${submission.owner.email} from user ${clientName} (${submission.subscriber.email})`);
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
            submission: {
              zip: submission.zip,
              url: `${strapi.service('api::form-submission.form-submission').getFormDashboardUrl(submission.form)}/admin/submissions/${submission.id}`,
              data: submission.data.map(d => (
                `<li><strong>${d.title}:</strong> ${isIsoDate(d.answer) ? new Date(d.answer).toDateString() : d.answer}</li>`
              ))
            },
          }
        };
        if (submission.form.emailReceivers) {
          const extraReceivers = submission.form.emailReceivers.split('\n');
          if (extraReceivers.length) {
            // filter out owner email in the list of extra receivers
            const withoutOwner = extraReceivers.filter(e => e !== submission.owner.email);
            if (withoutOwner) ownerNotifyEmail.cc = withoutOwner;
          }
        }
        // push owner notification to queue
        const emails = [ownerNotifyEmail];
        // email to subscriber, only when submission is complete
        if (submission.status === 'complete') {
          const template = await strapi.db.query('api::form-email-template.form-email-template').findOne({
            where: {
              form: submission.form.id,
              type: 'subscriber_notification'
            }
          });
          if (template) {
            // when template is found & submission is complete, push subscriber notification to queue
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
                body: template.body
                  // parse user name
                  .replace(/\{\{\{user.name\}\}\}/g, subscriberName)
                  // parse markdown enter
                  .replace(/\\n/g, '<br/>'),
              }
            }
            emails.push(subscriberNotifyEmail);
          };
        }
        await Promise.all(emails.map(email => strapi.plugin('email').service('email').send(email)))
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
      }
      else {
        // strapi.log.info(`-- Submission from ${submission?.subscriber?.email} is not completed yet (${submission.status}). Skipping email notification.`);
      }
    } catch (e) {
      if (e.statusCode === 400) {
        strapi.log.error(e.message);
      } else {
        strapi.log.error(`Couldn't send test email: ${e.message}.`);
        console.log(util.inspect(e, { showHidden: false, depth: null }));
      }
    }
  }
}));
