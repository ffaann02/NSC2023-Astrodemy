import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import vertexShader from './Shaders/vertex.glsl'

const Earth = () => {


    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const textureLoader = new THREE.TextureLoader();

        // Create the scene
        const scene = new THREE.Scene();

        // Camera and Renderer
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas , antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(15);

        // Light
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 2, 1200)
        scene.add(pointLight);

        // Sun mesh
        const earth = new THREE.Mesh(
            new THREE.SphereGeometry(6, 32, 32),
            new THREE.ShaderMaterial({
                // vertexShader: ,
                // fragmentShader: 
                // map: textureLoader.load('/assets/3d_page/texture/earth2.jpg'),
            })
        );
        scene.add(earth);
        console.log(earth);

        const animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();

    }, []);

    return (
        <div className='relative flex justify-center overflow-hidden'>
            <canvas id="space" alt="space" ref={canvasRef} />
            <p className="text-4xl font-ibm-thai font-bold text-white absolute top-auto mx-auto"></p>
        </div>
    )
}

export default Earth;