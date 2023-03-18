import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const LifeCycle = (event) => {

    const canvasRef = useRef();
    const cameraRef = useRef();

    const atmosphereVertex =
        `
    varying vec3 vertexNormal;
    void main() {
        vertexNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

    const atmosphereFragment =
        `
    uniform float intensityFactor;
    uniform float color_R;
    uniform float color_G;
    uniform float color_B;
    varying vec3 vertexNormal;
    void main() {
        float intensity = pow(intensityFactor - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
        gl_FragColor = vec4(color_R, color_G, color_B, 1.0) * intensity;
    }
    `;

    useEffect(() => {

        const canvas = canvasRef.current;
        const textureLoader = new THREE.TextureLoader();

        // Create the scene
        const scene = new THREE.Scene();

        // Camera and Renderer
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        cameraRef.current = camera;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setX(-250);
        camera.position.setZ(40);

        // Light
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 2, 1200)
        scene.add(pointLight);

        // Background
        scene.background = textureLoader.load('/assets/3d_page/texture/blackbg.jpg');

        // Galaxy
        const galaxyGeometry = new THREE.SphereGeometry(400, 32, 32);
        const galaxyMaterial = new THREE.MeshBasicMaterial({
            side: THREE.BackSide,
            map: textureLoader.load('/assets/3d_page/texture/background.jpg')
        });
        const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
        scene.add(galaxy);

        // Create sun function
        const createSun = function(radius, texture, posX, posY, posZ, shaderScale, shaderIntensity, color_R, color_G, color_B) {
            const mesh = new THREE.Mesh(
                new THREE.SphereGeometry(radius, 32, 32),
                new THREE.MeshBasicMaterial({
                    map: textureLoader.load(texture),
                })
            );
            mesh.position.set(posX, posY, posZ);

            const shader = new THREE.Mesh(
                new THREE.SphereGeometry(radius, 32, 32),
                new THREE.ShaderMaterial({
                    vertexShader: atmosphereVertex,
                    fragmentShader: atmosphereFragment,
                    uniforms: {
                        intensityFactor: { value: shaderIntensity },
                        color_R : { value: color_R },
                        color_G : { value: color_G },
                        color_B : { value: color_B }
                    },
                    blending: THREE.AdditiveBlending,
                    side: THREE.BackSide,
                    visible: true
                })
            );
            shader.scale.set(shaderScale, shaderScale, shaderScale);
            mesh.add(shader);
            scene.add(mesh);
        }

        const averageStar = createSun(12, '/assets/3d_page/texture/sun.jpg', -150, 0, 0, 1.2, 0.6, 1.0, 0.25, 0);
        const redGiant = createSun(24, '/assets/3d_page/texture/red_giant.jpg', -50, 0, -20, 1.2, 0.6, 1.0, 0, 0);
        const redSuperGiant = createSun(30, '/assets/3d_page/texture/red_super_giant.jpg', 50, 0, -20, 1.2, 0.6, 1.0, 0.1, 0);
        const whiteDwarf = createSun(8, '/assets/3d_page/texture/moon.jpg', 250, 0, 0, 1.2, 0.6, 0.3, 0.6, 1);

        const gltfLoader = new GLTFLoader();
        // planetaryNebula
        gltfLoader.load('/assets/3d_page/model/planetary_nebula/scene.gltf', (planetaryNebula) => {
            planetaryNebula.scene.scale.set(0.02, 0.02, 0.02);
            planetaryNebula.scene.position.set(150, 0, 0);
            scene.add(planetaryNebula.scene);

        });

        const animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, cameraRef.current);
        }
        animate();

    }, []);


    const rangeValues = [1, 2, 3, 4, 5, 6];
    const cameraPosValue = [
        [-250,0,40],
        [-150,0,40],
        [-50,0,40],
        [50,0,40],
        [150, 0, 40],
        [250, 0, 40]
    ]
    const getCameraPosition = (value) => {
        const index = rangeValues.indexOf(value);
        const [x, y, z] = cameraPosValue[index];
        return { x, y, z };
    };
    const moveTime = 2;
    const handleRangeChange = (event) => {
        const step = event.target.value;
        gsap.to(cameraRef.current.position, {
            duration: moveTime,
            ease: "power3.inOut",
            x: getCameraPosition(rangeValues[step]).x,
            y: getCameraPosition(rangeValues[step]).y,
            z: getCameraPosition(rangeValues[step]).z,
        })
    }


    return (
        <div className="relative flex overflow-hidden w-full">
            <canvas id="space" alt="space" ref={canvasRef} />
            <input type="range" className="absolute right-0" min={0} max={rangeValues.length - 1} step={1}
                defaultValue={0} onChange={handleRangeChange}/>
        </div>
    )
}

export default LifeCycle;