import * as THREE from 'three';
import React, { useRef, useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

const FakeDisplay3D = () => {

    const canvasRef = useRef();
    const cameraRef = useRef();

    const headerName = "แบบจำลองของฉัน";
    const [infoLeft, setInfoLeft] = useState("ทดลองสีฝุ่น");

    // Recieve Data
    // const location = useLocation();
    // console.log(location.state);

    // const modelAmount = location.state.length
    // console.log(modelAmount);

    // let name = [];
    // let shape = [];
    // let size = [];
    // let texture = [];
    // for(let i = 0; i < modelAmount; i++){
    //     name.push(location.state[i].name);
    //     shape.push(location.state[i].shape);
    //     size.push(location.state[i].size);
    //     texture.push(location.state[i].texture);
    // }

    // const allData = location.state;
    // allData.forEach(data => {
    //     console.log(data);
    // });

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
        camera.position.set(0, 0, 24);

        // Light
        const ambientLight = new THREE.AmbientLight(0x333333, 4);
        scene.add(ambientLight);

        // Nebula 1
        let cloundParticles = [];
        for (let p = 0; p < 30; p++) {
            let cloud = new THREE.Mesh(
                new THREE.PlaneGeometry(50, 25, 25),
                new THREE.MeshLambertMaterial({
                    map: textureLoader.load('/assets/3d_page/texture/smoke.png'),
                    transparent: true,
                }));
            cloud.position.set(
                0,
                0,
                Math.random() * 100 - 100
            );
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.scale.set(1 + 0.5, 1 + 0.5, 1 + 0.5);
            cloud.material.opacity = 0.4;
            cloundParticles.push(cloud);
            scene.add(cloud);
        }
        const custom_color1_light = new THREE.PointLight(0x4d00ff, 2, 100);
        custom_color1_light.position.set(0, 0, 40);
        scene.add(custom_color1_light);

        const custom_color2_light = new THREE.PointLight(0xffe100, 2, 100);
        custom_color2_light.position.set(0, 0, 0);
        scene.add(custom_color2_light);

        const custom_color3_light = new THREE.PointLight(0x3677ac, 2, 100);
        custom_color3_light.position.set(0, 0, 60);
        scene.add(custom_color3_light);


        // Nebula 2
        let cloundParticles2 = [];
        for (let p = 0; p < 30; p++) {
            let cloud = new THREE.Mesh(
                new THREE.PlaneGeometry(50, 25, 25),
                new THREE.MeshLambertMaterial({
                    map: textureLoader.load('/assets/3d_page/texture/smoke.png'),
                    transparent: true,
                }));
            cloud.position.set(
                300,
                0,
                Math.random() * 100 - 100
            );
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.scale.set(1, 1, 1);
            cloud.material.opacity = 0.4;
            cloundParticles2.push(cloud);
            scene.add(cloud);
        }
        const color1_Light = new THREE.PointLight(0xd8547e, 2, 100);
        color1_Light.position.set(300, 0, 40);
        scene.add(color1_Light);

        const color2_Light = new THREE.PointLight(0xcc6600, 2, 100);
        color2_Light.position.set(300, 0, 0);
        scene.add(color2_Light);

        const color3_Light = new THREE.PointLight(0x3677ac, 2, 100);
        color3_Light.position.set(300, 0, 60);
        scene.add(color3_Light);


        // Saturn
        const saturnGeometry = new THREE.SphereGeometry(6, 32, 32);
        const saturnMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load('/assets/3d_page/texture/saturn.jpg') });
        const saturnObject = new THREE.Mesh(saturnGeometry, saturnMaterial);
        saturnObject.position.set(600, 0, 0);
        scene.add(saturnObject);
        const ringGeometry = new THREE.RingGeometry(9, 12, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            map: textureLoader.load('/assets/3d_page/texture/saturn ring.png'),
            side: THREE.DoubleSide,
        })
        const ringObject = new THREE.Mesh(ringGeometry, ringMaterial);
        ringObject.position.set(600, 0, 0);
        ringObject.rotation.x = -0.5 * 2.9;
        scene.add(ringObject);

        // Sun
        const sunGeometry = new THREE.SphereGeometry(9, 32, 32);
        const sunMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load('/assets/3d_page/texture/sun.jpg') });
        const sunObject = new THREE.Mesh(sunGeometry, sunMaterial);
        sunObject.position.set(900, 0, 0);
        scene.add(sunObject);

        // Meteo
        const metepGeometry = new THREE.SphereGeometry(8, 32, 32);
        const meteoMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load('/assets/3d_page/texture/venus.jpg') });
        const meteoObject = new THREE.Mesh(metepGeometry, meteoMaterial);
        meteoObject.position.set(1200, 0, 0);
        scene.add(meteoObject);

        const animate = function () {
            requestAnimationFrame(animate);
            sunObject.rotateY(0.008); 
            meteoObject.rotateY(0.064); 
            renderer.render(scene, cameraRef.current);
        }

        animate();

    }, []);

    const array_infoLeft = [
        "ทดลองสีฝุ่น",
        "",
        "ดาวเสาร์และวงแหวน",
        "ดวงอาทิตย์",
        "อุกกาบาตหมุนอย่างรวดเร็ว",
    ]

    const rangeValues = [1, 2, 3, 4, 5];
    const cameraPosValue = [
        [0, 0, 24],
        [300, 0, 24],
        [600, 0, 24],
        [900, 0, 24],
        [1200, 0, 24]
    ]
    const getCameraPosition = (value) => {
        const index = rangeValues.indexOf(value);
        const [x, y, z] = cameraPosValue[index];
        return { x, y, z };
    };
    const moveTime = 1.5;
    const handleRangeChange = (event) => {
        const step = event.target.value;
        setInfoLeft(array_infoLeft[step]);
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
            <div className='w-full absolute flex mt-6'>
                <p className='mx-auto text-white font-ibm-thai text-2xl'>{headerName}</p>
            </div>

            <div className="absolute font-ibm-thai text-white
               bg-gray-800 bg-opacity-20 w-1/5 h-1/2 left-0 mt-14 ml-14 mr-14
               overflow-auto overflow-y-scroll scrollbar-thin scrollbar-thumb-transparent pb-14" >
                <p className="mx-10 mt-4 text-xl">{infoLeft}</p>
            </div>

            <div className="absolute w-full bottom-32">
                <div className='max-w-4xl top-5 flex h-fit text-white mx-auto font-ibm-thai cursor-pointer'>
                    <div className='w-full max-w-4xl absolute'>
                        <div className='absolute -top-10 left-0'>
                            <p>Nebula 1</p>
                        </div>
                        <div className='absolute -top-10 left-[22%] text-center'>
                            <p>Nebula 2</p>
                        </div>
                        <div className='absolute -top-10 left-[47%]'>
                            <p>Saturn</p>
                        </div>
                        <div className='absolute -top-10 left-[73%]'>
                            <p>Sun</p>
                        </div>
                        <div className='absolute -top-10 left-[95%] text-center'>
                            <p>Meteo</p>
                        </div>
                    </div>
                    <input type="range" className="w-full mx-auto h-4 appearance-none rounded-full bg-white outline-none" min={0} max={rangeValues.length - 1} step={1}
                        defaultValue={0} onChange={handleRangeChange} />
                </div>
            </div>
        </div>
    )
}

export default FakeDisplay3D;