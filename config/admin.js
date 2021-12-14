module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '5856343ea0e21d5cea34284fda298b26'),
  },
});
