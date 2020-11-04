/* config-overrides.js */
const path = require("path");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

module.exports = {
  // The function to use to create a webpack dev server configuration when running the development
  // server with 'npm run start' or 'yarn start'.
  // Example: set the dev server to use a specific certificate in https.
  devServer: function (configFunction) {
    // Return the replacement function for create-react-app to use to generate the Webpack
    // Development Server config. "configFunction" is the function that would normally have
    // been used to generate the Webpack Development server config - you can use it to create
    // a starting configuration to then modify instead of having to create a config from scratch.
    return function (proxy, allowedHost) {
      // Create the default config by calling configFunction with the proxy/allowedHost parameters
      const config = configFunction(proxy, allowedHost);

      config.headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      };

      // Return your customised Webpack Development Server config.
      return config;
    };
  },
  // webpack: function override(config, env) {
  //   config.resolve.plugins.forEach((plugin) => {
  //     if (plugin instanceof ModuleScopePlugin) {
  //       plugin.allowedFiles.add(
  //         path.resolve("../common/components/WidgetWrapper")
  //       );
  //       plugin.allowedFiles.add(path.resolve("../common/global"));
  //     }
  //   });

  //   return config;
  // },
};
