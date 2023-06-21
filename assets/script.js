var searchHistory = [];
var geoKey = '_eYJxzg3MbCZnNpEKXWqGRXmDrkUXbnGySiFa7d1T78';
var evKey = '14df59e4-ba59-4b25-a599-8f0da41f7a88';

function storeHistory() {
    // store history from submissions
    localStorage.setItem("evSearch", JSON.stringify(searchHistory));
}

function renderHistory() {
    var rootEl = $('#search-panel');
    // remove history display if needed
    if ($('#history-list').length !== 0) {
        $('#history-list').remove();
    };

    // create history element
    historyListEl = $('<div>');
    historyListEl.addClass('list-group');
    historyListEl.attr("id", "history-list");
    
    // create and append list elements
    for (var i = 0; i < searchHistory.length; i++) {
        var item = searchHistory[i];
        var hButton = document.createElement("button");
        $(hButton).addClass("list-group-item list-group-item-action history-item");
        if (item[0].length <= 30) {
            $(hButton).html(item[0]+'<br>Radius: '+item[1]);
        } else {
            $(hButton).html(item[0].substring(0, 30)+'<br>'+item[0].slice(30)+'<br>Radius: '+item[1]);
        };
        $(hButton).attr("id", "item"+i.toString());
        historyListEl[0].appendChild(hButton);
    };

    // append to parent element
    rootEl.append(historyListEl);
}

function initHistory() {
    // get history from storage
    var storedHistory = JSON.parse(localStorage.getItem("evSearch"));
    //populate history array
    if (storedHistory !== null) {
        searchHistory = storedHistory;
    }

    renderHistory();
};

function getstuff() {
    //get search terms
    var addr = $('#address-input').val();
    var radius = $('#radius-input').val();
    //run fetch for geocoordinates
    fetch('https://geocode.search.hereapi.com/v1/geocode?q='+ addr +'&limit=1&apiKey=' + geoKey)
    .then(function(response) {
        console.log(response);
        return response.json();
    })
    //extract coordinates from returned object
    .then(function(data) {
        if(data.items[0] == undefined){
            console.log('djshfgjhsd');
            return null;
        }
        // 
        //store coordinates in values
        // var lat = data.items[0].position.lat;
        // var lon = data.items[0].position.lng;
        // console.log(lat);
        // console.log(lon);
        //run new fetch to chargemap api
        fetch('https://api.openchargemap.io/v3/poi?key='+ evKey + '&output=json&latitude=' + data.items[0].position.lat + '&longitude=' + data.items[0].position.lng + ' &distance=' + radius + ' &maxresults=10')
        .then(function(response) {
            console.log(response);
                return response.json();
            
        })
        .then(function(data) {
            //log final result
            console.log(data);

            //call function to print results, passing returned object from api
            printTable(data);
            // printResults(data);
            mapPoints(data);
        })
    })
}

// function printResults(arr) {
//     //get result element
//     console.log(arr);
//     //remove any existing output
//     $("li").remove();
//     var resultListEl = $('#results-list');


//     //loop over results, creating elements and adding to list
//     for(i = 0; i< arr.length; i++) {
//         var a = i+1;

//         var resultEl = $('<li>');

//         resultEl.text("Result " + a + ": " + arr[i].AddressInfo.AddressLine1 + ", " +arr[i].AddressInfo.Town + "  Public/Private: " + arr[i].UsageType.Title + " Charge Type: " + arr[i].Connections[0].LevelID + arr[i].Connections[0].ConnectionType.Title);


//         resultEl.addClass('list-group-item px-3 border-0 bg-orange-50');

//         resultListEl.append(resultEl);

//     }

// }

function mapPoints(data) {
    markerArray = [];
    layerGroup.clearLayers();
    for (i = 0; i < data.length; i++) {
        var result = data[i];
        var lat = result.AddressInfo.Latitude;
        var lon = result.AddressInfo.Longitude;
        var address = result.AddressInfo.AddressLine1;
        var marker = L.marker([lat, lon], {icon: myIcon}).addTo(layerGroup);
        marker.bindPopup(address);
        markerArray.push(marker);
    }
    var group = new L.featureGroup(markerArray);
    map.fitBounds(group.getBounds());
}

function addInput() {
    var addressInput = $('#address-input').val();
    var radiusInput = $('#radius-input').val();
    // return if empty
    if (addressInput === "" || radiusInput === "") {
        return;
    };

    // add search to history
    searchHistory.unshift([addressInput,radiusInput]);
    if (searchHistory.length > 5) {
        searchHistory.length = 5;
    }
    // reset values
    $('#address-input').val("");
    $('#radius-input').val("");
};

$('#submit-btn').click(function() {
    getstuff();
    addInput();
    //store and render new history elements
    storeHistory();
    renderHistory();
});

    // alternative way to search with enter
$(document).on('keypress',function(e) {
    if(e.which == 13) {
        getstuff();
        addInput();
        //store and render new history elements
        storeHistory();
        renderHistory();
    }
});

//search the values when clicking a history item
$(document).on('click', '.history-item', function() {
    console.log($(this)[0]);
    if ($(this).is('#item0')) {
        console.log(searchHistory[0])
        $('#address-input').val(searchHistory[0][0]);
        $('#radius-input').val(searchHistory[0][1]);
    } else if ($(this).is('#item1')) {
        console.log(searchHistory[1])
        $('#address-input').val(searchHistory[1][0]);
        $('#radius-input').val(searchHistory[1][1]);
    } else if ($(this).is('#item2')) {
        console.log(searchHistory[2])
        $('#address-input').val(searchHistory[2][0]);
        $('#radius-input').val(searchHistory[2][1]);
    } else if ($(this).is('#item3')) {
        console.log(searchHistory[3])
        $('#address-input').val(searchHistory[3][0]);
        $('#radius-input').val(searchHistory[3][1]);
    } else if ($(this).is('#item4')) {
        console.log(searchHistory[4])
        $('#address-input').val(searchHistory[4][0]);
        $('#radius-input').val(searchHistory[4][1]);
    }
    getstuff();
});

// printResults();
// initialize history
initHistory();

// initialize map
var map = L.map('map').setView([40.007364780101966, -83.03048484854264], 10);
// point layer group
var layerGroup = L.layerGroup().addTo(map);
// OSM tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// link icons for map markers
var myIcon = L.icon({
    iconUrl: 'https://github.com/jshiffert/group10/assets/130510457/5b6f4d44-d999-495e-8271-45f27a5ff1ca',
    iconSize: [40,40],
    iconAnchor: [20,40],
    popupAnchor: [0,-30]
});




function printTable (jsonData) {
    //
    $('table').remove();
    var container = $('#city-title');
    var table = $("<table>");
    table.addClass('table table-hover shadow-gray-800 shadow-xl');
    var rowData = [];


    // Get the keys (column names) of the first object in the JSON data
    var cols = ["Address", "Public/Private", "Charge Level", "Charge Type"];

    //create table head and table row element
    var thead = $("<thead>");
    var tr = $("<tr>");


    //create table headers from column array
    $.each(cols, function(i, item){
        let th = $("<th>");
         // Set the column name as the text of the header cell
        th.text(item);
         // Append the header cell to the header row
        tr.append(th);
     });
     thead.append(tr); // Append the header row to the header
     table.append(tr) // Append the header to the table


     //loop to fill out table
    for(let k = 0; k<jsonData.length; k++) {
        //store both pieces of address at current index in one value to push to array
        var cAddr = jsonData[k].AddressInfo.AddressLine1 + ", " + jsonData[k].AddressInfo.Town;
        //pass to function to remove null values
        removeNull (jsonData, k);
        //push all desired values to array for row data
        rowData.push(cAddr , jsonData[k].UsageType.Title , jsonData[k].Connections[0].LevelID , jsonData[k].Connections[0].ConnectionType.Title);
        //function creates and appends new row to table
        newTableRow(rowData, table)
        //reset array for row data to empty
        rowData = [];
    }

    // Append the completed table to the container element
        container.append(table) 

}

function newTableRow (rowData, table) {
    console.log(rowData);
    let tr = $("<tr>");
    $.each(rowData, function(i, item) {
        let td = $("<td>");
        td.text(item);
        tr.append(td);
    });
    table.append(tr);
}

function removeNull (jsonData, k) {
        if(jsonData[k].UsageType == null){
            jsonData[k].UsageType = {};
            jsonData[k].UsageType.Title = "N/A";
        }else if(jsonData[k].Connections == null){
            jsonData[k].Connections = [{}]
            jsonData[k].Connections[0].LevelID = "N/A";
            jsonData[k].Connections[0].ConnectionType.Title = "N/A";    
        }else if(jsonData[k].Connections[0].ConnectionType.Title == null){
            jsonData[k].Connections[0].ConnectionType.Title = "N/A";
        }

        return jsonData;
}