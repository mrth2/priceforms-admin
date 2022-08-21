module.exports = {
  // cronjob run once per 10 minutes to notify un-notified submission
  '*/10 * * * *': async ({ strapi }) => {
    // query all completed but non-notified submissions are older than 5 minutes of inactivity
    // and mark them as notified
    const submissions = await strapi.db.query('api::form-submission.form-submission').findMany({
      where: {
        status: 'complete',
        $or: [
          {
            notified: false,
          },
          {
            notified: null,
          }
        ],
        updatedAt: {
          $lte: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        }
      },
      populate: ['form', 'category', 'subscriber', 'owner'],
      limit: 10
    });
    strapi.log.info(`-- Found ${submissions.length} submissions to notify`);
    for (const submission of submissions) {
      await strapi.service('api::form-submission.form-submission').notifyNewSubmission(submission);
    }
  }
}