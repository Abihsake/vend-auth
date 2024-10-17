import { Assets } from './assets';

export const Constants = {
  STORAGE_VARIABLES: {
    TOKEN: '__TK__',
    USER: '__USK__',
    TENANT: '__TNK__',
    KEEP_ME_IN: '__KEEPIN__', // This is used to keep the user logged in
    LANGUAGE: '__LANGUAGE__'
  },

  SSO_QUERY_KEY: 'sso',

  COUNTRIES: [
    {
      name: 'Nigeria',
      code: 'NG',
      phoneCode: '+234',
      currency: 'NGN'
    }
  ],

  LANGUAGES: [
    { name: 'English', code: 'en', default: true, flag: Assets.FLAGS.ENGLISH.name },
    { name: 'Français', code: 'fr', default: false, flag: Assets.FLAGS.FRENCH.name }
  ],

  VENDEASE_PUBLIC_LINKS: {
    WEBSITE: 'https://vendease.com',
    TERMS_AND_CONDITIONS: 'https://policy.vendease.com/policies/legal/terms-and-conditions',
    PRIVACY_POLICY: 'https://policy.vendease.com/policies/legal/privacy-policy',
    SUPPORT: 'https://support.vendease.com'
  },

  TESTIMONIALS: [
    {
      testimonial: `"Since I started using Vendease, I’m able to account for how much I spend on food supply, have these supplies delivered to me, properly cost my menu and accept payments all in one place!”`,
      testifier: {
        name: 'Damilola',
        description: 'Owner of the DoBowls Restaurant',
        image: 'https://moodoffdp.com/wp-content/uploads/2023/04/Instagram-Girl-DP.jpg'
      },
      business: {
        name: 'DoBowls Restaurant',
        logo: 'https://theplace.com.ng/wp-content/uploads/2021/05/cropped-cropped-Theplace-Favicon-1.png'
      }
    }
  ]
};
