/*  eslint-disable no-process-env */
import wolkenkit from 'wolkenkit-client';

let app;

export const connectToWolkenkit = function () {
  return new Promise((resolve, reject) => {
    app = wolkenkit.connect({
      host: 'local.wolkenkit.io',
      port: 5000,
      authentication: new wolkenkit.authentication.OpenIdConnect({
        identityProviderUrl: `${process.env.REACT_APP_WOLKENKIT_IDENTITY_PROVIDER_URL}`,
        clientId: `${process.env.REACT_APP_WOLKENKIT_CLIENT_ID}`,
        scope: 'openid profile',
        strictMode: false
      })
    })
    .then(connectedApp => {
      app = connectedApp;
      resolve(connectedApp);
    })
    .catch(err => {
      reject(err);
    });
  });
};

export const getWolkenkitApp = function () {
  return app;
};
