import favicon from './extensions/favicon.png';

export default {
  config: {
    translations: {
      en: {
        "Auth.form.welcome.title": "Welcome to PriceForms!",
        "Auth.form.welcome.subtitle": "Login to your Super Admin account",
        "app.components.LeftMenu.navbrand.title": "PriceForms",
        "app.components.LeftMenu.navbrand.workplace": "Super Admin Area",
        "content-manager.plugin.name": "Forms & Submissions",
      }
    },
    head: {
      favicon,
    },
    auth: {
      logo: favicon
    },
    menu: {
      logo: favicon
    },
    theme: {
      colors: {
        primary700: '#4690CB',
        primary600: '#4690CB',
        primary500: '#143050',
      }
    }
  },
  bootstrap() { },
}