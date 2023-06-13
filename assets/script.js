var searchHistory = [];


function storeHistory() {
    // store history from submissions
    localStorage.setItem("evSearch", JSON.stringify(searchHistory));
}

function renderHistory() {
    var rootEl = $('#search-panel');
    // remove history display if needed
    if ($('#history-list').length !== 0) {
        console.log("hi");
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
        $(hButton).addClass("list-group-item list-group-item-action");
        $(hButton).html(item[0]+'<br>Radius: '+item[1]);
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

$('#submit-btn').click(function() {
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

    //store and render new history elements
    storeHistory();
    renderHistory();
})

// initialize history
initHistory();