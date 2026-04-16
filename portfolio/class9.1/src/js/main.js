window.requestAnimFrame = (function () {
    return window.requestAnimationFrame;
})();

var canvas = document.getElementById("universe");
var ctx = canvas.getContext("2d");
var animateUniverse = true;

var clouds = [];
var sparkles = [];
var hills = [];
var trees = [];

function initScene() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createClouds();
    createSparkles();
    createTrees();
}

function createClouds() {
    clouds = [];

    for (var i = 0; i < 7; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: 50 + Math.random() * (canvas.height * 0.22),
            size: 0.7 + Math.random() * 0.9,
            speed: 0.15 + Math.random() * 0.25
        });
    }
}

function createSparkles() {
    sparkles = [];

    for (var i = 0; i < 80; i++) {
        sparkles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height * 0.55),
            r: 1 + Math.random() * 2,
            a: 0.2 + Math.random() * 0.6
        });
    }
}

function createTrees() {
    trees = [];

    for (var i = 0; i < 18; i++) {
        trees.push({
            x: Math.random() * canvas.width,
            y: canvas.height * 0.78 + Math.random() * 90,
            scale: 0.7 + Math.random() * 1.1
        });
    }
}

function drawSky() {
    var sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, "#73d8ff");
    sky.addColorStop(0.32, "#a6ebff");
    sky.addColorStop(0.56, "#daf8ff");
    sky.addColorStop(0.57, "#8ce071");
    sky.addColorStop(0.8, "#4fb758");
    sky.addColorStop(1, "#2f843c");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSun() {
    var sunX = canvas.width * 0.82;
    var sunY = canvas.height * 0.16;

    var glow = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, 90);
    glow.addColorStop(0, "rgba(255,250,180,1)");
    glow.addColorStop(0.5, "rgba(255,220,80,0.92)");
    glow.addColorStop(1, "rgba(255,200,50,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
    ctx.fill();
}

function drawCloud(x, y, scale) {
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.beginPath();
    ctx.arc(x, y, 26 * scale, 0, Math.PI * 2);
    ctx.arc(x + 28 * scale, y - 12 * scale, 24 * scale, 0, Math.PI * 2);
    ctx.arc(x + 58 * scale, y, 28 * scale, 0, Math.PI * 2);
    ctx.arc(x + 26 * scale, y + 10 * scale, 30 * scale, 0, Math.PI * 2);
    ctx.fill();
}

function drawClouds() {
    for (var i = 0; i < clouds.length; i++) {
        var c = clouds[i];
        drawCloud(c.x, c.y, c.size);
        c.x += c.speed;

        if (c.x > canvas.width + 120) {
            c.x = -140;
        }
    }
}

function drawSparkles() {
    for (var i = 0; i < sparkles.length; i++) {
        var s = sparkles[i];
        ctx.fillStyle = "rgba(255,255,255," + s.a + ")";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawMountains() {
    ctx.fillStyle = "#63ba5d";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(0, canvas.height * 0.67);
    ctx.lineTo(canvas.width * 0.10, canvas.height * 0.52);
    ctx.lineTo(canvas.width * 0.20, canvas.height * 0.69);
    ctx.lineTo(canvas.width * 0.34, canvas.height * 0.46);
    ctx.lineTo(canvas.width * 0.47, canvas.height * 0.73);
    ctx.lineTo(canvas.width * 0.63, canvas.height * 0.50);
    ctx.lineTo(canvas.width * 0.78, canvas.height * 0.72);
    ctx.lineTo(canvas.width, canvas.height * 0.56);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#41984b";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(0, canvas.height * 0.80);
    ctx.lineTo(canvas.width * 0.12, canvas.height * 0.74);
    ctx.lineTo(canvas.width * 0.24, canvas.height * 0.84);
    ctx.lineTo(canvas.width * 0.38, canvas.height * 0.73);
    ctx.lineTo(canvas.width * 0.54, canvas.height * 0.86);
    ctx.lineTo(canvas.width * 0.68, canvas.height * 0.74);
    ctx.lineTo(canvas.width * 0.84, canvas.height * 0.87);
    ctx.lineTo(canvas.width, canvas.height * 0.79);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
}

function drawPath() {
    ctx.fillStyle = "#d2b174";
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.42, canvas.height);
    ctx.quadraticCurveTo(
        canvas.width * 0.47,
        canvas.height * 0.78,
        canvas.width * 0.49,
        canvas.height * 0.62
    );
    ctx.quadraticCurveTo(
        canvas.width * 0.51,
        canvas.height * 0.48,
        canvas.width * 0.55,
        canvas.height * 0.36
    );
    ctx.lineTo(canvas.width * 0.65, canvas.height * 0.36);
    ctx.quadraticCurveTo(
        canvas.width * 0.57,
        canvas.height * 0.48,
        canvas.width * 0.56,
        canvas.height * 0.62
    );
    ctx.quadraticCurveTo(
        canvas.width * 0.54,
        canvas.height * 0.78,
        canvas.width * 0.52,
        canvas.height
    );
    ctx.closePath();
    ctx.fill();
}

function drawTree(x, y, scale) {
    ctx.fillStyle = "#7a4d22";
    ctx.fillRect(x - 6 * scale, y - 24 * scale, 12 * scale, 28 * scale);

    ctx.fillStyle = "#2f8a43";
    ctx.beginPath();
    ctx.arc(x, y - 34 * scale, 22 * scale, 0, Math.PI * 2);
    ctx.arc(x - 14 * scale, y - 24 * scale, 16 * scale, 0, Math.PI * 2);
    ctx.arc(x + 14 * scale, y - 24 * scale, 16 * scale, 0, Math.PI * 2);
    ctx.fill();
}

function drawTrees() {
    for (var i = 0; i < trees.length; i++) {
        var t = trees[i];
        drawTree(t.x, t.y, t.scale);
    }
}

function drawCreatureHouse() {
    var baseX = canvas.width * 0.72;
    var baseY = canvas.height * 0.60;

    ctx.fillStyle = "#f6f1e8";
    ctx.fillRect(baseX, baseY, 120, 78);

    ctx.fillStyle = "#d94d4d";
    ctx.beginPath();
    ctx.moveTo(baseX - 10, baseY);
    ctx.lineTo(baseX + 60, baseY - 52);
    ctx.lineTo(baseX + 130, baseY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#6ea8ff";
    ctx.fillRect(baseX + 18, baseY + 18, 24, 20);
    ctx.fillRect(baseX + 78, baseY + 18, 24, 20);

    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(baseX + 50, baseY + 36, 24, 42);

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(baseX + 102, baseY - 12, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ff4b4b";
    ctx.beginPath();
    ctx.arc(baseX + 102, baseY - 12, 14, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(baseX + 88, baseY - 14, 28, 4);
    ctx.beginPath();
    ctx.arc(baseX + 102, baseY - 12, 4, 0, Math.PI * 2);
    ctx.fill();
}

function renderScene() {
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        initScene();
    }

    drawSky();
    drawSun();
    drawSparkles();
    drawClouds();
    drawMountains();
    drawPath();
    drawTrees();
    drawCreatureHouse();
}

function animateScene() {
    if (animateUniverse) {
        requestAnimFrame(animateScene);
    }
    renderScene();
}

window.addEventListener("resize", function () {
    initScene();
});

function select(element) {
    element.style.animation = "selectoption 0.2s cubic-bezier(0.86, 0, 0.07, 1)";

    setTimeout(function () {
        element.style.animation = "";
        goScreen(element.textContent.trim());
    }, 200);
}

function goScreen(name) {
    switch (name) {
        case "NewGame":
            window.location.href = "./viewer/nivel1.html";
            break;
        case "Characters":
            window.location.href = "./viewer/characters.html";
            break;
        case "Settings":
            window.location.href = "./viewer/settings.html";
            break;
        case "Exit":
            alert("Thanks for playing Pokemon World");
            break;
        default:
            console.log("Unknown option:", name);
            break;
    }
}

window.addEventListener("load", function () {
    initScene();
    animateScene();

    var audio = document.getElementById("miAudio");

    var reproducir = function () {
        audio.play().then(function () {
            document.removeEventListener("click", reproducir);
            document.removeEventListener("keydown", reproducir);
        }).catch(function () {
            console.log("Esperando interacción real...");
        });
    };

    document.addEventListener("click", reproducir);
    document.addEventListener("keydown", reproducir);
});