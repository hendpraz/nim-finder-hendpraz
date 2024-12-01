export function GetData(queryURL) {
  //Fetch API
  return new Promise((resolve, reject) => {
    fetch(queryURL, {
      mode: "cors",
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
