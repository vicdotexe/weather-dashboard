var elements = {
    currentSection: $("#currentSection"),
    futureList: $("futureList"),
    searchButton: $("searchButton"),
    searchInput: $("searchInput")
}

function createWeatherCard(data){
    var div = $("<div>");
    div.addClass("card");

    var date = data.date //todo: format
    var type = date.format //todo: calculate whether its future or current
    div.addClass(type);

    var dateh3 = $("<h3>");
    dateh3.text(date);
    div.append(dateh3);

    var temph4 = $("<h4>");
    temph4.text(data.temp);
    div.append(temph4);

    var windh4 = $("<h4>");
    windh4.text(data.wind);
    div.append(windh4);

    var humh4 = $("<h4>");
    humh4.text(data.humidity);
    div.append(humh4);

    return div;
}

function loadFiveDay(json){
    //todo: clear 'futureList' and foreach item in 5day append to 'futureList'
}