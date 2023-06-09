// const url = 'https://api.openchargemap.io/v3/poi?key=123&maxresults=20';
// const options = {method: 'GET', headers: {Accept: 'application/json'}};

// try {
//   const response = await fetch(url, options);
//   const data = await response.json();
//   console.log(data);
// } catch (error) {
//   console.error(error);
// }


var requestURL = "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyAMxbiECwW0ChsVHUekn60HrC_5FIzpr38";

// fetch(requestURL)
//   .then(function (response) {
//     console.log(response);
//     return response.json();
//   })

var responseText = document.getElementById('response-text');
console.log(responseText)

function getApi(requestUrl) {
    fetch(requestUrl)
      .then(function (response) {
        console.log(response);
        //  Conditional for the the response.status.
        if (response.status !== 200) {
          // Place the response.status on the page.
          responseText.textContent = response.status;
        }
        return response.json();
      })
      .then(function (data) {
        // Make sure to look at the response in the console and read how 404 response is structured.
      });
  }

  getApi(requestURL);

  async function logJSONData() {
    const response = await fetch("https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyAMxbiECwW0ChsVHUekn60HrC_5FIzpr38");
    const jsonData = await response.json();
    console.log(jsonData);
  }
  
  logJSONData();