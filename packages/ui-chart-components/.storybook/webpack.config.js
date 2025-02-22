/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 *
 */

const path = require('path');

/**
 * The doc doesn't really mention using webpack.config.js, but .storybook/main.js instead.
 *
 * Nevertheless, configuring the webpack.config.js seems to work fine.
 *
 * @param config
 * @return {Promise<*>}
 * @see https://storybook.js.org/docs/react/configure/webpack
 * @see https://storybook.js.org/docs/react/configure/webpack#using-your-existing-config
 */
module.exports = async ({ config }) => {
  /**
   * Fixes npm packages that depend on `fs` module, etc.
   *
   * E.g: "winston" would fail to load without this, because it relies on fs, which isn't available during browser build.
   *
   * @see https://github.com/storybookjs/storybook/issues/4082#issuecomment-495370896
   */
  config.node = {
    fs: 'empty',
    tls: 'empty',
    net: 'empty',
    module: 'empty',
    console: true,
  };

  config.resolve.alias = {
    ...config.resolve.alias,
    yargs: path.resolve(__dirname, '../../../moduleMock.js'),
    child_process: path.resolve(__dirname, '../../../moduleMock.js'),
    '@aws-sdk/credential-providers': path.resolve(__dirname, 'awsModuleMock.js'),
    '@aws-sdk/client-s3': path.resolve(__dirname, 'awsModuleMock.js'),
    '@aws-sdk/lib-storage': path.resolve(__dirname, 'awsModuleMock.js'),
    http: path.resolve(__dirname, './moduleMock.js'),
  };

  config.module.rules.push({
    test: /\.(js|jsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: ['@babel/plugin-proposal-nullish-coalescing-operator'],
    },
  });

  return config;
};
