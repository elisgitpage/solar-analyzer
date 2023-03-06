export class SolarBackendPortal {
  baseUrl = "http://localhost:4001";

  constructor() {}

  getMsg() {
    // Creates a promise object for retrieving the desired data
    return (
      fetch(this.baseUrl + "/api")
        // When recieved, exposes the JSON component
        .then((response) => {
          return response.json();
        })
        // Displays the message on the page
        .then((json) => {
          let new_msg = "Server message: " + json.msg;
          return new_msg;
        })
        .catch((e) => {
          console.log(e);
          let new_msg = e.message;
          return new_msg;
        })
    );
    // .finally(() => {
    //   return new_msg;
    // });
  }

  // async getOptions() {
  //   // Creates a promise object for retrieving the desired data
  //   let response = await fetch("http://localhost:4001/options");
  //   // When recieved, exposes the JSON component
  //   // .then((response) => {
  //   //   return response.json();
  //   // })
  //   // // Displays the message on the page
  //   // .then((json) => {
  //   //   return json;
  //   // })
  //   // .catch((e) => {
  //   //   console.log(e);
  //   //   new_msg = e.message;
  //   // })
  //   // .finally(() => {
  //   //   // document.getElementById("msg").innerHTML = new_msg;
  //   // });
  //   let json = await response.json();
  //   return json;
  // }

  getOptions() {
    // Creates a promise object for retrieving the desired data
    return (
      fetch("http://localhost:4001/api/options")
        // When recieved, exposes the JSON component
        .then((response) => {
          return response.json();
        })
    );
    // // Displays the message on the page
    // .then((json) => {
    //   new_msg = "Server message: " + json.msg;
    // })
    // .catch((e) => {
    //   console.log(e);
    //   new_msg = e.message;
    // })
    // .finally(() => {
    //   document.getElementById("msg").innerHTML = new_msg;
    // });
  }

  getMap(mapName) {
    return (
      fetch(this.baseUrl + "/api/map/" + mapName)
        // When recieved, exposes the JSON component
        .then((response) => {
          return response.json();
        })
    );
  }
}
