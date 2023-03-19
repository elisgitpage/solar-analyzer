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
  }

  getOptions() {
    // Creates a promise object for retrieving the desired data
    return (
      fetch("http://localhost:4001/api/options")
        // When recieved, exposes the JSON component
        .then((response) => {
          return response.json();
        })
    );
  }

  getMapData(mapName) {
    return (
      fetch(this.baseUrl + "/api/map/" + mapName)
        // When recieved, exposes the JSON component
        .then((response) => {
          return response.arrayBuffer();
        })
        .then((ab) => {
          let typedArray = new Uint8Array(ab);
          let blob = new Blob([typedArray], { type: "image/png" });
          let urlCreator = window.URL || window.webkitURL;
          let imgUrl = urlCreator.createObjectURL(blob);
          return imgUrl;
          // let b64Response = btoa(blob);
          // return b64Response;
        })
        .catch((error) => {
          console.log("Caught response error: " + error);
        })
    );
  }
}
