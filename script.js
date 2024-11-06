let PI = 3.141592654
let A = 6378137
let B = 6356752.3142
let F = 1/298.257223563
let fes = 0.00669438
let ses = 0.006739

let result = false;

// 4766417
// 2818986.88
// 3154556

let cartGeoForm = document.getElementById("cart_geo_form")
if (cartGeoForm) {
    cartGeoForm.addEventListener("submit", convertToGeo)
}

let geoCartForm = document.getElementById("geo_cart_form")
if (geoCartForm) {
    geoCartForm.addEventListener("submit", convertToCart)
}

// void ConvertFromGeodeticTOCartesian(double Ph, double Lam,double H)
// {

// }

function convertToCart() {
    if (result) {
        document.getElementById("result").removeChild(document.getElementById("x"))
        document.getElementById("result").removeChild(document.getElementById("y"))
        document.getElementById("result").removeChild(document.getElementById("z"))
    }

    let phiaDeg = parseFloat(document.getElementById("phai_deg").value)
    let phiaMin = parseFloat(document.getElementById("phai_min").value)
    let phiaSec = parseFloat(document.getElementById("phai_sec").value)

    let Ph = ConvertDMSToRadians(phiaDeg, phiaMin, phiaSec)

    let lamdaDeg = parseFloat(document.getElementById("lamda_deg").value)
    let lamdaMin = parseFloat(document.getElementById("lamda_min").value)
    let lamdaSec = parseFloat(document.getElementById("lamda_sec").value)

    let Lam = ConvertDMSToRadians(lamdaDeg, lamdaDeg, lamdaSec)

    console.log(Ph)
    console.log(Lam)

    let H = parseFloat(document.getElementById("h").value)

    let N = A / Math.sqrt((1 - (fes * Math.pow(Math.sin(Ph), 2))))
    let x = (N + H) * Math.cos(Ph) * Math.cos(Lam)
    let y = (N + H) * Math.cos(Ph) * Math.sin(Lam)
    let z = ((Math.pow(B, 2) / Math.pow(A, 2)) * N + H) * Math.sin(Ph)

    let xP = document.createElement("p")
    let yP = document.createElement("p")
    let zP = document.createElement("p")

    xP.setAttribute("id", "x");
    yP.setAttribute("id", "y");
    zP.setAttribute("id", "z")

    xP.innerText = "X: " + x.toFixed(2)
    yP.innerText = "Y: " + y.toFixed(2)
    zP.innerText = "Z: " + z.toFixed(2)

    document.getElementById("result").appendChild(xP)
    document.getElementById("result").appendChild(yP)
    document.getElementById("result").appendChild(zP)

    result = true;
}

function convertToGeo(event) {
    if (result) {
        document.getElementById("result").removeChild(document.getElementById("phia"))
        document.getElementById("result").removeChild(document.getElementById("lambda"))
        document.getElementById("result").removeChild(document.getElementById("hp"))
    }
    
    let x = parseFloat(document.getElementById("x").value)
    let y = parseFloat(document.getElementById("y").value)
    let z = parseFloat(document.getElementById("z").value)

    let P = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    let up = z * A
    let down = P * B
    let fn = up / down
    let Theta = Math.atan(fn);
    let Numi = z + ses * B * Math.pow(Math.sin(Theta), 3)
    let Deno = P - fes * A * Math.pow(Math.cos(Theta), 3)
    let Phai= Math.atan(Numi / Deno);
    let N = A / Math.sqrt((1 - (fes * Math.pow(Math.sin(Phai), 2))))
    let Lamda = Math.atan(y / x)
    let H = (P / Math.cos(Phai)) - N

    let phaiDMS = ConvertFromRadianToDMS(Phai)
    let lambdaDMS = ConvertFromRadianToDMS(Lamda)

    let phaiP = document.createElement("p")
    let lambdaP = document.createElement("p")
    let HP = document.createElement("p")

    phaiP.setAttribute("id", "phia");
    lambdaP.setAttribute("id", "lambda");
    HP.setAttribute("id", "hp")

    phaiP.innerText = "Phai: " + phaiDMS.angle + " " + phaiDMS.minutes + "' " + phaiDMS.seconds + '" '
    lambdaP.innerText = "Lamda: " +  lambdaDMS.angle + " " + lambdaDMS.minutes + "' " + lambdaDMS.seconds + '"'
    HP.innerText = "Heigh: " + H.toFixed(2)

    document.getElementById("result").appendChild(phaiP)
    document.getElementById("result").appendChild(lambdaP)
    document.getElementById("result").appendChild(HP)

    result = true;
}

function ConvertDMSToRadians(degrees, minutes, seconds) {
    let totalDegrees = degrees + (minutes / 60.0) + (seconds / 3600.0)
    return totalDegrees * (PI / 180.0)
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