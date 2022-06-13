module.exports = [
  {
    method: 'POST',
    path: '/generate',
    handler: 'embed-code.generate',
    config: {
      policies: [
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::embed-code.embed-code.generate'],
          },
        },
      ],
    }
  },
]