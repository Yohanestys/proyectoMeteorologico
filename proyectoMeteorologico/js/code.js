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


const showCurrentTime = (tiempoActual, tiempoEntero) => {

    var parentDiv = document.createElement("div");
    parentDiv.style.position = "sticky";
    parentDiv.style.display = "flex";
    parentDiv.style.justifyContent = "center";
    parentDiv.style.backgroundColor = "rgba(128, 128, 128, 0.6)";
    parentDiv.style.marginBottom = "4%";
    parentDiv.style.top = "2%";
    container.appendChild(parentDiv);


    var parent2Div = document.createElement("div");
    parent2Div.style.display = "flex";
    parent2Div.style.justifyContent = "center";
    container.appendChild(parent2Div);


    var div = document.createElement("div");
    div.style.backgroundColor = "rgba(128, 128, 128, 0.6)"
    div.style.paddingRight = "2em";
    div.style.marginRight = "1px";
    div.style.borderRadius = "5px";
    div.style.borderTopRightRadius = "0";
    div.style.borderBottomRightRadius = "0";
    parent2Div.appendChild(div);


    var div2 = document.createElement("div");
    parentDiv.appendChild(div2);


    var div3 = document.createElement("div");
    div3.style.backgroundColor = "rgba(128, 128, 128, 0.6)";
    div3.style.display = "flex";
    div3.style.flexDirection = "column";
    div3.style.justifyContent = "center";
    div3.style.alignContent = "center";
    div3.style.alignItems = "center";
    div3.style.borderRadius = "5px";
    div3.style.borderTopLeftRadius = "0";
    div3.style.borderBottomLeftRadius = "0";
    parent2Div.appendChild(div3);

    var divs = [];
    var span = [];
    var i = 0;
    while (i < 8) {

        span[i] = document.createElement("span");

        if (i < 6) {

            divs[i] = document.createElement("div");
            divs[i].appendChild(span[i]);
            div.appendChild(divs[i]);
            divs[i].style.display = "flex";
            divs[i].style.justifyContent = "center";
            divs[i].style.alignContent = "center";
            divs[i].style.alignItems = "center";
            divs[i].style.flexDirection = "row";
            divs[i].style.flexWrap = "wrap";
            divs[i].style.flex = "1";
            divs[i].style.padding = "2px";
        }

        if (i < 6) {
            span[i].style.fontSize = "0.8em";
            span[i].style.border = "1px solid gray";
            span[i].style.borderLeft = "0";
            span[i].style.borderRight = "0";
        }

        span[i].style.padding = "5px";
        span[i].style.color = "#fff";
        span[i].style.width = "100%";
        span[i].style.textAlign = "justify";
        i++;
    }

    span[0].textContent = ` Máx ${tiempoEntero.daily[0].temp.max}℃`
    span[1].textContent = ` Min ${tiempoEntero.daily[0].temp.min}℃`
    span[2].textContent = ` Humedad ${tiempoActual.main.humidity}%`;
    span[3].textContent = ` Viento ${tiempoActual.wind.speed}`;
    span[4].textContent = ` Presión ${tiempoActual.main.pressure}.0 mbar`;
    span[5].textContent = ` Nublado ${tiempoActual.clouds.all}%`;

    span[6].style.fontSize = "2.4em";
    span[7].style.fontSize = "8.4em";
    span[6].textContent = `Hoy en ${tiempoActual.name}`;
    var sup = document.createElement("sup");
    sup.textContent = "℃";
    sup.style.color = "#fff";
    sup.style.fontSize = "0.5em";
    sup.style.alignSelf = "flex-end";
    //sup.style.justifySelf = "flex-start";
    span[7].textContent = `${(tiempoActual.main.temp)}`;
    span[7].style.backgroundColor = "transparent";
    /*** */
    if (tiempoActual.weather[0].icon) {
        var img = document.createElement("img");
        var ruta = (`${imgRuta}${tiempoActual.weather[0].icon}${extension}`);
        console.log(ruta);
        img.setAttribute("src", ruta);
        img.setAttribute("alt", "weather icon");
        img.style.borderRadius = "5px";
        //img.style.alignSelf = "flex-end";
        div2.appendChild(span[6]); // Título
        div3.insertBefore(img, div3.firstChild);
        div3.insertBefore(span[7], sup.nextSibling);
        span[7].insertBefore(sup, span[7].nextSibling);

    }

    div.style.textAlign = "center";
    div.style.textShadow = "3px 3px gray";
    div.style.fontSize = "2em";

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
    div.style.marginTop = "8.5%";
    //div.style.backgroundColor = "rgba(255, 255, 255, 0.3)";

    var dias = 7;
    var a;
    for (var i = 0; i < dias; i++) {
        if (tiempoEntero.daily[i].weather[0].icon) {
            diaSiguiente += 1;
            var index = (i);
            var indexMiddle = (index + 1);
            var indexMax = (indexMiddle + 1);
            var span = [];
            var divs = [];

            divs[i] = document.createElement("div");
            divs[i].setAttribute("class", "tiempoSemana");
            divs[i].style.display = "flex";
            divs[i].style.justifyContent = "center";
            divs[i].style.alignContent = "center";
            divs[i].style.flexDirection = "column";
            divs[i].style.padding = "1em";
            divs[i].style.backgroundColor = "rgba(128,128,128, 0.6)";
            divs[i].style.margin = "2em 0.2em";
            divs[i].style.borderRadius = "5px";

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

            if (diaSiguiente >= 7) {
                diaSiguiente = 0;
            }

            if (indexMiddle === 1) {
                span[index].textContent = `${diaDeManiana}`;
                if (diaSiguiente === 6) {
                    diaSiguiente += indexMiddle;
                }
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
    var body = document.body;
    body.style.backgroundImage = "url('img/seasonWalpaller3.jpg')";
    container = document.getElementsByTagName("div")[0];
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


        setTimeout(getAllTime(position), 3600000);
        var tiempoEntero = JSON.parse(window.localStorage.getItem("tiempoEntero"));
        showCurrentTime(tiempoActual, tiempoEntero);
        showAllTime(tiempoEntero);

    } else {
        console.log("El navegador no suporta geolocalización");
    }

}