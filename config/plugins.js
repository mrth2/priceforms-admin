module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET')
      },
      actionOptions: {
        upload: {},
        delete: {},
      }
    }
  },
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: 'dev@priceforms.net',
        defaultReplyTo: 'dev@priceforms.net',
      }
    }
  },
  /* graphql: {
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 10,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      }
    }
  }, */
  "rest-cache": {
    config: {
      provider: {
        name: "memory",
        options: {
          max: 32767,
          maxAge: 3600,
        },
      },
      strategy: {
        contentTypes: [
          // list of Content-Types UID to cache
          "api::form.form",
          "api::form-category.form-category",
          "api::form-category-flow.form-category-flow",
        ],
      },
    },
  },
  'magic-link': {
    enabled: true,
    resolve: './src/plugins/magic-link'
  }
});