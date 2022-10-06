var elements = {
    currentSection: $("#currentSection"),
    futureList: $("#futureList"),
    searchButton: $("searchButton"),
    searchInput: $("searchInput")
}

var key = "91334187c2181ae5f6e0ad1855dff301";

function createWeatherCard(data){

    var type = data.weather.main;
    var description = data.weather.description;
    var temp = data.main.temp;
    var wind = data.wind.speed;
    var hum = data.main.humidity;
    var icon = data.weather[0].icon;

    var date;
    if (data.dt_txt){
        date = moment(data.dt_txt, "YYYY-MM-DD").format("M/D");
    }else{
        date = moment().format("M/D");
    }

    var div = $("<div>");
    div.addClass("card");

    // var type = date.format //todo: calculate whether its future or current
    // div.addClass(type);

    var dateh3 = $("<h3>");
    dateh3.text(date);
    div.append(dateh3);

    var img = $("<img>");
    img.attr("src", `https://openweathermap.org/img/wn/${icon}.png`)
    div.append(img);

    var temph4 = $("<h4>");
    temph4.text("Temp: " +temp);
    div.append(temph4);

    var windh4 = $("<h4>");
    windh4.text("Wind: " + wind);
    div.append(windh4);

    var humh4 = $("<h4>");
    humh4.text("Humidity: " + hum);
    div.append(humh4);

    return div;
}


function setCity(city){
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${key}`).then((response)=>{
        return response.json();
    }).then((data)=>{
        fetchWeather(data[0].lat, data[0].lon)
    })
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

searchButton.addEventListener("click", function(){
    setCity("spokane");
})