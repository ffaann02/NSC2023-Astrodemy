import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { Line2, LineGeometry, LineMaterial } from 'three-fatline';

const Simulator = () => {
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const meshesRef = useRef([]);

    const [hoverNow, setHoverNow] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const textureLoader = new THREE.TextureLoader();

        // Create the scene
        const scene = new THREE.Scene();

        // Renderer
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(30);

        // Light
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 2, 300)
        scene.add(pointLight);

        // Background
        scene.background = textureLoader.load('/assets/3d_page/texture/space.jpg')

        // Orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);

        // Sun orbit (3D Object Parent)
        const sunOrbit = new THREE.Object3D();
        scene.add(sunOrbit);
        const meshes_planet = [];

        // Sun mesh
        const sun = new THREE.Mesh(
            new THREE.SphereGeometry(16, 32, 32),
            new THREE.MeshBasicMaterial({
                map: textureLoader.load('/assets/3d_page/texture/sun.jpg'),
            })
        );
        sunOrbit.add(sun); // add sun to parent object
        sun.name = "sun";
        meshes_planet.push(sun);

        const createPlanet = function (name, radius, ellipseY, rotateSpeed, orbitSpeed, texture, colors, ring) {
            const ellipseX = ellipseY * 1.7;
            // Create mesh
            const mesh = new THREE.Mesh(
                new THREE.SphereGeometry(radius, 32, 32),
                new THREE.MeshStandardMaterial({
                    map: textureLoader.load(texture)
                })
            );
            sunOrbit.add(mesh);

            // Create ring
            if (ring) {
                const ringMesh = new THREE.Mesh(
                    new THREE.RingGeometry(ring.innerRadius,
                        ring.outerRadius,
                        32),
                    new THREE.MeshBasicMaterial({
                        map: textureLoader.load(ring.texture),
                        side: THREE.DoubleSide
                    })
                )
                // ringMesh.position.setX(ellipseY);
                ringMesh.rotation.x = -0.5 * Math.PI
                sunOrbit.add(ringMesh);
                mesh.add(ringMesh);
            }
            meshes_planet.push(mesh);
            mesh.name = name;

            // Create orbit-line
            let orbitAngle = 0;
            let orbitPoint = [];
            const orbitMaterial = new THREE.LineBasicMaterial({
                color: colors,
                linewidth: 10,
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
            sunOrbit.add(orbitLine);

            // Fat line
            // const segments = 64; // Number of line segments used to approximate the circle
            // const points = [];
            // for (let i = 0; i < segments; i++) {
            //     const angle = (i / segments) * Math.PI * 2;
            //     const x = Math.cos(angle) * ellipseX;
            //     const z = Math.sin(angle) * ellipseY;
            //     points.push(x, 0, z);
            // }
            // const geometry = new LineGeometry();
            // geometry.setPositions(points);
            // const material = new LineMaterial({
            //     color: 0xffffff,
            //     linewidth: 2,
            //     resolution: new THREE.Vector2(1280, 960)
            // });
            // const orbitFatLine = new Line2(geometry, material);
            // orbitFatLine.computeLineDistances();
            // sunOrbit.add(orbitFatLine);

            return { name, mesh, rotateSpeed, orbitAngle, orbitSpeed, ellipseX, ellipseY, orbitLine };
        }

        const mercury = createPlanet('mercury', 3.2, 28, 0.004, 0.04, '/assets/3d_page/texture/mercury.jpg', 0xffffff);
        const venus = createPlanet('venus', 5.8, 44, 0.002, 0.015, '/assets/3d_page/texture/venus.jpg', 0xffffff);
        const earth = createPlanet('earth', 6, 62, 0.02, 0.01, '/assets/3d_page/texture/earth.jpg', 0xffffff);
        const mars = createPlanet('mar', 4, 78, 0.018, 0.008, '/assets/3d_page/texture/mars.jpg', 0xffffff);
        const jupiter = createPlanet('jupiter', 12, 100, 0.04, 0.002, '/assets/3d_page/texture/jupiter.jpg', 0xffffff);
        const saturn = createPlanet('saturn', 10, 138, 0.038, 0.0009, '/assets/3d_page/texture/saturn.jpg', 0xffffff, {
            innerRadius: 10,
            outerRadius: 20,
            texture: '/assets/3d_page/texture/saturn ring.png'
        });
        const uranus = createPlanet('uranus', 7, 176, 0.03, 0.0004, '/assets/3d_page/texture/uranus.jpg', 0xffffff, {
            innerRadius: 7,
            outerRadius: 12,
            texture: '/assets/3d_page/texture/uranus ring.png'
        });
        const neptune = createPlanet('neptune', 7, 200, 0.032, 0.0001, '/assets/3d_page/texture/neptune.jpg', 0xffffff);

        const render = function () {

            // Self-rotation
            sun.rotateY(-0.004);
            mercury.mesh.rotateY(mercury.rotateSpeed);
            venus.mesh.rotateY(venus.rotateSpeed);
            earth.mesh.rotateY(earth.rotateSpeed);
            mars.mesh.rotateY(mars.rotateSpeed);
            jupiter.mesh.rotateY(jupiter.rotateSpeed);
            saturn.mesh.rotateY(saturn.rotateSpeed);
            uranus.mesh.rotateY(uranus.rotateSpeed);
            neptune.mesh.rotateY(neptune.rotateSpeed);

            // Around-sun-rotation
            mercury.orbitAngle += mercury.orbitSpeed;
            mercury.mesh.position.set(mercury.ellipseX * Math.cos(mercury.orbitAngle), 0, mercury.ellipseY * Math.sin(mercury.orbitAngle));

            venus.orbitAngle += venus.orbitSpeed;
            venus.mesh.position.set(venus.ellipseX * Math.cos(venus.orbitAngle), 0, venus.ellipseY * Math.sin(venus.orbitAngle));

            earth.orbitAngle += earth.orbitSpeed;
            earth.mesh.position.set(earth.ellipseX * Math.cos(earth.orbitAngle), 0, earth.ellipseY * Math.sin(earth.orbitAngle));

            mars.orbitAngle += mars.orbitSpeed;
            mars.mesh.position.set(mars.ellipseX * Math.cos(mars.orbitAngle), 0, mars.ellipseY * Math.sin(mars.orbitAngle));

            jupiter.orbitAngle += jupiter.orbitSpeed;
            jupiter.mesh.position.set(jupiter.ellipseX * Math.cos(jupiter.orbitAngle), 0, jupiter.ellipseY * Math.sin(jupiter.orbitAngle));

            saturn.orbitAngle += saturn.orbitSpeed;
            saturn.mesh.position.set(saturn.ellipseX * Math.cos(saturn.orbitAngle), 0, saturn.ellipseY * Math.sin(saturn.orbitAngle));

            uranus.orbitAngle += uranus.orbitSpeed;
            uranus.mesh.position.set(uranus.ellipseX * Math.cos(uranus.orbitAngle), 0, uranus.ellipseY * Math.sin(uranus.orbitAngle));

            neptune.orbitAngle += neptune.orbitSpeed;
            neptune.mesh.position.set(neptune.ellipseX * Math.cos(neptune.orbitAngle), 0, neptune.ellipseY * Math.sin(neptune.orbitAngle));

            sceneRef.current = scene;
            cameraRef.current = camera;
            meshesRef.current = meshes_planet;

            renderer.render(scene, camera);
        }

        // Animate function (Loop)
        const animate = function () {
            requestAnimationFrame(animate);
            render();
        };
        animate();

        // Clean up the scene when the component is unmounted
        return () => {
            renderer.dispose();
        };
    }, []);

    function handleMouseMove(event) {
        // Get the mouse position relative to the canvas element
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Calculate the normalized device coordinates (NDC) from the mouse position
        const mouse = new THREE.Vector2();
        mouse.x = (x / canvasRef.current.clientWidth) * 2 - 1;
        mouse.y = -(y / canvasRef.current.clientHeight) * 2 + 1;

        // Create a raycaster object and set its origin and direction based on the mouse position
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, cameraRef.current);

        // Find all the intersections between the raycaster and the meshes
        const intersects = raycaster.intersectObjects(meshesRef.current);

        // Take some action based on the intersections
        if (intersects.length > 0) {
            const meshName = intersects[0].object.name;
            setHoverNow(meshName);
        } else {
            setHoverNow(null);
            return;
        }
    }

    return (
        <div className='relative flex justify-center overflow-hidden'>
            <canvas id="space" alt="space" ref={canvasRef} onMouseMove={handleMouseMove} />
            <p className="text-4xl font-ibm-thai font-bold text-white absolute top-auto mx-auto">{hoverNow}</p>
        </div>
    )
};

export default Simulator;
