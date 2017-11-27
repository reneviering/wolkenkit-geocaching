# wolkenkit-geocaching

wolkenkit-geocaching is a simple [geocaching](https://en.wikipedia.org/wiki/Geocaching) application for hiding and finding geocaches in the world!

It was developed as a playground with [wolkenkit](https://www.wolkenkit.io), [react](https://reactjs.org), [redux](https://redux.js.org) and ❤️.

## What is wolkenkit?

> wolkenkit is a CQRS and event-sourcing framework for JavaScript and Node.js. wolkenkit uses an event-driven model based on DDD to setup an API for your business in no time. This way, wolkenkit bridges the language gap between your domain and technology.
>
> [wolkenkit.io](https://www.wolkenkit.io/)

For more details on wolkenkit see the [wolkenkit documentation](https://docs.wolkenkit.io).

## Preparing the application

### wolkenkit
See the wolkenkit installation guide for [macOS](https://docs.wolkenkit.io/1.1.0/getting-started/installing-wolkenkit/installing-on-macos/), [Linux](https://docs.wolkenkit.io/1.1.0/getting-started/installing-wolkenkit/installing-on-linux/), [Windows](https://docs.wolkenkit.io/1.1.0/getting-started/installing-wolkenkit/installing-on-windows/), or [Docker Machine](https://docs.wolkenkit.io/1.1.0/getting-started/installing-wolkenkit/installing-using-docker-machine/).

### Environment Variables

As wolkenkit-geocaching uses some public APIs you have to add some API keys and other configurations inside the file `.env` placed in the `client` directory.

```
REACT_APP_GOOGLE_GEOCODING_API_KEY=<google geocoding api-key>
REACT_APP_GOOGLE_MAPS_API_KEY=<google maps api-key>
REACT_APP_WOLKENKIT_IDENTITY_PROVIDER_URL=<identity provider url>
REACT_APP_WOLKENKIT_CLIENT_ID=<client id>
```

### Google Maps

[Get a Google Maps API key](https://developers.google.com/maps/documentation/javascript/tutorial?hl=en)

Afterwards add the API key to the `.env` file in the `client` directory.

### Google Maps Geocoding API

[Get a Google Maps Geocoding API key](https://developers.google.com/maps/documentation/geocoding/start?hl=en)

Afterwards add the API key to the `.env` file in the `client` directory.

### Auh0 identity provider

As wolkenkit uses authentication you have to configure an identity provider like [Auth0](https://auth0.com).

To configure it, you have to follow these steps:

- Login to [Auth0](https://auth0.com). If you don't have an account, register first.
- Navigate to `Clients => Create Client` choose a name and select `Single Page Applications` as a client type.
- Click on the `Settings` tab and add `http://localhost:3000` to `Allowed Callback URLs`
- Add the `Client ID` to the `.env` file in the `client` directory.
- Scroll to the bottom of the page and click on `Show Advanced Settings`.
- Click on the `Certificates` tab, copy the `Signing Certificate` and add it to `/server/keys/auth0.certificate.pem`.
- Add your identity provider URL to the `package.json` at the key `wolkenkit.environments.default.identiyProvider.name`. It has the structure `https://<identityProviderName>.eu.auth0.com/`

### Install node dependencies

For the wolkenkit backend:

```shell
$ npm install
```

For the client:

```shell
$ cd client
$ npm install
```

## Starting the application

Starting the backend:

```shell
$ wolkenkit start
```

Starting the client:
```shell
$ cd client
$ npm start
```


## License

Copyright © 2017 René Viering.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see [GNU Licenses](http://www.gnu.org/licenses/).
