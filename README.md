# Api Demo
Api playground for building out a quick rest api

## Dependencies
- node version: 14.15.1

Optionally you can use nvm to set up the node environment with: `nvm use`
## To Run

### Install

```npm install```

### Test

To test the application. First set node options with
```
export NODE_OPTIONS=--experimental-vm-modules npx jest
```
This is to enable ECMAScript for jest https://jestjs.io/docs/en/ecmascript-modules. In a future enhancement I think it would be more prudent to use a build tool like babel.

Then
```
npm run test
```

### Serve
```
npm run invoke
```

This will serve the application on your localhost:3000

The available endpoints are
```
    GET     /contacts
    POST    /contacts
    PUT     /contacts/{id}
    GET     /contacts/{id}
    DELETE  /contacts/{id}
    GET     /contacts/call-list
```


