import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const baseConfig = ({ input, output = {}, globals = {}, plugins, loaders, entry = [] }) => ({
  entry: input || {
    app: [path.join(__dirname, '../src/app/'), ...entry]
  },
  output: {
    filename: 'js/[name].bundle.js',
    chunkFilename: '[id].chunk.js',
    ...output
  },
  plugins: [
    new webpack.DefinePlugin(globals),
    new ExtractTextPlugin('styles.css', { allChunks: true }),
    ...(plugins ||
      [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          comments: false,
          compressor: {
            warnings: false
          }
        })
      ])
  ],
  resolve: {
    alias: {
      app: path.join(__dirname, '../src/app'),
      extension: path.join(__dirname, '../src/browser/extension')
    },
    extensions: ['', '.scss', '.js', '.json']
  },
  module: {
    loaders: [
      ...(loaders || [{
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      }]), {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap!toolbox')
      }
    ]
  },
  toolbox: {
    theme: path.join(__dirname, '../src/app/theme.scss')
  },
  postcss: [autoprefixer]
});

export default baseConfig;
