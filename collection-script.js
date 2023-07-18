/* External API hosts saved as environment variables, they use the directory script */
const externalAPIHosts = [
  "{{External-API-1",
  "{{External-API-2}}",
  "{{External-API-3}}",
];

if (externalAPIHosts.includes(pm.request.url.getHost())) {
  console.log("Request to external API. Login to myApplication skipped...");
  return;
}

const loginToMyApplication = () => {
  const desiredUser = "my-user@myapplication.com";
  const password = pm.environment.get("login-password");
  const remember = true;

  const postRequest = {
    url: `${pm.globals.get("localhost")}/login`, // Your application's login URL
    method: "POST",
    header: {
      "Content-Type": "application/json",
      "Cache-content": "no-cache",
    },
    body: {
      mode: "raw",
      raw: JSON.stringify({
        username: desiredUser,
        password,
        remember,
      }),
    },
  };

  return new Promise((resolve, reject) => {
    pm.sendRequest(postRequest, function (error, _) {
      if (error) {
        reject(error);
      }

      console.log("Login request successfull!");
      resolve();
    });
  });
};

const requestRoute = pm.request.url.getPath();
const isPublicRoute = requestRoute.match(/(public)/g);

if (!isPublicRoute) {
  loginToMyApplication().catch((error) => console.log(error));
}
