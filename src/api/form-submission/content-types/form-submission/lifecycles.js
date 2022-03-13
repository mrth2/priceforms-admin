function getFullName(user) {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  if (user.lastName) {
    return user.lastName;
  }
  if (user.username) {
    return user.username;
  }
  return user.email;
}

module.exports = {
  // auth send email to form owner whenever a new submission is created
  async afterCreate(event) {
    const { result, params } = event;
    const email = {
      to: result.owner.email,
      template_id: 'd-666eb7c3184940459756f38e981d134f',
      dynamic_template_data: {
        client: {
          name: getFullName(result.owner)
        },
        form: {
          name: result.form.subDomain.charAt(0) + result.form.subDomain.substring(1).toLowerCase(),
          case: result.category.title
        },
        user: {
          name: getFullName(result.user),
          email: result.email
        },
        submissionURL: `https://${result.form.subDomain}.${process.env.FRONTEND_DOMAIN}/admin/submissions/${result.id}`
      }
    };
    try {
      await strapi
        .plugin('email')
        .service('email')
        .send(email);
    } catch (e) {
      if (e.statusCode === 400) {
        throw new ApplicationError(e.message);
      } else {
        throw new Error(`Couldn't send test email: ${e.message}.`);
      }
    }
  }
};