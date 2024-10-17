export const environment = {
  app: 'VEND_AUTH',
  appId: 'V-06',
  production: true,
  appDomain: 'vend-auth.vendease.com',
  baseDomain: 'vendease.com',
  AUTH_SERVICE: {
    MARKER: 'auth',
    URL: 'https://auth-service.vendease.com/v1'
  },
  BUSINESS_SERVICE: {
    MARKER: 'business',
    URL: 'https://business-service.vendease.com/v1'
  },
  TENANT_USER_MANAGEMENT_SERVICE: {
    MARKER: 'tums',
    URL: 'https://tum-svc.vendease.com/v1'
  },
  // RMS_URL: 'https://vend-rms.vendease.com/'
  RMS_URL: 'http://localhost:4202'
};
