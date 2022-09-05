import NodePolyfillPlugin from "node-polyfill-webpack-plugin"
import { Configuration } from "webpack/types.d"
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin")

const config = {
  webpack: {
    plugins: [new NodePolyfillPlugin()],
    configure: (webpackConfig: Configuration) => {
      if (!webpackConfig?.resolve?.plugins) return webpackConfig

      // Allow imports outside of src/
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        ({ constructor }: InstanceType<typeof ModuleScopePlugin>) =>
          constructor?.name !== "ModuleScopePlugin"
      )
      return webpackConfig
    },
  },
}

export default config
