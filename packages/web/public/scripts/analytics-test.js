console.log('Loading test script from partytown....')
var analytics = (window.analytics = ['identify', 'page', 'track'].reduce(
  (stub, key) => ({
    ...stub,
    [key]: (...args) => console.debug(`analytics.${key}`, ...args),
  }),
  {},
))
