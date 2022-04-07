const path = require('path');

module.exports = {
  webpack: function(config, env) {
    if (process.env.REACT_APP_WIDGET) {
      config.entry = path.resolve(
        __dirname,
        `src/widget-${process.env.REACT_APP_WIDGET}-index.ts`,
      );
    }

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
    return paths;
  },
};
