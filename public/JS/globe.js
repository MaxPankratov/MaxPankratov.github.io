import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';

// DATA IMPORT
let data = [];
let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(xhttp.responseText);
        let output = Object.values(response);
        for (let i = 0; i < output.length; i++) {
            data.push(output[i]);
        }
    }
};
xhttp.open("GET", "../DATA/Final_data.json", true);
xhttp.send();
console.log(data);


let ID = 833
    fetch(`https://api.openweathermap.org/data/2.5/weather?id=${ID}&appid=b104ae7f003915dad5de7ad6ca20c2fc`)
        .then(function (resp) { return resp.json() })
        .then(function (data) {
            console.log(data)
            document.querySelector('.weather-box').append(`${data.name}`);
        })


// THREEJS CODE

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();
const touch = new THREE.Vector2();

//'../IMAGES/earthmap4k.jpg'

let earthMap = new THREE.TextureLoader().load('../IMAGES/earthmap4k.jpg');

let earthBumpMap = new THREE.TextureLoader().load('../IMAGES/earthbump4k.jpg');

let earthSpecMap = new THREE.TextureLoader().load('../IMAGES/earthspec4k.jpg');

let earthGeometry = new THREE.SphereGeometry( 10, 32, 32);

let earthMaterial = new THREE.MeshPhongMaterial({
    map: earthMap,
    bumpMap: earthBumpMap,
    bumpScale: 0.10,
    specularMap: earthSpecMap,
    specular: new THREE.Color('grey')
});

let earth = new THREE.Mesh(earthGeometry, earthMaterial);

scene.add( earth );

let earthCloudGeo = new THREE.SphereGeometry(9.88, 32, 32);

let earthCloudsTexture = new THREE.TextureLoader().load('../IMAGES/earthhiresclouds4K.jpg');

let earthMaterialClouds = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    map: earthCloudsTexture,
    transparent:true,
    opacity: 0.4
});

let earthClouds = new THREE.Mesh(earthCloudGeo, earthMaterialClouds);

earthClouds.scale.set( 1.015, 1.015, 1.015);

earth.add( earthClouds ) 


//agfalirghladrfgjkakd;gka


let earthPolitGeo = new THREE.SphereGeometry(9.88, 32, 32);

let earthPolitTexture = new THREE.TextureLoader().load('../IMAGES/unnamed.jpg');

let earthMaterialPolit = new THREE.MeshPhongMaterial({
    map: earthPolitTexture,
    transparent:true,
    opacity: 0.5
});

let earthPolit = new THREE.Mesh(earthPolitGeo, earthMaterialPolit);

earthPolit.scale.set( 1.015, 1.015, 1.015);

earth.add( earthPolit ) 

//flsdjkhhjrtkghklstjkhstjh

let lights = [];

function createSkyBox(scene) {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        '../IMAGES/right.png',
        '../IMAGES/left.png',
        '../IMAGES/top.png',
        '../IMAGES/bottom.png',
        '../IMAGES/front.png',
        '../IMAGES/back.png'
    ])
    scene.background = texture;
};

function createLights(scene){
    lights[0] = new THREE.PointLight("#004d99", .5, 0);
    lights[1] = new THREE.PointLight("#004d99", .5, 0);
    lights[2] = new THREE.PointLight("#004d99", .7, 0);
    lights[3] = new THREE.AmbientLight("#ffffff");

    lights[0].position.set(200, 0, -400);
    lights[1].position.set(200, 200, 400);
    lights[2].position.set(-200, -200, -50);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);
    scene.add(lights[3]);
}

function addSceneObjects(scene) {
    createLights(scene);
    createSkyBox(scene);
}

// AddSceneObjects adds the items to the scene
addSceneObjects(scene);

// Change position so we can see the objects
camera.position.z = 20;

// Disable control function, so users do not zoom too far in or pan away from center
controls.minDistance = 11;
controls.maxDistance = 40;
controls.enablePan = false;
controls.update();
controls.saveState();

// Add event listeners so DOM knows what functions to use when objects/items are interacted with
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('click', onWindowClick, false);
//window.addEventListener('touchstart', onTouch, false);

// Resizes the window when it changes
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

// Listens for the mouse to intersect object and when clicked returns the data to the inner html
function onWindowClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(earthClouds.children);

    for (let i = 0; i < intersects.length; i++){
        document.querySelector("#region").innerText = "Регион: " + intersects[0].object.userData.region;
        document.getElementById("region").style.color = 'black'
        document.querySelector("#country-info").innerText = "" + intersects[0].object.userData.country;
        document.querySelector("#language").innerText = "Язык: " + intersects[0].object.userData.language;
        document.querySelector("#population").innerText = "Население: " + intersects[0].object.userData.population;
        document.querySelector("#area-sq-mi").innerText = "Площадь(кв миль): " + intersects[0].object.userData.area_sq_mi;
    }
    const item = intersects[0];
    let point = item.point;
    let camDistance = camera.position.copy(point).normalize.multiplyScalar(camDistance);
};

// Allows for the scene to move and be interacted with
function animate() {
    requestAnimationFrame( animate );
    render();
	controls.update();
};

// Updates camera renderer
function render() {
    renderer.render( scene, camera );
};

// Removes the points of interest freeing up memory and space to have better performance
function removeChildren(){
    let destroy = earthClouds.children.length;
    while(destroy--) {
        earthClouds.remove(earthClouds.children[destroy].material.dispose())
        earthClouds.remove(earthClouds.children[destroy].geometry.dispose())
        earthClouds.remove(earthClouds.children[destroy])
    }
};

// Create and add coordinates for the globe
function addCountryCoord(earth, country, language, latitude, longitude, color, region, population, area_sq_mi){
    let pointOfInterest = new THREE.ConeGeometry( .13, .5, 5 );;
    let lat = latitude * (Math.PI/180);
    let lon = -longitude * (Math.PI/180);
    const radius = 10;
    const phi = (90-lat)*(Math.PI/180);
    const theta = (lon+180)*(Math.PI/180);

    let material = new THREE.MeshBasicMaterial({
        color:color
    });

    let mesh = new THREE.Mesh(
        pointOfInterest,
        material
    );

    mesh.position.set(
        Math.cos(lat) * Math.cos(lon) * radius,
        Math.sin(lat) * radius,
        Math.cos(lat) * Math.sin(lon) * radius
    );

    mesh.rotation.set(0, -lon, lat+Math.PI/2);

    mesh.userData.country = country;
    mesh.userData.language = language;
    mesh.userData.color = color;
    mesh.userData.region = region;
    mesh.userData.population = population;
    mesh.userData.area_sq_mi = area_sq_mi;
    
    earthClouds.add(mesh)

};

// Variables to get information and change accordingly
let countryInfo = document.getElementById("country");
countryInfo.addEventListener("click", changeToCountry);

// Changes the information so data points can be seen
function changeToCountry() {
    // Show/hide needed and unneeded elements
    document.getElementById("info-box").style.display = "flex";
    document.querySelector(".weather-box").style.display = "flex";

    removeChildren();

    let currentCityId = []
    let getCities = new XMLHttpRequest();
    getCities.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            for (let i = 0; i < data.length; i++) {
                if (data[i][country] == document.querySelector("#country-info").innerText) {
                    currentCityId.push(data[i][id]);
                }
            }
        }
    };
    getCities.open("GET", "../DATA/city.list.json", true);
    getCities.send();


console.log(currentCityId)

    // Get the data from the JSON file
    for (let i = 0; i < data.length; i++){
            addCountryCoord(earth, data[i].Country, data[i].Languages, data[i].latitude, data[i].longitude, 'white', data[i].Region, data[i].Population, data[i].Area_sq_mi);
    }
};

// Call the animation function so scene is properly rendered
animate();


// my shit


