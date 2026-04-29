import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GUI } from "lil-gui";

const container = document.getElementById("game-container");

if (!container) {
  throw new Error('No existe el div con id="game-container"');
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0xdff4ff, 180, 420);

const camera = new THREE.PerspectiveCamera(
  48,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.set(0, 10, 28);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

// LUCES
const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x7fd36c, 1.6);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(40, 50, 25);
scene.add(sunLight);

const fillLight = new THREE.DirectionalLight(0xbfdcff, 1.0);
fillLight.position.set(-15, 15, -10);
scene.add(fillLight);

// SUELO
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(400, 400),
  new THREE.MeshStandardMaterial({
    color: 0x69c86b,
    roughness: 1
  })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

// CAMINO
const path = new THREE.Mesh(
  new THREE.BoxGeometry(18, 0.12, 120),
  new THREE.MeshStandardMaterial({
    color: 0xe3dccb,
    roughness: 1
  })
);
path.position.set(0, 0.06, 5);
scene.add(path);

// ÁRBOLES
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

// CUBO DE PRUEBA
const testCube = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
testCube.position.set(0, 1, 0);
scene.add(testCube);

// MODELO
const loader = new GLTFLoader();
let fondoModel = null;
let modelCenter = new THREE.Vector3();
let modelSize = new THREE.Vector3();
let cameraDistance = 24;

async function loadModel() {
  try {
    const gltf = await loader.loadAsync("../src/models/glb/fondo.glb");
    fondoModel = gltf.scene;
    scene.add(fondoModel);

    fondoModel.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.needsUpdate = true;
      }
    });

    const box = new THREE.Box3().setFromObject(fondoModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    fondoModel.position.x -= center.x;
    fondoModel.position.y -= box.min.y;
    fondoModel.position.z -= center.z;

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 11;
    const scaleFactor = targetSize / maxDim;
    fondoModel.scale.setScalar(scaleFactor);

    const finalBox = new THREE.Box3().setFromObject(fondoModel);
    modelCenter = finalBox.getCenter(new THREE.Vector3());
    modelSize = finalBox.getSize(new THREE.Vector3());

    fondoModel.position.x -= modelCenter.x;
    fondoModel.position.z -= modelCenter.z;
    fondoModel.position.y -= finalBox.min.y;
    fondoModel.position.z = -2;

    const finalBox2 = new THREE.Box3().setFromObject(fondoModel);
    modelCenter = finalBox2.getCenter(new THREE.Vector3());
    modelSize = finalBox2.getSize(new THREE.Vector3());

    const fitHeightDistance =
      modelSize.y / (2 * Math.tan((Math.PI * camera.fov) / 360));
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    cameraDistance = Math.max(fitHeightDistance, fitWidthDistance) * 2.5;

    camera.position.set(
      modelCenter.x,
      modelCenter.y + modelSize.y * 0.8,
      modelCenter.z + cameraDistance
    );

    camera.lookAt(
      modelCenter.x,
      modelCenter.y + modelSize.y * 0.35,
      modelCenter.z
    );

    testCube.visible = false;
  } catch (error) {
    console.error("Error cargando fondo.glb:", error);
    alert("No se pudo cargar ../src/models/glb/fondo.glb");
  }
}

loadModel();

// GUI
const gui = new GUI();

const lightFolder = gui.addFolder("Light");
lightFolder.add(ambientLight, "intensity", 0, 5, 0.1).name("Ambient");
lightFolder.add(hemiLight, "intensity", 0, 5, 0.1).name("Hemisphere");
lightFolder.add(sunLight, "intensity", 0, 5, 0.1).name("Sun");
lightFolder.add(fillLight, "intensity", 0, 5, 0.1).name("Fill");
lightFolder.open();

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x", -50, 50, 0.1).name("Position X");
cameraFolder.add(camera.position, "y", -50, 50, 0.1).name("Position Y");
cameraFolder.add(camera.position, "z", -50, 50, 0.1).name("Position Z");
cameraFolder.open();

const fogFolder = gui.addFolder("Fog");
fogFolder.add(scene.fog, "near", 0, 300, 1).name("Near");
fogFolder.add(scene.fog, "far", 50, 600, 1).name("Far");
fogFolder.open();

// ANIMACIÓN
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  testCube.rotation.x += 0.01;
  testCube.rotation.y += 0.01;

  if (fondoModel) {
    fondoModel.rotation.y += 0.003;

    camera.position.x = modelCenter.x + Math.sin(time * 0.35) * 1.4;
    camera.position.z = modelCenter.z + cameraDistance + Math.cos(time * 0.25) * 0.4;
    camera.position.y = modelCenter.y + modelSize.y * 0.8 + Math.sin(time * 0.2) * 0.12;

    camera.lookAt(
      modelCenter.x,
      modelCenter.y + modelSize.y * 0.35,
      modelCenter.z
    );
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});