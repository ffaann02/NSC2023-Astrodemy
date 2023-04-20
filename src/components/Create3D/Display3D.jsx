import * as THREE from 'three';
import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const Display3D = () => {

    const canvasRef = useRef();
    const cameraRef = useRef();

    const headerName = "แบบจำลอง by ครูสมศรี";
    const [infoLeft, setInfoLeft] = useState("ดาวเกิดจากการรวมตัวของแก๊สและฝุ่นในอวกาศ (Interstellar medium)  เมื่อมีมวล มวลมีแรงดึงดูดซึ่งกันและกันตามกฎความโน้มถ่วงแห่งเอกภพ (The Law of Universal) ของนิวตันที่มีสูตรว่า F = G (m1m2/r2) แรงดึงดูดแปรผันตามมวล มวลยิ่งมากแรงดึงดูดยิ่งมาก เราเรียกกลุ่มแก๊สและฝุ่นซึ่งรวมตัวกันในอวกาศว่า “เนบิวลา” (Nebula) หรือ “หมอกเพลิง” เนบิวลาเป็นกลุ่มแก๊สที่ขนาดใหญ่หลายปีแสง แต่เบาบางมีความหนาแน่นต่ำมาก องค์ประกอบหลักของเนบิวลาคือแก๊สไฮโดรเจน เนื่องจากไฮโดรเจนเป็นธาตุที่มีโครงสร้างพื้นฐาน ซึ่งเป็นธาตุตั้งต้นของทุกสรรพสิ่งในจักรวาล");

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
            renderer.render(scene, cameraRef.current);
        }

        animate();

    }, []);

    const array_infoLeft = [
        "ดาวเกิดจากการรวมตัวของแก๊สและฝุ่นในอวกาศ (Interstellar medium)  เมื่อมีมวล มวลมีแรงดึงดูดซึ่งกันและกันตามกฎความโน้มถ่วงแห่งเอกภพ (The Law of Universal) ของนิวตันที่มีสูตรว่า F = G (m1m2/r2) แรงดึงดูดแปรผันตามมวล มวลยิ่งมากแรงดึงดูดยิ่งมาก เราเรียกกลุ่มแก๊สและฝุ่นซึ่งรวมตัวกันในอวกาศว่า “เนบิวลา” (Nebula) หรือ “หมอกเพลิง” เนบิวลาเป็นกลุ่มแก๊สที่ขนาดใหญ่หลายปีแสง แต่เบาบางมีความหนาแน่นต่ำมาก องค์ประกอบหลักของเนบิวลาคือแก๊สไฮโดรเจน เนื่องจากไฮโดรเจนเป็นธาตุที่มีโครงสร้างพื้นฐาน ซึ่งเป็นธาตุตั้งต้นของทุกสรรพสิ่งในจักรวาล",
        "ดาวฤกษ์มวลปานกลางคือดาวฤกษ์ที่มีมวลประมาณระหว่าง 0.08 ถึง 0.5 เท่าของมวลดวงอาทิตย์ หรือมวลประมาณ 80 เท่าถึง 500 เท่าของมวลโลก ซึ่งเป็นขนาดที่มีความหนาแน่นปานกลางระหว่างดาวเคราะห์และดาวแคระ และเป็นชนิดของดาวฤกษ์ที่พบได้มากที่สุดในจักรวาลของเรา ตัวอย่างของดาวฤกษ์มวลปานกลางคือดวงอาทิตย์เล็ก ดาวแคระ และดาวเคราะห์บ้านเรา นอกจากนี้ยังมีดาวฤกษ์มวลปานกลางอื่นๆ ในจักรวาลเราอีกมากมายที่เราได้รู้จักและศึกษากันอย่างละเอียดอีกด้วย",
        "ดาวยักษ์แดงเป็นดาวขนาดใหญ่ มีอุณหภูมิที่ผิวประมาณ 2,500 ถึง 3,000 องศาเคลวิน (เป็นชนิดสเปกตรัม M หรือ K) รัศมีประมาณ 10 ถึง 100 เท่าของรัศมีของดวงอาทิตย์ ดาวยักษ์แดงเป็นสถานะหนึ่งของวิวัฒนาการของดาวฤกษ์ ซึ่งสามารถเกิดขึ้นกับดาวฤกษ์มวลตั้งแต่น้อยกว่าดวงอาทิตย์และดาวฤกษ์ที่มวลมากกว่ามวลของดวงอาทิตย์หลายสิบเท่า ดาวยักษ์แดงที่ใหญ่ที่สุดจะเกิดจากดาวฤกษ์มวลมากเรียกว่า ดาวมหายักษ์แดง (red supergiants)",
        "เป็นดาวที่มีขนาดใหญ่มากในสถานะของการไหลเวียนของดาว โดยมักจะมีมวลมากกว่า 8 เท่าของดวงอาทิตย์ และมีอุณหภูมิผิวดวงสูงกว่า 3,500 องศาเซลเซียส ทำให้ดาวมีสีแดงเหมือนเปลือกแคราที่เผลอไหลออกมาดาวยักษ์ใหญ่สีแดงเกิดจากการแปลงแรงที่เกิดขึ้นในดวงดาว โดยที่ดวงดาวจะมีอุณหภูมิสูงมากจนกระทั่งนิวเคลียร์ในดวงดาวจะเกิดการเชื่อมต่อกัน ทำให้แรงดันที่เกิดขึ้นนั้นทำให้ดวงดาวขยายตัวออกไปเป็นดาวยักษ์ใหญ่ และเมื่อเชื่อมต่อกันไม่ได้ต่อไปแล้ว ดาวยักษ์ใหญ่สีแดงก็จะพุ่งเป็นเกล็ดน้ำแข็งและร่วงหล่นลงมาเป็นหมวกหิมะในที่สุด",
        "เนบิวลาดาวเคราะห์เป็นส่วนหนึ่งของวิวัฒนาการในช่วงสุดท้ายของดาวฤกษ์มวลน้อย และดาวฤกษ์มวลปานกลาง เมื่อมันเข้าสู่ช่วงสุดท้ายของชีวิต ไฮโดรเจนในแกนกลางหมดลง ส่งผลให้ปฏิกิริยาเทอร์โมนิวเคลียร์ภายในแกนกลางยุติลงด้วย ทำให้ดาวฤกษ์เสียสมดุลระหว่างแรงดันออกจากความร้อนกับแรงโน้มถ่วง ทำให้แกนกลางของดาวยุบตัวลงเข้าหาศูนย์กลางเนื่องจากแรงโน้มถ่วงของตัวมันเอง จนกระทั่งหยุดเนื่องจากแรงดันดีเจนเนอเรซีของอิเล็กตรอน กลายเป็นดาวแคระขาว เปลือกภายนอกและเนื้อสารของดาวจะหลุดออก และขยายตัวไปในอวกาศ เป็นเนบิวลาดาวเคราะห์ซึ่งไม่มีพลังงานอยู่ แต่มันสว่างขึ้นได้เนื่องจากได้รับพลังงานจากดาวแคระขาวที่อยู่ภายใน เมื่อเวลาผ่านไปดาวแคระขาวก็จะเย็นตัวลง และเนบิวลาดาวเคราะห์ก็จะขยายตัวไปเรื่อย ๆ จนกระทั่งจางหายไปในอวกาศ",
        "ดาวแคระขาวคือ ดาวที่อุณหภูมิผิวสูงมาก แต่ไม่ค่อยสว่าง มีขนาดประมาณดาวเคราะห์ ดาวแคระขาวเป็นระยะสุดท้ายของวิวัฒนาการของดาวฤกษ์ส่วนใหญ่ที่มีมวลไม่มาก (ไม่เกิน 1.4 เท่าของมวลของดวงอาทิตย์ ) ดาวแคระขาวถูกค้นพบเป็นครั้งแรกในปี 1862 ซึ่งเป็นดาวแคระขาวที่อยู่ใกล้ดวงอาทิตย์มากที่สุด ชื่อว่าดาวซีริอัส ดาวแคระขาวเกิดจากการยุบตัวของแกนกลางของดาวฤกษ์ที่ไม่มีปฏิกิริยานิวเคลียร์แล้ว ประกอบด้วยอิเล็กตรอนที่อยู่ในสถานะดีเจนเนอเรท (degenerate electron) คือ เป็นสถานะที่อนุภาคทุกตัวประพฤติตัวแบบอนุภาคของ Bose-Einstein ในภาวะความดันสูง ดาวแคระขาวมีความหนาแน่นสูงมากดาวแคระขาวที่มีมวลเท่าดวงอาทิตย์จะมีขนาดเท่ากับขนาดของโลกเท่านั้น ซึ่งหมายความว่า น้ำตาลก้อน 1 ก้อน จะหนักเท่ากับฮิปโปโปเตมัส 1 ตัวทีเดียว บางครั้งเราถือว่าดาวแคระขาวเป็นดาวฤกษ์ที่ตายแล้ว เนื่องจากว่ามันไม่มีปฏิกิริยานิวเคลียร์แล้วนั่นเอง"
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

export default Display3D;