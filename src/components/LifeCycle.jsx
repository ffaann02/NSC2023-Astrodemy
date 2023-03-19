import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
        camera.position.setX(-2000);
        camera.position.setZ(40);

        // Light
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 2, 1200)
        scene.add(pointLight);

        // Background
        scene.background = textureLoader.load('/assets/3d_page/texture/blackbg.jpg');

        // Galaxy
        const galaxyGeometry = new THREE.SphereGeometry(950, 32, 32);
        const galaxyMaterial = new THREE.MeshBasicMaterial({
            side: THREE.BackSide,
            map: textureLoader.load('/assets/3d_page/texture/background.jpg')
        });
        const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
        scene.add(galaxy);

        // Galaxy
        const oldGalaxyGeometry = new THREE.SphereGeometry(950, 32, 32);
        const oldGalaxyMaterial = new THREE.MeshBasicMaterial({
            side: THREE.BackSide,
            map: textureLoader.load('/assets/3d_page/texture/background.jpg')
        });
        const oldGalaxy = new THREE.Mesh(oldGalaxyGeometry, oldGalaxyMaterial);
        oldGalaxy.position.set(-2000, 0, 0)
        scene.add(oldGalaxy);

        // Create sun function
        const createSun = function (radius, texture, posX, posY, posZ, shaderScale, shaderIntensity, color_R, color_G, color_B) {
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
                        color_R: { value: color_R },
                        color_G: { value: color_G },
                        color_B: { value: color_B }
                    },
                    blending: THREE.AdditiveBlending,
                    side: THREE.BackSide,
                    visible: true
                })
            );
            shader.scale.set(shaderScale, shaderScale, shaderScale);
            mesh.add(shader);
            scene.add(mesh);

            return mesh;
        }

        const averageStar = createSun(12, '/assets/3d_page/texture/sun.jpg', -350, 0, 0, 1.2, 0.6, 1.0, 0.25, 0);
        const redGiant = createSun(24, '/assets/3d_page/texture/red_giant.jpg', -100, 0, -20, 1.2, 0.6, 1.0, 0, 0);
        const redSuperGiant = createSun(30, '/assets/3d_page/texture/red_super_giant.jpg', 150, 0, -20, 1.2, 0.6, 1.0, 0.1, 0);
        const whiteDwarf = createSun(8, '/assets/3d_page/texture/uranus.jpg', 650, 0, 0, 1.2, 0.6, 0.3, 0.6, 1);

        //Stellar Nebula
        let cloundParticles = [];
        for (let p = 0; p < 50; p++) {
            let cloud = new THREE.Mesh(
                new THREE.PlaneGeometry(50, 32, 32),
                new THREE.MeshLambertMaterial({
                    map: textureLoader.load('/assets/3d_page/texture/smoke.png'),
                    transparent: true,
                }));
            cloud.position.set(
                -2000,
                0,
                Math.random() * 500 - 500
            );
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.scale.set(1.8, 1.8, 1.8);
            cloud.material.opacity = 0.4;
            cloundParticles.push(cloud);
            scene.add(cloud);
        }

        // Light color for  Stellar Nebula
        const directionalLight = new THREE.DirectionalLight(0xff8c19, 1, 1000);
        directionalLight.position.set(-2000, 0, 40);
        scene.add(directionalLight);
        const redLight = new THREE.PointLight(0xd8547e, 2, 1000);
        redLight.position.set(-2000, 0, 40);
        scene.add(redLight);
        const orangeLight = new THREE.PointLight(0xcc6600, 2, 1000);
        orangeLight.position.set(-2000, 0, 0);
        scene.add(orangeLight);
        const blueLight = new THREE.PointLight(0x3677ac, 2, 100, 1000);
        blueLight.position.set(-2000, 0, 60);
        scene.add(blueLight);

        //Planetary Nebula
        const planetaryNebula = createSun(1.5, '/assets/3d_page/texture/white.jpg', 400, 0, 0, 1.2, 0.6, 0.3, 0.6, 1);

        // White
        for (let p = 0; p < 10; p++) {
            let cloud = new THREE.Mesh(
                new THREE.CircleGeometry(3.5, 32, 32),
                new THREE.MeshLambertMaterial({
                    map: textureLoader.load('/assets/3d_page/texture/smoke.png'),
                    transparent: true,
                    color: 0xffffff
                }));
            cloud.position.set(
                400,
                0,
                Math.random() * (1 - 10) + (-10)
            );
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.material.opacity = 0.4;
            scene.add(cloud);
        }

        // Blue
        for (let p = 0; p < 10; p++) {
            let cloud = new THREE.Mesh(
                new THREE.CircleGeometry(23, 32, 32),
                new THREE.MeshLambertMaterial({
                    map: textureLoader.load('/assets/3d_page/texture/smoke.png'),
                    transparent: true,
                    color: 0x3677ac
                }));
            cloud.position.set(
                400,
                0,
                Math.random() * (10 - 20) + (-20)
            );
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.material.opacity = 0.4;
            scene.add(cloud);
        }

        // Orange
        for (let p = 0; p < 10; p++) {
            let cloud = new THREE.Mesh(
                new THREE.CircleGeometry(30, 32, 32),
                new THREE.MeshLambertMaterial({
                    map: textureLoader.load('/assets/3d_page/texture/smoke.png'),
                    transparent: true,
                    color: 0xcc6600
                }));
            cloud.position.set(
                400,
                0,
                Math.random() * (20 - 30) + (-30)
            );
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.material.opacity = 0.4;
            scene.add(cloud);
        }

        // Red
        for (let p = 0; p < 10; p++) {
            let cloud = new THREE.Mesh(
                new THREE.CircleGeometry(33, 32, 32),
                new THREE.MeshLambertMaterial({
                    map: textureLoader.load('/assets/3d_page/texture/smoke.png'),
                    transparent: true,
                    color: 0xff0000
                }));
            cloud.position.set(
                400,
                0,
                Math.random() * (30 - 40) + (-40)
            );
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.material.opacity = 0.4;
            scene.add(cloud);
        }

        const whiteLight = new THREE.PointLight(0xffffff, 1);
        whiteLight.position.set(400, 0, 40);
        scene.add(whiteLight);

        const animate = function () {
            requestAnimationFrame(animate);

            gsap.to(averageStar.rotation, {
                x: -mouse.y * 0.3,
                y: mouse.x * 0.5,
                duration: 2
            })

            gsap.to(redGiant.rotation, {
                x: -mouse.y * 0.3,
                y: mouse.x * 0.5,
                duration: 2
            })

            gsap.to(redSuperGiant.rotation, {
                x: -mouse.y * 0.3,
                y: mouse.x * 0.5,
                duration: 2
            })

            gsap.to(whiteDwarf.rotation, {
                x: -mouse.y * 0.3,
                y: mouse.x * 0.5,
                duration: 2
            })

            cloundParticles.forEach(p => {
                p.rotation.z -= 0.003;
            })

            renderer.render(scene, cameraRef.current);
        }
        animate();

    }, []);


    const rangeValues = [1, 2, 3, 4, 5, 6];
    const cameraPosValue = [
        [-2000, 0, 40],
        [-350, 0, 40],
        [-100, 0, 40],
        [150, 0, 40],
        [400, 0, 40],
        [650, 0, 40]
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

    const mouse = {
        x: undefined,
        y: undefined
    }

    window.addEventListener('mousemove', (event) => {
        const clientWidth = event.clientX;
        const clientHeight = event.clientY;
        mouse.x = (clientWidth / window.innerWidth) * 2 - 1;
        mouse.y = -(clientHeight / window.innerHeight) * 2 + 1;
    });


    return (
        <div className="relative flex overflow-hidden w-full">
            <canvas id="space" alt="space" ref={canvasRef} />
            <input type="range" className="absolute right-0" min={0} max={rangeValues.length - 1} step={1}
                defaultValue={0} onChange={handleRangeChange} />
        </div>
    )
}

export default LifeCycle;