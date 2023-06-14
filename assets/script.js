// $( document ).ready(function() {
    
// });


var geoKey = '_eYJxzg3MbCZnNpEKXWqGRXmDrkUXbnGySiFa7d1T78';
var evKey = '14df59e4-ba59-4b25-a599-8f0da41f7a88';





$('#submit-btn').on('click', getstuff);

function getstuff() {
    //get search terms
    var addr = $('#address-input').val();
    var radius = $('#radius-input').val();
    //run fetch for geocoordinates
    fetch('https://geocode.search.hereapi.com/v1/geocode?q='+ addr +'&limit=1&apiKey=' + geoKey)
    .then(function(response) {
        return response.json();
    })
    //extract coordinates from returned object
    .then(function(data) {
        // console.log(data);
        //store coordinates in values
        // var lat = data.items[0].position.lat;
        // var lon = data.items[0].position.lng;
        // console.log(lat);
        // console.log(lon);
        //run new fetch to chargemap api
        fetch('https://api.openchargemap.io/v3/poi?key='+ evKey + '&output=json&latitude=' + data.items[0].position.lat + '&longitude=' + data.items[0].position.lng + ' &distance=' + radius + ' &maxresults=10')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            //log final result
            console.log(data);
            printResults(data);
        })
    })
}

function printResults(arr) {
    //get result element
    console.log(arr);
    var resultListEl = $('#results-list');


    //loop over results, creating elements and adding to list
    for(i = 0; i< 10; i++) {
        var a = i+1;

        var resultEl = $('<li>');

        resultEl.text("Result " + i + ": " + arr[i].AddressInfo.AddressLine1);

        resultEl.addClass('list-group-item px-3 border-0');

        resultListEl.append(resultEl);

    }

}