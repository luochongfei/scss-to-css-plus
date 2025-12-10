const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  target: 'node', // VS Code extensions run in a Node.js-context
  entry: {
    extension: './src/extension.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs',
  },
  externals: {
    'vscode': 'commonjs vscode', // Ignored because it's provided by the VS Code host
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "icon.png", to: "." },
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  devtool: 'nosources-source-map',
};


