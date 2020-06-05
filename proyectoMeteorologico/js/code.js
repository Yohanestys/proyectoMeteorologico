var container;
var lista = [];
var correct;
const webCurrentTime = "http://api.openweathermap.org/data/2.5/weather"; // Current Time
const webAllTime = "http://api.openweathermap.org/data/2.5/onecall" /* all*/
const key = "9618be28d5189a72838204ce9259c84d";
const imgRuta = "http://openweathermap.org/img/wn/";
const extension = "@2x.png";
const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const diaDeManiana = "Mañana";
const indexDia = new Date().getDay();
var position;

const getGeolocation = () => {
    if (navigator.geolocation) {
        return new Promise(() => {
            navigator.geolocation.getCurrentPosition((position) => {
                var pos = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                var lista = [];
                lista.push(pos);
                window.localStorage.setItem("coordinates", JSON.stringify(lista));
            });

        });

    } else {
        var lista = [];
        var pos = { latitude: "El navegador no suporta geolocalización", longitude: "El navegador no suporta geolocalización" };
        lista.push(pos);
        return lista;
    }

}

const main = () => {
    getGeolocation().then();
}

const getCurrentTime = (pos) => {
    var params = {
        lon: pos.longitude,
        lat: pos.latitude,
        appid: key,
        'units': 'metric',
        exclude: ['minutely', 'hourly']
    }

    $.getJSON(webCurrentTime, params, function(js) {

        var json = JSON.stringify(js, (key, value) => {
            if (key === "temp") {
                //value = ((value - 273.15).toFixed(1));
                value = ((value - 0).toFixed(1));

            }
            return value;
        });

        window.localStorage.setItem("tiempoActual", json);
        //console.log(json);

    });

}

const getAllTime = (pos) => {
    var params = {
        'lon': pos.longitude,
        'lat': pos.latitude,
        'appid': key,
        'units': 'metric',
        'exclude': ['minutely', 'hourly']
    }

    $.getJSON(webAllTime, params, js => {
        var json = JSON.stringify(js, (key, value) => {

            if (key === "day" || key === "night" || key === "min" || key === "max" || key === "eve" || key === "morn") {
                value = ((value - 0).toFixed(1));
            }

            return value;
        });
        window.localStorage.setItem("tiempoEntero", json);
        //console.log("All time " + json);
    });

}


const showCurrentTime = (tiempoActual) => {
    var div = document.createElement("div");
    div.style.width = "100%";
    div.style.position = "sticky";
    div.style.top = "3%";
    //div.style.borderBottom = "150px solid rgba(128,128,128, 0.7)"
    var divs = [];
    var span = [];
    var i = 0;
    while (i < 6) {

        divs[i] = document.createElement("div");
        span[i] = document.createElement("span");
        divs[i].appendChild(span[i]);
        divs[i].style.display = "flex";
        divs[i].style.justifyContent = "center";
        divs[i].style.flexWrap = "wrap";
        divs[i].style.flex = "1";
        if (i > 2) {
            span[i].style.fontSize = "0.8em";
        }

        //div.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
        span[i].style.padding = "5px";
        span[i].style.borderRadius = "5px";
        span[i].style.color = "#fff";
        div.appendChild(divs[i]);
        divs[i].style.backgroundColor = "rgba(128, 128, 128, 0.6)";
        i++;
    }

    //divs[2].style.backgroundColor = "rgba(128, 128, 128, 0.6)";
    divs[2].style.transition = "rgba(128, 128, 128, 0), .5s";
    span[2].style.fontSize = "2.4em";

    span[0].textContent = `Hoy`;
    span[1].textContent = `El tiempo actual en ${tiempoActual.name} es`;
    span[2].textContent = `${(tiempoActual.main.temp)}℃`;
    span[3].textContent = ` máx ${tiempoActual.main.temp_max}℃`
    span[4].textContent = ` min ${tiempoActual.main.temp_min}℃`
    span[5].textContent = ` Humedad ${tiempoActual.main.humidity}%`;

    /*** */
    if (tiempoActual.weather[0].icon) {
        var img = document.createElement("img");
        var ruta = (`${imgRuta}${tiempoActual.weather[0].icon}${extension}`);
        console.log(ruta);
        img.setAttribute("src", ruta);
        img.setAttribute("alt", "weather icon");
        img.style.borderRadius = "5px";
        divs[2].insertBefore(img, divs[2].firstChild);

    }

    div.style.textAlign = "center";
    div.style.textShadow = "3px 3px gray";
    div.style.fontSize = "2em";
    container.appendChild(div);
}


const showAllTime = (tiempoEntero) => {
    var diaSiguiente = indexDia;
    var div = document.createElement("div");
    container.insertBefore(div, container.lastChild.nextSibling);
    //**** */
    div.style.width = "100%";
    //div.style.height = "30%";
    div.style.marginTop = "0em";
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.alignContent = "center";
    div.style.flexWrap = "wrap";
    div.style.position = "relative";
    div.style.bottom = "0";
    div.style.marginTop = "11.5%";
    //div.style.backgroundColor = "rgba(255, 255, 255, 0.3)";

    var dias = 7;
    var a;
    for (var i = 0; i < dias; i++) {
        if (tiempoEntero.daily[i].weather[0].icon) {
            var index = (i);
            var indexMiddle = (index + 1);
            var indexMax = (indexMiddle + 1);
            diaSiguiente += 1;
            var span = [];
            var divs = [];
            divs[i] = document.createElement("div");
            divs[i].setAttribute("class", "tiempoSemana");
            divs[i].style.display = "flex";
            divs[i].style.justifyContent = "center";
            divs[i].style.alignContent = "center";
            divs[i].style.flexDirection = "column";
            divs[i].style.padding = "1em";

            //divs[i].style.border = "1px solid gray";
            divs[i].style.backgroundColor = "rgba(128,128,128, 0.6)";
            divs[i].style.margin = "2em 0.2em";
            divs[i].style.borderRadius = "5px";
            if (div.style.display === "flex") {
                divs[i].style.borderLeft = "0";
            }

            if (divs[0] != undefined) {
                divs[0].style.borderLeft = "1px solid gray";
            }


            if (i >= 3) {
                divs[i].style.display = "none";

            }

            span[index] = document.createElement("span");
            span[indexMiddle] = document.createElement("span");
            span[indexMax] = document.createElement("span");;
            var img = document.createElement("img");

            var icon = tiempoEntero.daily[(i + 1)].weather[0].icon;
            var ruta = (`${imgRuta}${icon}${extension}`);
            img.setAttribute("src", ruta);
            img.setAttribute("alt", `"weather icon ${(i+1)}"`);

            if (indexMiddle === 1) {
                span[index].textContent = `${diaDeManiana}`;
            } else if (diaSiguiente === 7) {
                diaSiguiente = 0;
                span[index].textContent = `${diasSemana[diaSiguiente]}`;
            } else {
                span[index].textContent = `${diasSemana[diaSiguiente]}`;

            }
            span[indexMiddle].textContent = `${tiempoEntero.daily[(i+1)].temp.max} ℃`
            span[indexMax].textContent = `${tiempoEntero.daily[(i+1)].temp.min} ℃`

            span[index].style.color = "#fff";
            span[index].style.fontSize = "1.4em";

            span[indexMiddle].style.color = "#fff";
            span[indexMiddle].style.fontSize = "1em";
            span[indexMiddle].style.paddingTop = "0.1em";

            span[indexMax].style.color = "#fff";
            span[indexMax].style.fontSize = "1em";

            divs[i].appendChild(span[index]);
            divs[i].insertBefore(img, divs[i].nextSibling);
            divs[i].appendChild(span[indexMiddle]);
            divs[i].appendChild(span[indexMax]);
            divs[i].style.alignItems = "center";
            div.appendChild(divs[i]);

            correct = false;
            if (a === undefined) {
                a = document.createElement("a");
            }
            a.style.textDecoration = "none";
            a.style.color = "#fff";
            a.style.backgroundColor = "rgba(128,128,128, 0.6)";
            a.style.height = "2em";
            a.style.padding = "0.5em";
            a.setAttribute("href", "#");
            a.setAttribute("class", "fas fa-angle-right");
            a.style.borderRadius = "5px";
            a.style.alignSelf = "center";
            a.style.fontSize = "2em";
            div.insertBefore(a, div.lastChild.nextSibling);
            a.addEventListener('click', () => { showHideDivs(a, div); });

        }
    }

}

function showHideDivs(a, div) {
    var divs = document.getElementsByClassName("tiempoSemana");
    if (divs[divs.length - 1].style.display === "flex") {
        for (var i = 0; i < divs.length; i++) {
            if (i >= 3) {
                divs[i].style.display = "none";
                a.removeAttribute("class");
                a.setAttribute("class", "fas fa-angle-right");
                a.style.backgroundColor = "rgba(128,128,128, 0.6)";
                a.style.color = "#fff";

            }
        }
    } else {
        for (var i = 0; i < divs.length; i++) {
            if (i >= 3) {
                divs[i].style.display = "flex";
                a.removeAttribute("class");
                a.setAttribute("class", "fas fa-angle-left");
                a.style.backgroundColor = "rgba(255,255,255, 0.6)";
                a.style.color = "gray";


            }
        }
    }

}


window.onload = () => {
    container = document.getElementsByTagName("div")[0];
    var body = document.body;
    body.style.backgroundImage = "url('img/seasonWalpaller3.jpg')";
    container.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    main();
    console.log("Hola mundo cruel!");
    lista = JSON.parse(window.localStorage.getItem("coordinates"));
    if (lista != null) {
        for (var pos of lista) {
            console.log("Latitud: " + pos.latitude);
            console.log("Longitud: " + pos.longitude);
            position = pos;
        }

        setTimeout(getCurrentTime(position), 3600000);
        console.log("Position.lan " + position.latitude);
        var tiempoActual = JSON.parse(window.localStorage.getItem("tiempoActual"));
        showCurrentTime(tiempoActual);

        setTimeout(getAllTime(position), 3600000);
        var tiempoEntero = JSON.parse(window.localStorage.getItem("tiempoEntero"));
        showAllTime(tiempoEntero);

    } else {
        console.log("El navegador no suporta geolocalización");
    }

}