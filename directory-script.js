const getAuthorizationToken = () => {
  const postRequest = {
    url: `${pm.globals.get("external-api-host")}/token`, // Change Url...
    method: "POST",
    header: {
      "Content-Type": "application/json",
      "Cache-content": "no-cache",
    },
    body: {
      mode: "raw",
      raw: JSON.stringify({
        // This request simulates a body that uses username/password
        username: "value",
        password: "value",
      }),
    },
  };

  return new Promise((resolve, reject) => {
    pm.sendRequest(postRequest, function (error, response) {
      if (error) {
        reject(error);
      }

      console.log("Authorization Token successfully retrieved!");
      const responseBody = response.json();
      resolve(responseBody.accessToken);
    });
  });
};

getAuthorizationToken()
  .then((token) => {
    pm.request.headers.add(`Authorization: ${token}`);
  })
  .catch((error) => console.log(error));
