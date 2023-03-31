import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Float32BufferAttribute } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const VirtualTour = (event) => {

    const canvasRef = useRef();
    const cameraRef = useRef();
    const spaceShipRef = useRef();
    const destinationRef = useRef();

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
        cameraRef.current.position.setZ(15);

        // Light
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 2, 1200)
        scene.add(pointLight);

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

        // Create star
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff
        });
        const starGeometry2 = new THREE.BufferGeometry();
        const starMaterial2 = new THREE.PointsMaterial({
            color: 0xffffff
        });
        const starVertices = []
        const starVertices2 = []
        for (let i = 0; i < 3000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = -Math.random() * 2000;
            starVertices.push(x, y, z);
        }
        for (let i = 0; i < 3000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = Math.random() * 2000;
            starVertices2.push(x, y, z);
        }
        starGeometry.setAttribute('position', new Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        starGeometry2.setAttribute('position', new Float32BufferAttribute(starVertices2, 3));
        const stars2 = new THREE.Points(starGeometry2, starMaterial2);
        scene.add(stars)
        scene.add(stars2)

        // Import 3D Model
        const spaceshipObj = new THREE.Object3D();
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('/assets/virtual_tour/spaceship/scene.gltf', (spaceship) => {
            spaceship.scene.position.set(10, -8, 0);
            spaceship.scene.scale.set(0.4, 0.4, 0.4);
            spaceship.scene.rotateX(-0.5 * Math.PI);
            cameraRef.current.position.setX(10);

            spaceshipObj.add(spaceship.scene);
            spaceshipObj.add(camera);
            spaceShipRef.current = spaceshipObj;
            scene.add(spaceshipObj);
        });

        const createPlanet = function (name, navigatePath, radius, ellipseY, rotateSpeed, orbitSpeed, texture, colors, ring) {
            const ellipseX = ellipseY * 1.7;
            // Create mesh
            const mesh = new THREE.Mesh(
                new THREE.SphereGeometry(radius, 32, 32),
                new THREE.MeshStandardMaterial({
                    map: textureLoader.load(texture),
                })
            );
            let orbitAngle = Math.floor(Math.random() * 1000);
            mesh.position.set(ellipseX * Math.cos(orbitAngle), 0, ellipseY * Math.sin(orbitAngle));

            // Create ring
            if (ring) {
                const ringMesh = new THREE.Mesh(
                    new THREE.RingGeometry(ring.innerRadius,
                        ring.outerRadius,
                        32),
                    new THREE.MeshBasicMaterial({
                        map: textureLoader.load(ring.texture),
                        side: THREE.DoubleSide,
                    })
                )
                // ringMesh.position.setX(ellipseY);
                ringMesh.rotation.x = -0.5 * Math.PI
                mesh.add(ringMesh);
                ringMesh.name = name;

            }

            // Create orbit-line
            let orbitPoint = [];
            const orbitMaterial = new THREE.LineBasicMaterial({
                color: colors,
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
            orbitLine.name = name;

            scene.add(mesh);
            scene.add(orbitLine);

            return { name, mesh, radius, rotateSpeed, orbitAngle, ellipseX, ellipseY, orbitLine };
        }

        const mercury = createPlanet('Mercury', 'mercury', 3.2, 28, 0.004, 0.04, '/assets/3d_page/texture/mercury.jpg', 0xffffff);
        const venus = createPlanet('Venus', 'venus', 5.8, 44, 0.002, 0.015, '/assets/3d_page/texture/venus.jpg', 0xffffff);
        const earth = createPlanet('Earth', 'earth', 6, 62, 0.02, 0.01, '/assets/3d_page/texture/earth.jpg', 0xffffff);
        const mars = createPlanet('Mars', 'mars', 4, 78, 0.018, 0.008, '/assets/3d_page/texture/mars.jpg', 0xffffff);
        const jupiter = createPlanet('Jupiter', 'jupiter', 12, 100, 0.04, 0.002, '/assets/3d_page/texture/jupiter.jpg', 0xffffff);
        const saturn = createPlanet('Saturn', 'saturn', 10, 138, 0.038, 0.0009, '/assets/3d_page/texture/saturn.jpg', 0xffffff, {
            innerRadius: 10,
            outerRadius: 20,
            texture: '/assets/3d_page/texture/saturn ring.png'
        });
        const uranus = createPlanet('Uranus', 'uranus', 7, 176, 0.03, 0.0004, '/assets/3d_page/texture/uranus.jpg', 0xffffff, {
            innerRadius: 7,
            outerRadius: 12,
            texture: '/assets/3d_page/texture/uranus ring.png'
        });
        const neptune = createPlanet('Neptune', 'neptune', 7, 200, 0.032, 0.0001, '/assets/3d_page/texture/neptune.jpg', 0xffffff);
        destinationRef.current = mars;

        const animate = function () {
            requestAnimationFrame(animate);

            // Self-rotation
            mars.mesh.rotateY(mars.rotateSpeed);

            renderer.render(scene, cameraRef.current);
        }
        animate();

    }, []);


    const spaceshipRadius = 5;

    const handleDestination = (destination) => (event) => {
        if (destination === 2) {
            const targetRotation = new THREE.Quaternion();
            targetRotation.setFromEuler(new THREE.Euler(0, Math.atan2(-destinationRef.current.mesh.position.x - spaceShipRef.current.position.x, -destinationRef.current.mesh.position.z - spaceShipRef.current.position.z), 0));
            gsap.to([spaceShipRef.current.position], {
                duration: 8,
                ease: "power3.inOut",
                x: destinationRef.current.mesh.position.x,
                y: destinationRef.current.mesh.position.y,
                z: destinationRef.current.mesh.position.z,
                onUpdate: () => {
                    const distance = spaceShipRef.current.position.distanceTo(destinationRef.current.mesh.position);
                    const destinationRadius = destinationRef.current.radius;
                    gsap.to(spaceShipRef.current.quaternion, {
                        duration: 2,
                        x: targetRotation.x,
                        y: targetRotation.y,
                        z: targetRotation.z,
                        w: targetRotation.w,
                        onUpdate: () => {
                            if (distance <= spaceshipRadius + destinationRadius) {
                                gsap.killTweensOf(spaceShipRef.current.position);
                                gsap.killTweensOf(spaceShipRef.current.quaternion);
                                return;
                            }
                        },
                    });
                }
            });
        }
    };

    const mouse = {
        x: undefined,
        y: undefined
    }

    // window.addEventListener('mousedown', (event) => {
    //     // cameraRef.current.position.setZ(0);
    //     if(cameraRef.current !== undefined){
    //         cameraRef.current.rotation.x += 0.1;
    //         console.log(cameraRef.current);
    //     }

    // });

    const rangeValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className="relative flex overflow-hidden w-full">
            <canvas id="space" alt="space" ref={canvasRef} />
            <button className="py-2 px-4 rounded-xl absolute top-auto mt-20 mx-auto text-lg bg-gradient-to-r 
                from-[#6e3f92] to-[#a94fa4]
                hover:marker:from-[#754798] hover:to-[#a65ea3] text-white"
                onClick={handleDestination(1)}>ไปยังจุดหมายที่ 1</button>
            <button className="py-2 px-4 rounded-xl absolute top-auto mt-40 mx-auto text-lg bg-gradient-to-r 
                from-[#6e3f92] to-[#a94fa4]
                hover:marker:from-[#754798] hover:to-[#a65ea3] text-white"
                onClick={handleDestination(2)}>ไปยังจุดหมายที่ 2</button>
            <input type="range" className="absolute right-0" min={0} max={rangeValues.length - 1} step={1}
                    defaultValue={0}/>
        </div>
    )
}

export default VirtualTour;