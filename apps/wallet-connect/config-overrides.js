const webpack = require('webpack')

module.exports = {
  webpack: function (config, env) {
    const fallback = config.resolve.fallback || {}

    // https://github.com/ChainSafe/web3.js#web3-and-create-react-app
    Object.assign(fallback, {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify'),
      url: require.resolve('url'),
      // https://stackoverflow.com/questions/68707553/uncaught-referenceerror-buffer-is-not-defined
      buffer: require.resolve('buffer'),
    })

    config.resolve.fallback = fallback

    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ])

    // https://github.com/facebook/create-react-app/issues/11924
    config.ignoreWarnings = [/to parse source map/i]

    return config
  },
  jest: function (config) {
    return config
  },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost)

      config.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      }

      return config
    }
  },
  paths: function (paths) {
    return paths
  },
}
