const path = require('path');
const rewireCompressionPlugin = require('react-app-rewire-compression-plugin');

module.exports = {
  webpack: function(config, env) {
    if (process.env.REACT_APP_WIDGET) {
      config.entry = path.resolve(
        __dirname,
        `src/widget-${process.env.REACT_APP_WIDGET}-index.ts`,
      );
    }
    if (process.env.REACT_APP_LANDING_PAGE) {
      config.entry = path.resolve(
        __dirname,
        `src/landing-pages/landing-page-${process.env.REACT_APP_LANDING_PAGE}-index.ts`
      );
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      "@ledgerhq/devices/hid-framing": "@ledgerhq/devices/lib-es/hid-framing",
    };
    config = rewireCompressionPlugin(config, env, {
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
      threshold: 10240,
      minRatio: 0.8,
      cache: true,
    });

    return config;
  },
  paths: function(paths, env) {
    if (process.env.REACT_APP_WIDGET) {
      paths.appHtml = path.resolve(
        __dirname,
        `public/widget-${process.env.REACT_APP_WIDGET}-index.html`,
      );
      paths.publicUrlOrPath = `${process.env.WIDGET_PUBLIC_URL}/${process.env.REACT_APP_WIDGET}/`;
      paths.appBuild = path.resolve(
        __dirname,
        `build/${process.env.REACT_APP_WIDGET}`,
      );
    }

    if (process.env.REACT_APP_LANDING_PAGE) {
      paths.appHtml = path.resolve(
        __dirname,
        `public/landing-page-${process.env.REACT_APP_LANDING_PAGE}-index.html`
      );
      paths.appBuild = path.resolve(
        __dirname,
        `build/${process.env.REACT_APP_LANDING_PAGE}`
      );
    }
    return paths;
  },
};
