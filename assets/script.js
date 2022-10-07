var elements = {
    currentSection: $("#currentSection"),
    futureList: $("#futureList"),
    searchButton: $("#searchButton"),
    searchInput: $("#searchInput"),
    location: $("#location"),
    popularList: $("#popularList"),
    historyButton: $("#historyButton")
}

var key = "91334187c2181ae5f6e0ad1855dff301";

function createWeatherCard(data){

    var desc = data.weather[0].main;
    var description = data.weather[0].description;
    var temp = data.main.temp;
    var wind = data.wind.speed;
    var hum = data.main.humidity;
    var icon = data.weather[0].icon;

    var date;
    if (data.dt_txt){
        date = moment(data.dt_txt, "YYYY-MM-DD");
    }else{
        date = moment();
    }

    var div = $("<div>");
    div.addClass("card");

    var dateh3 = $("<h3>");
    dateh3.text(date.format("M/D"));
    div.append(dateh3);

    var dayh5 = $("<h5>");
    dayh5.text(date.format("ddd"));
    div.append(dayh5);

    var img = $("<img>");
    img.attr("src", `https://openweathermap.org/img/wn/${icon}.png`)
    div.append(img);

    
    var desch4 = $("<h4>");
    desch4.text(desc);
    div.append(desch4);
    
    var desch3 = $("<h5>");
    desch3.text(`(${description})`);
    div.append(desch3);

    var temph4 = $("<h1>");
    temph4.addClass("temp");
    temph4.text(Math.round(temp)+"°");
    div.append(temph4);

    var windh4 = $("<h4>");
    windh4.text("Wind: " + wind);
    div.append(windh4);

    var humh4 = $("<h4>");
    humh4.text("Humidity: " + hum);
    div.append(humh4);

    return div;
}

function addToHistory(name){
    var history = JSON.parse(localStorage.getItem("whistory"));
    if (!history){
        history = [];
    }
    var exists = false;
    var index = 0;

    for (let i = 0; i < history.length; i++){
        if (history[i].toLowerCase() == name.toLowerCase()){
            exists = true;
            index = i;
            break;
        }
    }

    if (!exists){
        history.unshift(name);
        if (history.length > 8){
            history.splice(history.length-1, 1);
        }
        
    } else{
        history.splice(index, 1);
        history.unshift(name);
    }

    localStorage.setItem("whistory", JSON.stringify(history));
}

function loadPopular(){
    var history = JSON.parse(localStorage.getItem("whistory"));
    if (!history){
        return;
    }
    elements.popularList.empty();
    for (let item of history){
        var btn = $("<button>");
        btn.attr("data-place", item);
        btn.on("click", savedButtonClickHandler);
        btn.text(item);
        elements.popularList.append(btn);
    }
}

function savedButtonClickHandler(event){
    var button = $(event.target);
    var name = button.attr("data-place");
    setCity(name);
    elements.searchInput.val(name)
}

function showError(message){
    var card = $("<div>");
    card.addClass("card");
    
    var h3 = $("<h3>");
    h3.text("location not found");
    card.append(h3);

    elements.currentSection.empty();
    elements.futureList.empty();
    elements.currentSection.append(card);

    elements.location.text("");

}

function setCity(city){
    var fetchUrl;
    var isZipCode = !isNaN(city)

    if (!isZipCode){
        fetchUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${key}`;
        
    }else{
        fetchUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${city}&appid=${key}`;
    }

    fetch(fetchUrl).then((response)=>{
        return response.json();
    }).then((data)=>{
        if (isZipCode){
            fetchWeather(data.lat, data.lon)
            elements.location.text(data.name);
            addToHistory(data.name);
            loadPopular();
        }else{
            fetchWeather(data[0].lat, data[0].lon)
            elements.location.text(data[0].name);
            addToHistory(data[0].name);
            loadPopular();
        }
        
    }).catch((error)=>{
        showError()
        console.log(error);
    }
    )
}

function fetchWeather(lat,lon){
    console.log(lat + " " + lon);
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`).then((currentResponse)=>{
        
        return currentResponse.json();
    
    }).then((currentData)=>{

        
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`).then((futureResponse)=>{
            return futureResponse.json();
        }).then((futureData)=>{

            buildAndRenderData(currentData, futureData)
        });

    });
}


function buildAndRenderData(current, forecast){

    var current = createWeatherCard(current);
    current.addClass("currentCard");
    elements.currentSection.empty();
    elements.currentSection.append(current);

    elements.futureList.empty();
    console.log(forecast);

    forecast.list.forEach((weather) => {
        var now = moment();
        var timeStamp = moment(weather.dt_txt, "YYYY-MM-DD hh:mm:ss");
        var future = timeStamp.isAfter(now, "day");
        console.log(future);
        if (!future){
            return;
        }

        if (timeStamp.format("H") == 0){
            var card = createWeatherCard(weather);
            elements.futureList.append(card);
        }
    });
}


loadPopular();

var hist = JSON.parse(localStorage.getItem("whistory"));
console.log(hist);
setCity(hist ? hist[0] : "Seattle");

elements.searchButton.on("click", function(event){
    event.preventDefault();
    if (!elements.searchInput.val()){
        return;
    }
    
    setCity(elements.searchInput.val());
})

elements.historyButton.on("click", function(event){
    if (elements.popularList.children().length == 0){
        return;
    }
    event.stopPropagation();
    if (!elements.popularList.hasClass("show")){
        elements.popularList.addClass("show");
    }else{
        elements.popularList.removeClass("show");
    }
})

document.addEventListener("click", function(){

    elements.popularList.removeClass("show");

})