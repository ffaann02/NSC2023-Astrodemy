import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

const MoonCycle = (event) => {

    const canvasSpaceViewRef = useRef();
    const cameraSpaceViewRef = useRef();
    const moonOrbitAngleRef = useRef();
    const moonRef = useRef();

    const canvasEarthViewRef = useRef();
    const cameraEarthViewRef = useRef();
    const pointLightRef = useRef();

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
    varying vec3 vertexNormal;
    void main() {
        float intensity = pow(0.3 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }
    `;

    useEffect(() => {
        const canvas = canvasSpaceViewRef.current;
        const textureLoader = new THREE.TextureLoader();

        // Create the scene
        const scene = new THREE.Scene();

        // Camera and Renderer
        const spaceViewCanvas = document.querySelector("#spaceView");
        const camera = new THREE.PerspectiveCamera(75, spaceViewCanvas.offsetWidth / spaceViewCanvas.offsetHeight, 0.1, 1000);
        cameraSpaceViewRef.current = camera;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(spaceViewCanvas.offsetWidth, spaceViewCanvas.offsetHeight);
        cameraSpaceViewRef.current.position.set(0, 60, 0);

        // Light
        const ambientLight = new THREE.AmbientLight(0x333333, 0.4);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(-60, 1, 0);
        scene.add(directionalLight);

        // Background
        scene.background = textureLoader.load('/assets/3d_page/texture/blackbg.jpg')

        // Galaxy
        const galaxyGeometry = new THREE.SphereGeometry(400, 32, 32);
        const galaxyMaterial = new THREE.MeshBasicMaterial({
            side: THREE.BackSide,
            map: textureLoader.load('/assets/3d_page/texture/background.jpg')
        });
        const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
        scene.add(galaxy);

        // Orbit controls
        const controls = new OrbitControls(cameraSpaceViewRef.current, renderer.domElement);

        // Earth mesh
        const earth = new THREE.Mesh(
            new THREE.SphereGeometry(6, 32, 32),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load('/assets/3d_page/planetTexture/earth.jpg'),
            })
        );
        scene.add(earth);

        // Earth Shader
        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(6, 32, 32),
            new THREE.ShaderMaterial({
                vertexShader: atmosphereVertex,
                fragmentShader: atmosphereFragment,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
            })
        );
        atmosphere.scale.set(1.1, 1.1, 1.1)
        scene.add(atmosphere);

        // Create moon
        const moon = new THREE.Mesh(
            new THREE.SphereGeometry(4, 32, 32),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load('/assets/3d_page/texture/moon.jpg')
            })
        );
        scene.add(moon);
        moonRef.current = moon;

        // Create orbit-line
        const ellipseY = 30;
        const ellipseX = ellipseY * 1.5;
        let orbitAngle = 0;
        moonOrbitAngleRef.current = orbitAngle;
        let orbitPoint = [];
        const orbitMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 10,
            transparent: true,
            opacity: 0.2
        });
        for (let i = 0; i <= 100; i++) {
            const Angle = (i / 100) * Math.PI * 2;
            const X = ellipseX * Math.cos(Angle);
            const Y = 0;
            const Z = ellipseY * Math.sin(Angle);
            orbitPoint.push(new THREE.Vector3(X, Y, Z));
        }
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoint);
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbitLine);

        moonRef.current.ellipseY = ellipseY;
        moonRef.current.ellipseX = ellipseX;
        moon.position.set(ellipseX * Math.cos(moonOrbitAngleRef.current), 0, ellipseY * Math.sin(moonOrbitAngleRef.current));

        const animate = function () {
            requestAnimationFrame(animate);
            earth.rotation.y += 0.004;
            renderer.render(scene, cameraSpaceViewRef.current);
        }
        animate();

    }, []);

    // Create View from earth
    useEffect(() => {
        const canvas = canvasEarthViewRef.current;
        const textureLoader = new THREE.TextureLoader();

        // Create the scene
        const scene = new THREE.Scene();

        // Camera and Renderer
        const earthViewCanvas = document.querySelector("#earthView");
        const camera = new THREE.PerspectiveCamera(75, earthViewCanvas.offsetWidth / earthViewCanvas.offsetHeight, 0.1, 1000);
        cameraEarthViewRef.current = camera;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(earthViewCanvas.offsetWidth, earthViewCanvas.offsetHeight);
        cameraEarthViewRef.current.position.set(0, 0, 15);

        // Light
        const ambientLight = new THREE.AmbientLight(0x333333, 0.2);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 3, 300)
        scene.add(pointLight);
        pointLight.position.set(0, 0, 100);
        pointLightRef.current = pointLight;

        // Background
        scene.background = textureLoader.load('/assets/3d_page/texture/blackbg.jpg')

        // Create moon
        const moon = new THREE.Mesh(
            new THREE.SphereGeometry(4, 32, 32),
            new THREE.MeshStandardMaterial({
                map: textureLoader.load('/assets/3d_page/texture/moon.jpg')
            })
        );
        scene.add(moon);

        const animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, cameraEarthViewRef.current);
        }
        animate()

    }, []);

    const rangeValues = [0, -0.7, -1.58, -2.4, -3.2, -3.9, -4.72, -5.6, 0];
    const lightPosValues = [
        [0, 0, 100], // Full moon
        [-50, 0, 24], // Waning Gibbous
        [-50, 0, 4], // Third Quarter
        [-50, 0, -15], // Waning Crescent
        [0, 0, 0], // New moon
        [50, 0, -15],  // Waxing Crescent
        [50, 0, 4], // First Quarter
        [50, 0, 24], // Waxing Gibbous
    ];
    const getLightPosition = (value) => {
        const index = rangeValues.indexOf(value);
        const [x, y, z] = lightPosValues[index];
        return { x, y, z };
      };
    const moveTime = 1;
    const handleRangeChange = (event) => {
        const step = event.target.value;
        moonOrbitAngleRef.current = rangeValues[step];
        gsap.to(moonRef.current.position, {
            duration: moveTime,
            x: moonRef.current.ellipseX * Math.cos(moonOrbitAngleRef.current),
            y: 0,
            z: moonRef.current.ellipseY * Math.sin(moonOrbitAngleRef.current),
            onUpdate: () => {
                gsap.to(pointLightRef.current.position, {
                    duration: moveTime,
                    x: getLightPosition(moonOrbitAngleRef.current).x,
                    y: getLightPosition(moonOrbitAngleRef.current).y,
                    z: getLightPosition(moonOrbitAngleRef.current).z,
                })
            }
        })
    };

    return (
        <div className="flex h-screen relative">
            <div className="w-2/3 relative flex justify-center overflow-hidden">
                <canvas id="spaceView" alt="spaceView" ref={canvasSpaceViewRef} />
            </div>
            <div className="w-1/3 relative flex justify-center overflow-hidden">
                <p className="text-4xl font-ibm-thai font-bold text-white absolute top-auto mx-auto">มุมมองจากโลก</p>
                <canvas id="earthView" alt="earthView" ref={canvasEarthViewRef} />
                <input type="range" className="absolute right-0" min={0} max={rangeValues.length - 1} step={1}
                    defaultValue={0} onChange={handleRangeChange} />
            </div>
        </div>
    )
}

export default MoonCycle;