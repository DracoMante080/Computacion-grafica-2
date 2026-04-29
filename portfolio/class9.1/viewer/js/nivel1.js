import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GUI } from "lil-gui";

const container = document.getElementById("game-container");

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xbfefff, 40, 180);
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 8, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

// LUCES
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
sunLight.position.set(15, 25, 10);
scene.add(sunLight);

const fillLight = new THREE.DirectionalLight(0xbfdcff, 0.8);
fillLight.position.set(-12, 10, -8);
scene.add(fillLight);

// SUELO
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(220, 220),
    new THREE.MeshStandardMaterial({
        color: 0x55b85a,
        roughness: 0.95,
        metalness: 0.02
    })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

// CAMINO
const path = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.2, 60),
    new THREE.MeshStandardMaterial({
        color: 0xd1b075,
        roughness: 1
    })
);
path.position.set(0, 0.1, 8);
scene.add(path);

// ARBOLITOS
function createTree(x, z) {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.45, 2.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x7a4c24 })
    );
    trunk.position.y = 1.1;
    tree.add(trunk);

    const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(1.4, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x2f8f43 })
    );
    leaves.position.y = 3;
    tree.add(leaves);

    tree.position.set(x, 0, z);
    scene.add(tree);
}

for (let i = -4; i <= 4; i++) {
    if (i !== 0) {
        createTree(-18, i * 8);
        createTree(18, i * 8);
    }
}

// MODELO GLB
const loader = new GLTFLoader();
let pokemonModel = null;
let modelCenter = new THREE.Vector3();
let modelSize = new THREE.Vector3();
let cameraDistance = 20;

async function loadModel() {
    try {
        const gltf = await loader.loadAsync("../src/models/glb/pokemon.glb");
        pokemonModel = gltf.scene;
        scene.add(pokemonModel);

        pokemonModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
                if (child.material) {
                    child.material.needsUpdate = true;
                }
            }
        });

        const box = new THREE.Box3().setFromObject(pokemonModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        pokemonModel.position.x -= center.x;
        pokemonModel.position.y -= box.min.y;
        pokemonModel.position.z -= center.z;

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 12;
        const scaleFactor = targetSize / maxDim;
        pokemonModel.scale.setScalar(scaleFactor);

        const box2 = new THREE.Box3().setFromObject(pokemonModel);
        const center2 = box2.getCenter(new THREE.Vector3());

        pokemonModel.position.x -= center2.x;
        pokemonModel.position.z -= center2.z;

        pokemonModel.position.z = -4;
        pokemonModel.position.y = 0;

        const finalBox = new THREE.Box3().setFromObject(pokemonModel);
        modelCenter = finalBox.getCenter(new THREE.Vector3());
        modelSize = finalBox.getSize(new THREE.Vector3());

        const fitHeightDistance =
            modelSize.y / (2 * Math.tan((Math.PI * camera.fov) / 360));
        const fitWidthDistance = fitHeightDistance / camera.aspect;
        cameraDistance = Math.max(fitHeightDistance, fitWidthDistance) * 1.8;

        camera.position.set(
            modelCenter.x,
            modelCenter.y + modelSize.y * 0.6,
            modelCenter.z + cameraDistance
        );

        camera.lookAt(
            modelCenter.x,
            modelCenter.y + modelSize.y * 0.3,
            modelCenter.z
        );

    } catch (error) {
        console.error("Error cargando el modelo GLB:", error);
        alert("No se pudo cargar el modelo 3D. Revisa la ruta del archivo.");
    }
}

loadModel();

// GUI
const gui = new GUI({ title: "Control Panel" });

const lightFolder = gui.addFolder("Lights");
lightFolder.add(ambientLight, "intensity", 0, 5, 0.1).name("Ambient");
lightFolder.add(sunLight, "intensity", 0, 5, 0.1).name("Sun");
lightFolder.add(fillLight, "intensity", 0, 5, 0.1).name("Fill");
lightFolder.open();

const sceneFolder = gui.addFolder("Scene");
sceneFolder.add(scene.fog, "near", 0, 200, 1).name("Fog Near");
sceneFolder.add(scene.fog, "far", 50, 500, 1).name("Fog Far");
sceneFolder.open();

// ANIMACION
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    if (pokemonModel) {
        pokemonModel.rotation.y += 0.003;

        camera.position.x = modelCenter.x + Math.sin(time * 0.35) * 1.8;
        camera.position.y = modelCenter.y + modelSize.y * 0.6 + Math.sin(time * 0.2) * 0.15;
        camera.position.z = modelCenter.z + cameraDistance + Math.cos(time * 0.25) * 0.5;

        camera.lookAt(
            modelCenter.x,
            modelCenter.y + modelSize.y * 0.3,
            modelCenter.z
        );
    }

    renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});