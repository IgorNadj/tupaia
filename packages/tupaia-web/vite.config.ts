import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import react from '@vitejs/plugin-react';

const baseConfig = {
  // ViteEjsPlugin is used to allow the use of EJS templates in the index.html file, for analytics scripts etc
  plugins: [
    ViteEjsPlugin(),
    react({
      jsxRuntime: 'classic',
    }),
  ],
  server: {
    port: 8088,
    open: true,
  },
  define: {
    'process.env': process.env, // to stop errors when libraries use 'process.env'
  },
  envPrefix: 'REACT_APP_', // to allow any existing REACT_APP_ env variables to be used;
  resolve: {
    preserveSymlinks: true,
    dedupe: ['@material-ui/core', 'react', 'react-dom', 'styled-components'], // deduplicate these packages to avoid duplicate copies of them in the bundle, which might happen and cause errors with ui component packages
    alias: {
      http: 'moduleMock.js',
      winston: 'moduleMock.js',
      jsonwebtoken: 'moduleMock.js',
      ['node-fetch']: 'moduleMock.js',
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // Dev specific config. This is because `define.global` breaks the build
  if (command === 'serve') {
    return {
      ...baseConfig,
      define: {
        ...baseConfig.define,
        global: {},
      },
    };
  }
  return baseConfig;
});
