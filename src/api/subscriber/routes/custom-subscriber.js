module.exports = {
  routes: [
    {
      method: 'PATCH',
      path: '/subscribers',
      handler: 'subscriber.replace',
    }
  ]
};