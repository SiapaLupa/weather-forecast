var UNIT;
(function (UNIT) {
    UNIT["Fahrenheit"] = "imperial";
    UNIT["Celcius"] = "metric";
    UNIT["Kelvin"] = "standard";
})(UNIT || (UNIT = {}));
var STATE = {
    Jakarta: {
        longitude: 106.83941918790306,
        latitude: -6.208422090924453,
    },
};
var ENVIRONMENT_VARIABLE = {
    API_KEY: "b1eee6bebf83532f24b7c835dbdc3918",
    API_URL: "https://api.openweathermap.org/data/2.5/forecast",
};
var table = document.querySelector("table");
function getFetchUrl(state, unit) {
    if (unit === void 0) { unit = "standard"; }
    var longitude = state.longitude, latitude = state.latitude;
    var resultUrl = "".concat(this.API_URL, "?lat=").concat(latitude, "&lon=").concat(longitude, "&appid=").concat(this.API_KEY);
    return resultUrl.concat("&units=", unit);
}
fetch(getFetchUrl.call(ENVIRONMENT_VARIABLE, STATE.Jakarta, UNIT.Celcius))
    .then(function (response) {
    if (!response.ok)
        throw new Error("Failed to Fetch!");
    return response.json();
})
    .then(function (responseJson) {
    var duplicateDate = "";
    console.table(responseJson.list);
    responseJson.list.forEach(function (list, index) {
        var itemDate = list.dt_txt.split(" ")[0];
        if (itemDate === duplicateDate || index <= 4)
            return;
        duplicateDate = itemDate;
        var tr = document.createElement("tr");
        var dateString = new Intl.DateTimeFormat("en-US", {
            dateStyle: "full",
        }).format(new Date(itemDate));
        var dateArray = dateString.split(" ");
        // Switch element in between index position 1 and 2
        dateArray.splice(1, 1, dateArray.splice(2, 1, dateArray[1]).toString());
        dateArray.forEach(function (date, index) {
            var td = document.createElement("td");
            var text = [
                date.substring(0, 3) + ", ",
                date.slice(0, -1),
                date.substring(0, 3),
                date.concat(": ", String(list.main.temp.toFixed(2)), "&#8451"),
            ];
            td.innerHTML = text[index];
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
})
    .catch(function (error) {
    console.error(error.message);
});
