# Context

In many applications, there is a need to differentiate between public routes and protected routes, which require authentication. This repository provides a solution to simplify testing of protected routes by automating the authentication process.

The repository consists of two key scripts: collection-script and directory-script.

The collection-script is designed to be inserted in the pre-request script section of Postman collection, where it runs before each request within a collection. It intelligently identifies public routes using regular expressions and skips the function invocation in such cases.

```js
const requestRoute = pm.request.url.getPath();
const isPublicRoute = requestRoute.match(/(public)/g);

if (!isPublicRoute) {
  loginToMyApplication().catch((error) => console.log(error));
}
```

The directory-script is intended for requests made to external APIs. It specifically caters to scenarios where a separate script is needed for authenticating with an external API. For example, let's consider a petShop API with a login route that returns an authorization token, and a special offers route that requires the token to be sent in the header. The directory-script handles the authentication process by sending an HTTP request to the login route and setting the Authorization header with the returned token.

```js
getAuthorizationToken()
  .then((token) => {
    pm.request.headers.add(`Authorization: ${token}`);
  })
  .catch((error) => console.log(error));
```

In order to avoid running both scripts, the external hosts are placed in environment variables and verified at the beginning of the collection script. If it is identified that the request is being made to an external API, the invocation of the login function is skipped and the next script to be executed is the directory-script.

```js
const externalAPIHosts = [
  "{{External-API-1",
  "{{External-API-2}}",
  "{{External-API-3}}",
];

if (externalAPIHosts.includes(pm.request.url.getHost())) {
  console.log("Request to external API. Login to myApplication skipped...");
  return;
}
```

These scripts offer a straightforward yet powerful automation solution, saving significant time during the testing of new routes within your application. By streamlining the authentication process, this repository enhances the efficiency and convenience of testing workflows during development.
