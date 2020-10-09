// CONNECT TO API

const getProperties = () => {
    return fetch("https://realtor.p.rapidapi.com/properties/v2/list-for-rent?sort=relevance&city=New%20York%20City&state_code=NY&limit=200&offset=0", {
      "method": "GET",
      "headers": {
          "x-rapidapi-host": "realtor.p.rapidapi.com",
          "x-rapidapi-key": "e6695a6ac7msh16b37677dff30bap1ed3bbjsn47f7a13414c5"
      }
  })
      .then(response => response.json());// parse JSON
      // .then(users => users[0]) // pick first user
      // .then(user => console.log(user)); 
  };