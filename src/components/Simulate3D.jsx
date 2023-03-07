import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Simulate3D = () => {
    useEffect(() => {

        const textureLoader = new THREE.TextureLoader();

        // Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(30);

        // Light
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 2, 300)
        scene.add(pointLight);

        // Orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);

        // Create Planet
        const createPlanet = function (size, texturePath, position, ring) {
            // Mesh
            const mesh = new THREE.Mesh(
                new THREE.SphereGeometry(size, 30, 30),
                new THREE.MeshStandardMaterial({
                    map: textureLoader.load(texturePath),
                })
            )
            // Object3D
            const obj = new THREE.Object3D();
            obj.add(mesh);
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
                obj.add(ringMesh);
                ringMesh.position.setX(position);
                ringMesh.rotation.x = -0.5 * Math.PI
            }
            scene.add(obj);
            mesh.position.setX(position);
            return { mesh, obj }
        }

        const mercury = createPlanet(3.2, '/assets/3d_page/texture/mercury.jpg', 28)
        const venus = createPlanet(5.8, '/assets/3d_page/texture/venus.jpg', 44);
        const earth = createPlanet(6, '/assets/3d_page/texture/earth.jpg', 62);
        const mars = createPlanet(4, '/assets/3d_page/texture/mars.jpg', 78);
        const jupiter = createPlanet(12, '/assets/3d_page/texture/jupiter.jpg', 100);
        const saturn = createPlanet(10, '/assets/3d_page/texture/saturn.jpg', 138, {
            innerRadius: 10,
            outerRadius: 20,
            texture: '/assets/3d_page/texture/saturn ring.png'
        });
        const uranus = createPlanet(7, '/assets/3d_page/texture/uranus.jpg', 176, {
            innerRadius: 7,
            outerRadius: 12,
            texture: '/assets/3d_page/texture/uranus ring.png'
        });
        const neptune = createPlanet(7, '/assets/3d_page/texture/neptune.jpg', 200);

        // Sun
        const sun = new THREE.Mesh(
            new THREE.SphereGeometry(16, 32, 32),
            new THREE.MeshBasicMaterial({
                map: textureLoader.load('/assets/3d_page/texture/sun.jpg'),
            })
        )
        scene.add(sun);

        // Animate function (Loop)
        const animate = function () {
            requestAnimationFrame(animate);
            //Self-rotation
            sun.rotateY(0.004);
            mercury.mesh.rotateY(0.004);
            venus.mesh.rotateY(0.002);
            earth.mesh.rotateY(0.02);
            mars.mesh.rotateY(0.018);
            jupiter.mesh.rotateY(0.04);
            saturn.mesh.rotateY(0.038);
            uranus.mesh.rotateY(0.03);
            neptune.mesh.rotateY(0.032);

            //Around-sun-rotation
            mercury.obj.rotateY(0.04);
            venus.obj.rotateY(0.015);
            earth.obj.rotateY(0.01);
            mars.obj.rotateY(0.008);
            jupiter.obj.rotateY(0.002);
            saturn.obj.rotateY(0.0009);
            uranus.obj.rotateY(0.0004);
            neptune.obj.rotateY(0.0001);

            renderer.render(scene, camera);
            // controls.update();
        };
        animate();

    }, []);

    return (
        <div>
            <canvas id="bg" alt="bg"></canvas>
        </div>
    );
}

export default Simulate3D;
