export function GetData(queryURL, authToken){
    //Remove quotes from "'aaa'" to "aaa"
    var newToken = authToken.slice(1, authToken.length-1);

    //Fetch API
    return new Promise((resolve, reject) =>{
        fetch(queryURL, {
            method: 'GET',
            headers: new Headers({
                'Auth-Token' : newToken
            })
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