module.exports = function (api) {
66  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 🌀 Reanimated must be first
      'react-native-reanimated/plugin',

      // 🔐 Dotenv for environment variables
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
        },
      ],

      // 📁 Absolute imports (e.g., @components/Button)
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@utils': './src/utils',
            '@assets': './assets',
          },
        },
      ],

      // 🧠 MobX decorators (if you're using MobX)
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],

      // 💅 Styled-components (optional but useful)
      ['babel-plugin-styled-components', { displayName: true }],
    ],
  };
};
