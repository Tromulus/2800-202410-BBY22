import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
let root;
const loader = new GLTFLoader();
loader.load('/img/Robot.glb', function(glb){
    console.log(glb);
    root = glb.scene;
    const scale = 0.25;
    root.scale.set(scale,scale,scale);

    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    root.position.sub(center); // Center the model

    scene.add(root);
    camera.lookAt(root.position);
    animate();
}, function(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + "% loaded");
}, function(error) {
    console.log('error');
})

const light=new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2,6,6);
scene.add(light);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100);
camera.position.set(0,1,3);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled= true;
renderer.gammaOutput=true;

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable smooth animation

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

let moveUp = true;
const speed = 0.003; // Adjust the speed as needed
const maxPosition = 2; // Maximum y position
const minPosition = -2; // Minimum y position

function animate() {
    requestAnimationFrame(animate);
    if (root) {
        root.rotation.y += 0.005;
    }
    // Update controls
    controls.update();
    renderer.render(scene, camera);
}
animate();