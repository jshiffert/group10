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
        $(hButton).html(item[0]+'<br>Radius: '+item[1]);
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

            //call function to print results, passing returned object from api
            printResults(data);
        })
    })
}

function printResults(arr) {
    //get result element
    console.log(arr);
    $("li").remove();
    var resultListEl = $('#results-list');


    //loop over results, creating elements and adding to list
    for(i = 0; i< 10; i++) {
        var a = i+1;

        var resultEl = $('<li>');

        resultEl.text("Result " + a + ": " + arr[i].AddressInfo.AddressLine1 + ", " +arr[i].AddressInfo.Town + "  " + arr[i].UsageType.Title);


        resultEl.addClass('list-group-item px-3 border-0 bg-orange-50');

        resultListEl.append(resultEl);

    }

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
