const PI = 22 / 7

const form = document.querySelector(".conversion_form")
form.addEventListener("submit", handleSubmission) 

function handleSubmission(event) {
    event.preventDefault()

    let lat = extractDMS("lat")
    let lambda = extractDMS("lambda")
    let H = parseInt(document.querySelector("#H").value)
    let N = parseInt(document.querySelector("#N").value)
    let zeta = extractDMS("zeta")
    let eta = extractDMS("eta")

    let [geo_lat, geo_lambda, geo_h] = convertToGeo(lat, lambda, H, N, zeta, eta)

    displayResults(geo_lat, geo_lambda, geo_h)
}

function extractDMS(angleName) {
    let degrees = parseInt(document.querySelector("#" + angleName + "_deg").value)
    let minutes = parseInt(document.querySelector("#" + angleName + "_min").value)
    let seconds = parseInt(document.querySelector("#" + angleName + "_sec").value)

    return {degrees, minutes, seconds}
}

function displayResults(geo_lat, geo_lambda, geo_h) {
    document.querySelector(".geo_lat").textContent = DMSToString(geo_lat)
    document.querySelector(".geo_lambda").textContent = DMSToString(geo_lambda)
    document.querySelector(".geo_height").textContent = geo_h + "m"
}

function DMSToString(dms) {
    return dms.degrees + "°" + dms.minutes + "'" + dms.seconds + '"'
}

function convertToGeo(lat, lambda, H, N, zeta, eta) {
    let geo_lat = subtractDMS(lat, zeta)

    let geo_lambda = ConvertDMSToDegs(lambda.degrees, lambda.minutes, lambda.seconds) - (ConvertDMSToDegs(eta.degrees, eta.minutes, eta.seconds) / (Math.cos(ConvertDMSToRadians(geo_lat.degrees, geo_lat.minutes, geo_lat.seconds))))
    geo_lambda = convertFromDegsToDMS(geo_lambda)

    let geo_h = H + N 

    return [geo_lat, geo_lambda, geo_h]
}

function subtractDMS(minuend, subtrahend) {
    let { degrees: deg1, minutes: min1, seconds: sec1 } = minuend;
    let { degrees: deg2, minutes: min2, seconds: sec2 } = subtrahend;

    let sec = sec1 - sec2;
    if (sec < 0) {
        sec += 60;
        min1 -= 1;
    }

    let min = min1 - min2;
    if (min < 0) {
        min += 60; 
        deg1 -= 1;
    }

    let deg = deg1 - deg2;

    return { degrees: deg, minutes: min, seconds: sec };
}

function ConvertDMSToDegs(degrees, minutes, seconds) {
    let totalDegrees = degrees + (minutes / 60.0) + (seconds / 3600.0)
    return totalDegrees
}

function ConvertDMSToRadians(degrees, minutes, seconds) {
    let totalDegrees = degrees + (minutes / 60.0) + (seconds / 3600.0)
    return totalDegrees * (PI / 180.0)
}

function convertFromDegsToDMS(degrees) {
    let deg = Math.floor(degrees);

    let minutes = (degrees - deg) * 60;
    let min = Math.floor(minutes);

    let seconds = (minutes - min) * 60;
    let sec = Math.round(seconds);

    return {
        degrees: deg,
        minutes: min,
        seconds: sec
    };
}

function ConvertFromRadianToDMS(angle) {
    angle = angle * 180 / PI
    let minutes = (angle - Math.floor(angle)) * 60
    let seconds = (minutes - Math.floor(minutes)) * 60
    angle = Math.floor(angle)
    minutes = Math.floor(minutes)
    seconds = Math.floor(seconds)
    return {
        angle,
        minutes,
        seconds
    }
}