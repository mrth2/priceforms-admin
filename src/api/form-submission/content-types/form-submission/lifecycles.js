module.exports = {
  // auth send email to form owner whenever a new submission is updated with completed status
  // async afterUpdate(event) {
  //   const { result } = event;
  //   // get submission
  //   const submission = await strapi.db.query('api::form-submission.form-submission').findOne({
  //     where: {
  //       id: result.id
  //     },
  //     populate: ['form', 'category', 'subscriber', 'owner']
  //   });
  //   await strapi.service('api::form-submission.form-submission').notifyNewSubmission(submission);
  // }
};