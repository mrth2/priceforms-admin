module.exports = [
  {
    method: 'POST',
    path: '/generate',
    handler: 'magic-link.generate',
    config: {
      policies: [
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::magic-link.magic-link.generate'],
          },
        },
      ],
    }
  },
]