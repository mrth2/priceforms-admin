import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import MagicLink from './components/MagicLink';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    //   app.addMenuLink({
    //     to: `/plugins/${pluginId}`,
    //     icon: PluginIcon,
    //     intlLabel: {
    //       id: `${pluginId}.plugin.name`,
    //       defaultMessage: name,
    //     },
    //     Component: async () => {
    //       const component = await import(/* webpackChunkName: "[request]" */ './pages/App');

    //       return component;
    //     },
    //     permissions: [
    //       // Uncomment to set the permissions of the plugin here
    //       // {
    //       //   action: '', // the action name should be plugin::plugin-name.actionType
    //       //   subject: null,
    //       // },
    //     ],
    //   });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'FormMagicLink',
      Component: MagicLink,
    });
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
