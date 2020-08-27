/* eslint-env node */
'use strict';

module.exports = function(deployTarget) {
  let ENV = {
    build: {
        localDir: 'build/',
        deleteRemoved: false,
        s3Params: {
          Bucket: '<%-appName%>-'+ deployTarget
        },
    },
    s3:{
      accessKeyId: '',
      secretAccessKey: '',
      region: 'eu-west-1',
      sslEnabled: true,
      Bucket:'<%-appName%>-'+ deployTarget
    }
    // include other plugin configuration that applies to all deploy targets here
  };

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};