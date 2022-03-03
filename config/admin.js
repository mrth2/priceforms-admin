module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '9d7d9acc3c6a3f184dd0c5dfd3a5c19d'),
  },
});
