var searchHistory = [];

function renderHistory() {
    // create list for search history
    var historyListEl = $('<div>');
    historyListEl.addClass('list-group');

    
}

function initHistory() {
    // get history from storage
    var storedHistory = JSON.parse(localStorage.getItem("evAddressSearch"));
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
    searchHistory.unshift(addressInput);
    if (searchHistory.length > 8) {
        searchHistory.splice[-1];
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