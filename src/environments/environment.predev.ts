// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  app: 'VEND_AUTH',
  appId: 'V-06',
  production: false,
  appDomain: 'localhost:4201',
  // appDomain: 'vend-auth.vendease.com',
  baseDomain: 'vendease.com',
  AUTH_SERVICE: {
    MARKER: 'auth',
    URL: 'http://vendease.ideassionlive.in/auths/v1'
  },
  BUSINESS_SERVICE: {
    MARKER: 'business',
    URL: 'http://vendease.ideassionlive.in/bs/v1'
  },
  TENANT_USER_MANAGEMENT_SERVICE: {
    MARKER: 'tums',
    URL: 'http://vendease.ideassionlive.in/tums/v1'
  },
  // RMS_URL: 'https://vend-rms.vendease.com/'
  RMS_URL: 'http://13.233.222.66/rms/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// DO NOT REMOVE THIS COMMENTED CODE
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
