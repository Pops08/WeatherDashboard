var userInput = document.querySelector("#userCity");
var userSubmit = document.querySelector("#userSbmt");
var ListOfCities = document.querySelector("#citiesList");
var currentAPI = "https://api.openweathermap.org/data/2.5/weather";
var dailyAPI = "https://api.openweathermap.org/data/2.5/forecast";
var oneAPI = "https://api.openweathermap.org/data/2.5/onecall"
var currentDate = moment().format('L');
var nxtDate = currentDate;
var lat;
var lon;


var loadCities = function () {
    for (var i = 0, len = localStorage.length; i < len; ++i) {

        var listItemEl = document.createElement("li");
        listItemEl.innerHTML = localStorage.getItem(localStorage.key(i));
        listItemEl.setAttribute("onclick", "setupAPI(this.textContent)");
        listItemEl.className = "list-group-item w-90";
        ListOfCities.appendChild(listItemEl);

    }
}

var addNewCities = function (event) {
    event.preventDefault();

    var userCity = userInput
        .value
        .trim();

    userCity = userCity.charAt(0).toUpperCase() + userCity.slice(1);

    console.log(userCity);

    if (!userCity) {
        alert("Please Populate A City!");
        return false;
    }


    if (!localStorage[userCity]) {
        var listItemEl = document.createElement("li");
        listItemEl.setAttribute("onclick", "setupAPI(this.textContent)")
        listItemEl.className = "list-group-item";
        listItemEl.innerHTML = userCity;
        ListOfCities.appendChild(listItemEl);
    }

    localStorage.setItem(userCity, userCity);
    setupAPI(userCity);

    userInput.value = '';

}

var setupAPI = function (selectedCity) {

    selectedCity = selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1);

    currentAPI += ("?appid=255c63d5cbb9f7dcec388da815af66fc" + "&units=imperial" + "&q=" + selectedCity);
    oneAPI += ("?appid=255c63d5cbb9f7dcec388da815af66fc" + "&units=imperial");

    callAPI(currentAPI, oneAPI);

    currentAPI = currentAPI.split('?appid')[0];
    oneAPI = oneAPI.split('?appid')[0];
}

var callAPI = function (apiString, apiString2) {

    fetch(apiString).then(function (response) {
        response.json().then(function (JSONresponse) {

            console.log(apiString);

            lat = JSONresponse.coord.lat;
            lon = JSONresponse.coord.lon;

            apiString2 += ("&lat=" + lat + "&lon=" + lon);

            var currentWeather = document.querySelector("#currentWeather");
            currentWeather.removeAttribute("hidden");

            var CityHeader = document.querySelector("#CityInput");
            CityHeader.innerHTML = JSONresponse.name + " (" + currentDate + ")";

            var inputIcon = document.querySelector("#icon");


            var rmvImg = document.querySelectorAll("img");

            for (i = 0; i < rmvImg.length; i++) {
                rmvImg[i].remove();
            }

            var imgEl = document.createElement("img");
            var iconcode = JSONresponse.weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

            imgEl.setAttribute("src", iconurl);
            inputIcon.appendChild(imgEl);



            var currentTemp = document.querySelector('#currentTemp');
            var currentHumidity = document.querySelector("#currentHumidity")
            var currentWind = document.querySelector("#currentWind");


            currentTemp.innerHTML = JSONresponse.main.temp + "°F";
            currentHumidity.innerHTML = JSONresponse.main.humidity + "%";
            currentWind.innerHTML = JSONresponse.wind.speed + "MPH";


            return fetch(apiString2)

        }).then(function (response) {
            if (response.ok) {
                response.json().then(function (JSONresponse) {

                    var currentUV = document.querySelector("#currentUV");

                    var getFiveDayDate = document.querySelectorAll("#fiveDayDate");
                    var getFiveDayIcon = document.querySelectorAll("#fiveDayIcon");
                    var getFiveDayTemp = document.querySelectorAll("#fiveDayTemp");
                    var getFiveDayHum = document.querySelectorAll("#fiveDayHum");

                    var dailyHeader = document.querySelector("#FiveDaysHeader");
                    dailyHeader.removeAttribute("hidden");

                    var dailyWeather = document.querySelector("#FiveDays");
                    dailyWeather.removeAttribute("hidden");

                    for (i = 0; i < getFiveDayDate.length; i++) {

                        var addNum = 1;
                        //var newDate = moment().add(addNum, 'days');
                        var nxtDate = moment(nxtDate).add(addNum, 'days').format("L");
                        //console.log(nxtDate);
                        getFiveDayDate[i].innerHTML = nxtDate;
                        addNum++


                        var imgEl = document.createElement("img");
                        var iconcode = JSONresponse.daily[i].weather[0].icon;
                        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                        imgEl.setAttribute("src", iconurl);
                        getFiveDayIcon[i].appendChild(imgEl);


                        getFiveDayTemp[i].innerHTML = JSONresponse.daily[i].temp.day + "°F";
                        getFiveDayHum[i].innerHTML = JSONresponse.daily[i].humidity + "%";

                    }


                    currentUV.innerHTML = JSONresponse.current.uvi;
                    if (currentUV.innerHTML <= 4) {
                        currentUV.className = "lowUV";

                    } else if (currentUV.innerHTML > 4 & currentUV.innerHTML <= 7) {
                        currentUV.className = "midUV";
                    } else if (currentUV.innerHTML > 7) {
                        currentUV.className = "highUV";
                    }
                })
            } else {
                return Promise.reject(response);
            }

        })
    })
}

loadCities();
userSubmit.addEventListener("click", addNewCities);
