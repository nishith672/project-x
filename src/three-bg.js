import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// --- uniqueID: init-scene ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.domElement.id = 'bg-canvas';
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '-1';
document.body.prepend(renderer.domElement);

// --- uniqueID: post-processing ---
const renderScene = new RenderPass(scene, camera);

// Resolution, Strength, Radius, Threshold
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, 0.4, 0.85
);
bloomPass.strength = 1.0; // premium glow intensity
bloomPass.radius = 0.5;
bloomPass.threshold = 0.1; // only bright things glow

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// --- uniqueID: lighting ---
// Studio lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Dimmer ambient for better contrast
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

const backLight = new THREE.DirectionalLight(0x2dd4bf, 2.0); // Teal rim light
backLight.position.set(-5, 5, -5);
scene.add(backLight);

// --- uniqueID: create-fan ---
let fanGroup;
let bladesGroup;

function createFan() {
    fanGroup = new THREE.Group();
    bladesGroup = new THREE.Group();

    // Materials - Dark Industrial/CPU Fan look
    // Increased metalness/brightness slightly to catch reflections
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.5,
        metalness: 0.6
    });

    const bladeMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.3,
        metalness: 0.8
    });

    const stickerMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee, // Bright silver
        roughness: 0.2,
        metalness: 1.0,
        emissive: 0xaaaaaa, // Faint glow
        emissiveIntensity: 0.1
    });

    // 1. Frame (Square with circular hole)
    const frameSize = 7;
    const holeRadius = 3.2;
    const frameThickness = 1.5;

    const shape = new THREE.Shape();
    shape.moveTo(-frameSize / 2, -frameSize / 2);
    shape.lineTo(frameSize / 2, -frameSize / 2);
    shape.lineTo(frameSize / 2, frameSize / 2);
    shape.lineTo(-frameSize / 2, frameSize / 2);
    shape.lineTo(-frameSize / 2, -frameSize / 2);

    const holePath = new THREE.Path();
    holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    const extrudeSettings = {
        steps: 1,
        depth: frameThickness,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 2
    };

    const frameGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    frameGeometry.center();
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    fanGroup.add(frame);

    // 2. Hub (Motor)
    const hubRadius = 1.0;
    const hubGeometry = new THREE.CylinderGeometry(hubRadius, hubRadius, 0.5, 32);
    hubGeometry.rotateX(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeometry, frameMaterial);
    hub.position.z = 0;
    bladesGroup.add(hub);

    // Center Sticker
    const stickerGeometry = new THREE.CircleGeometry(hubRadius * 0.8, 32);
    const sticker = new THREE.Mesh(stickerGeometry, stickerMaterial);
    sticker.position.z = 0.26;
    bladesGroup.add(sticker);

    // 3. Blades
    const numBlades = 9;
    const bladeW = 2.8;
    const bladeH = 0.8;
    const bladeD = 0.05;
    const bladeGeometry = new THREE.BoxGeometry(bladeW, bladeH, bladeD);
    bladeGeometry.translate(bladeW / 2 + hubRadius * 0.8, 0, 0);

    for (let i = 0; i < numBlades; i++) {
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.rotation.z = (i / numBlades) * Math.PI * 2;
        blade.rotateOnAxis(new THREE.Vector3(1, 0, 0), 0.4);
        bladesGroup.add(blade);
    }

    bladesGroup.position.z = 0;
    fanGroup.add(bladesGroup);

    // Support struts
    const strutGeo = new THREE.BoxGeometry(holeRadius * 0.9, 0.2, 0.1);
    strutGeo.translate(holeRadius / 2, 0, 0);
    for (let i = 0; i < 4; i++) {
        const strut = new THREE.Mesh(strutGeo, frameMaterial);
        strut.rotation.z = (Math.PI / 2) * i + (Math.PI / 4);
        strut.position.z = -frameThickness / 2 + 0.1;
        fanGroup.add(strut);
    }

    // Position & Orient
    fanGroup.position.set(3.5, 0, -6);
    fanGroup.rotation.set(0.1, -0.4, 0);

    scene.add(fanGroup);
}

// --- uniqueID: create-particles ---
let particleGroup;
function createParticles() {
    particleGroup = new THREE.Group();

    // Updated: "Whole website" spread, small, white
    const count = 300;
    const spread = 20; // Wide area

    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * spread;
        const y = (Math.random() - 0.5) * spread;
        const z = (Math.random() - 0.5) * 10; // Less depth spread to keep visible
        positions.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xffffff, // White
        size: 0.05,      // Small
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    particleGroup.add(particles);

    // Position Center
    particleGroup.position.z = -5;

    scene.add(particleGroup);
}

createFan();
createParticles(); // General particles


// Function to export GLB
window.exportFan = function () {
    const exporter = new GLTFExporter();
    exporter.parse(
        scene, // Export whole scene now? Or just fanGroup
        (gltf) => {
            const output = JSON.stringify(gltf, null, 2);
            const blob = new Blob([output], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'cpu_fan_scene.glb';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
        },
        (error) => {
            console.error('An error happened during parsing', error);
        }
    );
};

// Camera Position
camera.position.z = 5;

// --- uniqueID: animation-loop ---
let scrollY = window.scrollY;
let targetScrollY = scrollY;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
});

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth scroll interpolation
    scrollY += (targetScrollY - scrollY) * 0.1;

    // --- Fan Animation ---
    if (fanGroup && bladesGroup) {
        const baseSpeed = 15.0;
        bladesGroup.rotation.z -= baseSpeed * 0.01;

        fanGroup.position.y = (scrollY * 0.003) - 0.5;
        fanGroup.position.y += Math.sin(elapsedTime * 0.5) * 0.05;

        fanGroup.rotation.y = -0.4 + (mouseX * 0.1);
        fanGroup.rotation.x = 0.1 + (mouseY * 0.1);
    }

    // --- Particle Animation ---
    if (particleGroup) {
        // Milky way / drift rotation
        particleGroup.rotation.y = elapsedTime * 0.05;
        particleGroup.rotation.z = elapsedTime * 0.02;

        // Scroll interaction
        particleGroup.position.y = -(scrollY * 0.005);
    }

    // Make camera follow mouse slightly for parallax
    camera.position.x += (mouseX * 0.2 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    // Render via Composer for Post-Processing (Bloom)
    composer.render();
}

animate();

// --- uniqueID: resize-handler ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight); // Update composer size
});
