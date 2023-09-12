const path = require('path');
const rewireCompressionPlugin = require('react-app-rewire-compression-plugin');

module.exports = {
  webpack: function(config, env) {
    if (process.env.REACT_APP_LANDING_PAGE) {
      config.entry = path.resolve(
        __dirname,
        `src/landing-pages/landing-page-${process.env.REACT_APP_LANDING_PAGE}-index.ts`
      );
    }
    if (process.env.REACT_APP_IS_ADMIN) {
      config.entry = path.resolve(
        __dirname,
        `src/admin/index.ts`
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

    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        textEncoding: {
          test: /[\\/]node_modules[\\/](text-encoding)[\\/]/,
          name: 'text-encoding',
          chunks: 'all',
        },
        vendorEdgeCore: {
          test: /[\\/]node_modules[\\/](edge-core-js)[\\/]/,
          name: 'vendor-edge-core',
          chunks: 'all',
        },
      },
    };

    return config;
  },
  paths: function(paths, env) {
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

    if (process.env.REACT_APP_IS_ADMIN) {
      paths.appHtml = path.resolve(
        __dirname,
        `public/admin-index.html`
      );
      paths.appBuild = path.resolve(
        __dirname,
        `build/admin`
      );
    }

    return paths;
  },
};
