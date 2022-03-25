module.exports = {
  // auth send email to form owner whenever a new submission is updated with completed status
  async afterUpdate(event) {
    const { result } = event;
    await strapi.service('api::form-submission.form-submission').notifyNewSubmission(result.id);
  }
};