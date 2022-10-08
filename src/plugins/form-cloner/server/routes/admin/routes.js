module.exports = [
  {
    method: 'POST',
    path: '/start',
    handler: 'form-cloner.start',
    config: {
      policies: [
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::form-cloner.form-cloner.start'],
          },
        },
      ],
    }
  },
]