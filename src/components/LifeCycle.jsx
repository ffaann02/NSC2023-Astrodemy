import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const LifeCycle = (event) => {

    const canvasRef = useRef();
    const cameraRef = useRef();

    const [nameTH, setNameTH] = useState("เนบิวลา");
    const [nameENG, setNameENG] = useState("Stellar Nebula");
    const [infoLeft, setInfoLeft] = useState("ดาวเกิดจากการรวมตัวของแก๊สและฝุ่นในอวกาศ (Interstellar medium)  เมื่อมีมวล มวลมีแรงดึงดูดซึ่งกันและกันตามกฎความโน้มถ่วงแห่งเอกภพ (The Law of Universal) ของนิวตันที่มีสูตรว่า F = G (m1m2/r2) แรงดึงดูดแปรผันตามมวล มวลยิ่งมากแรงดึงดูดยิ่งมาก เราเรียกกลุ่มแก๊สและฝุ่นซึ่งรวมตัวกันในอวกาศว่า “เนบิวลา” (Nebula) หรือ “หมอกเพลิง” เนบิวลาเป็นกลุ่มแก๊สที่ขนาดใหญ่หลายปีแสง แต่เบาบางมีความหนาแน่นต่ำมาก องค์ประกอบหลักของเนบิวลาคือแก๊สไฮโดรเจน เนื่องจากไฮโดรเจนเป็นธาตุที่มีโครงสร้างพื้นฐาน ซึ่งเป็นธาตุตั้งต้นของทุกสรรพสิ่งในจักรวาล");
    const [infoRight, setInfoRight] = useState("เนบิวลามีอุณหภูมิต่ำ เนื่องจากไม่มีแหล่งกำเนิดความร้อน ในบริเวณที่แก๊สมีความหนาแน่นสูง อะตอมจะยึดติดกันเป็นโมเลกุล ทำให้เกิดแรงโน้มถ่วงดึงดูดแก๊สจากบริเวณโดยรอบมารวมกันอีก ทำให้มีความหนาแน่นและมวลเพิ่มขึ้นอีกจนกระทั่งอุณหภูมิภายในสูงประมาณ 10 เคลวิน   มวลที่เพิ่มขึ้นทำให้พลังงานศักย์โน้มถ่วงของแต่ละโมเลกุลที่ตกเข้ามายังศูนย์กลางของกลุ่มแก๊ส เปลี่ยนรูปเป็นพลังงานความร้อน และแผ่รังสีอินฟราเรดออกมา");

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
            
            const meshGeometry = new THREE.SphereGeometry(radius, 32, 32);
            const meshMaterial = new THREE.MeshBasicMaterial({
                map: textureLoader.load(texture),
            })
            
            const mesh = new THREE.Mesh(meshGeometry,meshMaterial);
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

            return {mesh, meshGeometry, meshMaterial};
        }

        const averageStar = createSun(12, '/assets/3d_page/texture/sun.jpg', -350, 0, 0, 1.2, 0.6, 1.0, 0.25, 0);
        const redGiant = createSun(24, '/assets/3d_page/texture/red_giant.jpg', -100, 0, -20, 1.2, 0.6, 1.0, 0, 0);
        const redSuperGiant = createSun(30, '/assets/3d_page/texture/red_super_giant.jpg', 150, 0, -20, 1.2, 0.6, 1.0, 0.1, 0);
        const whiteDwarf = createSun(8, '/assets/3d_page/texture/uranus.jpg', 650, 0, 0, 1.2, 0.6, 0.3, 0.6, 1);

        //Stellar Nebula
        let cloundParticles = [];
        for (let p = 0; p < 30; p++) {
            let cloud = new THREE.Mesh(
                new THREE.PlaneGeometry(50, 32, 32),
                new THREE.MeshLambertMaterial({
                    map: textureLoader.load('/assets/3d_page/texture/smoke.png'),
                    transparent: true,
                }));
            cloud.position.set(
                -2000,
                0,
                Math.random() * 100 - 100
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

            gsap.to(averageStar.mesh.rotation, {
                x: -mouse.y * 0.3,
                y: mouse.x * 0.5,
                duration: 2
            })

            gsap.to(redGiant.mesh.rotation, {
                x: -mouse.y * 0.3,
                y: mouse.x * 0.5,
                duration: 2
            })

            gsap.to(redSuperGiant.mesh.rotation, {
                x: -mouse.y * 0.3,
                y: mouse.x * 0.5,
                duration: 2
            })

            gsap.to(whiteDwarf.mesh.rotation, {
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

        return () => {
            averageStar.meshGeometry.dispose();
            averageStar.meshMaterial.dispose();
            redGiant.meshGeometry.dispose()
            redGiant.meshMaterial.dispose()
            redSuperGiant.meshGeometry.dispose()
            redSuperGiant.meshMaterial.dispose()
            whiteDwarf.meshGeometry.dispose()
            whiteDwarf.meshMaterial.dispose()
            console.log("Dispose work!");
        }

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
    const array_nameTH = [
        "เนบิวลา",
        "ดาวฤกษ์มวลปานกลาง",
        "ดาวยักษ์แดง",
        "ดาวยักษ์ใหญ่สีแดง",
        "เนบิวลาดาวเคราะห์",
        "ดาวเคระขาว"
    ]
    const array_nameENG = [
        "Steller Nebula",
        "Average Star",
        "Red Giant",
        "Red Supergiant",
        "Planetary Nebula",
        "White Dwarf"
    ]
    const array_infoLeft = [
        "ดาวเกิดจากการรวมตัวของแก๊สและฝุ่นในอวกาศ (Interstellar medium)  เมื่อมีมวล มวลมีแรงดึงดูดซึ่งกันและกันตามกฎความโน้มถ่วงแห่งเอกภพ (The Law of Universal) ของนิวตันที่มีสูตรว่า F = G (m1m2/r2) แรงดึงดูดแปรผันตามมวล มวลยิ่งมากแรงดึงดูดยิ่งมาก เราเรียกกลุ่มแก๊สและฝุ่นซึ่งรวมตัวกันในอวกาศว่า “เนบิวลา” (Nebula) หรือ “หมอกเพลิง” เนบิวลาเป็นกลุ่มแก๊สที่ขนาดใหญ่หลายปีแสง แต่เบาบางมีความหนาแน่นต่ำมาก องค์ประกอบหลักของเนบิวลาคือแก๊สไฮโดรเจน เนื่องจากไฮโดรเจนเป็นธาตุที่มีโครงสร้างพื้นฐาน ซึ่งเป็นธาตุตั้งต้นของทุกสรรพสิ่งในจักรวาล",
        "ดาวฤกษ์มวลปานกลางคือดาวฤกษ์ที่มีมวลประมาณระหว่าง 0.08 ถึง 0.5 เท่าของมวลดวงอาทิตย์ หรือมวลประมาณ 80 เท่าถึง 500 เท่าของมวลโลก ซึ่งเป็นขนาดที่มีความหนาแน่นปานกลางระหว่างดาวเคราะห์และดาวแคระ และเป็นชนิดของดาวฤกษ์ที่พบได้มากที่สุดในจักรวาลของเรา ตัวอย่างของดาวฤกษ์มวลปานกลางคือดวงอาทิตย์เล็ก ดาวแคระ และดาวเคราะห์บ้านเรา นอกจากนี้ยังมีดาวฤกษ์มวลปานกลางอื่นๆ ในจักรวาลเราอีกมากมายที่เราได้รู้จักและศึกษากันอย่างละเอียดอีกด้วย",
        "ดาวยักษ์แดงเป็นดาวขนาดใหญ่ มีอุณหภูมิที่ผิวประมาณ 2,500 ถึง 3,000 องศาเคลวิน (เป็นชนิดสเปกตรัม M หรือ K) รัศมีประมาณ 10 ถึง 100 เท่าของรัศมีของดวงอาทิตย์ ดาวยักษ์แดงเป็นสถานะหนึ่งของวิวัฒนาการของดาวฤกษ์ ซึ่งสามารถเกิดขึ้นกับดาวฤกษ์มวลตั้งแต่น้อยกว่าดวงอาทิตย์และดาวฤกษ์ที่มวลมากกว่ามวลของดวงอาทิตย์หลายสิบเท่า ดาวยักษ์แดงที่ใหญ่ที่สุดจะเกิดจากดาวฤกษ์มวลมากเรียกว่า ดาวมหายักษ์แดง (red supergiants)",
        "เป็นดาวที่มีขนาดใหญ่มากในสถานะของการไหลเวียนของดาว โดยมักจะมีมวลมากกว่า 8 เท่าของดวงอาทิตย์ และมีอุณหภูมิผิวดวงสูงกว่า 3,500 องศาเซลเซียส ทำให้ดาวมีสีแดงเหมือนเปลือกแคราที่เผลอไหลออกมาดาวยักษ์ใหญ่สีแดงเกิดจากการแปลงแรงที่เกิดขึ้นในดวงดาว โดยที่ดวงดาวจะมีอุณหภูมิสูงมากจนกระทั่งนิวเคลียร์ในดวงดาวจะเกิดการเชื่อมต่อกัน ทำให้แรงดันที่เกิดขึ้นนั้นทำให้ดวงดาวขยายตัวออกไปเป็นดาวยักษ์ใหญ่ และเมื่อเชื่อมต่อกันไม่ได้ต่อไปแล้ว ดาวยักษ์ใหญ่สีแดงก็จะพุ่งเป็นเกล็ดน้ำแข็งและร่วงหล่นลงมาเป็นหมวกหิมะในที่สุด",
        "เนบิวลาดาวเคราะห์เป็นส่วนหนึ่งของวิวัฒนาการในช่วงสุดท้ายของดาวฤกษ์มวลน้อย และดาวฤกษ์มวลปานกลาง เมื่อมันเข้าสู่ช่วงสุดท้ายของชีวิต ไฮโดรเจนในแกนกลางหมดลง ส่งผลให้ปฏิกิริยาเทอร์โมนิวเคลียร์ภายในแกนกลางยุติลงด้วย ทำให้ดาวฤกษ์เสียสมดุลระหว่างแรงดันออกจากความร้อนกับแรงโน้มถ่วง ทำให้แกนกลางของดาวยุบตัวลงเข้าหาศูนย์กลางเนื่องจากแรงโน้มถ่วงของตัวมันเอง จนกระทั่งหยุดเนื่องจากแรงดันดีเจนเนอเรซีของอิเล็กตรอน กลายเป็นดาวแคระขาว เปลือกภายนอกและเนื้อสารของดาวจะหลุดออก และขยายตัวไปในอวกาศ เป็นเนบิวลาดาวเคราะห์ซึ่งไม่มีพลังงานอยู่ แต่มันสว่างขึ้นได้เนื่องจากได้รับพลังงานจากดาวแคระขาวที่อยู่ภายใน เมื่อเวลาผ่านไปดาวแคระขาวก็จะเย็นตัวลง และเนบิวลาดาวเคราะห์ก็จะขยายตัวไปเรื่อย ๆ จนกระทั่งจางหายไปในอวกาศ",
        "ดาวแคระขาวคือ ดาวที่อุณหภูมิผิวสูงมาก แต่ไม่ค่อยสว่าง มีขนาดประมาณดาวเคราะห์ ดาวแคระขาวเป็นระยะสุดท้ายของวิวัฒนาการของดาวฤกษ์ส่วนใหญ่ที่มีมวลไม่มาก (ไม่เกิน 1.4 เท่าของมวลของดวงอาทิตย์ ) ดาวแคระขาวถูกค้นพบเป็นครั้งแรกในปี 1862 ซึ่งเป็นดาวแคระขาวที่อยู่ใกล้ดวงอาทิตย์มากที่สุด ชื่อว่าดาวซีริอัส ดาวแคระขาวเกิดจากการยุบตัวของแกนกลางของดาวฤกษ์ที่ไม่มีปฏิกิริยานิวเคลียร์แล้ว ประกอบด้วยอิเล็กตรอนที่อยู่ในสถานะดีเจนเนอเรท (degenerate electron) คือ เป็นสถานะที่อนุภาคทุกตัวประพฤติตัวแบบอนุภาคของ Bose-Einstein ในภาวะความดันสูง ดาวแคระขาวมีความหนาแน่นสูงมากดาวแคระขาวที่มีมวลเท่าดวงอาทิตย์จะมีขนาดเท่ากับขนาดของโลกเท่านั้น ซึ่งหมายความว่า น้ำตาลก้อน 1 ก้อน จะหนักเท่ากับฮิปโปโปเตมัส 1 ตัวทีเดียว บางครั้งเราถือว่าดาวแคระขาวเป็นดาวฤกษ์ที่ตายแล้ว เนื่องจากว่ามันไม่มีปฏิกิริยานิวเคลียร์แล้วนั่นเอง"
    ]
    const array_infoRight = [
        "เนบิวลามีอุณหภูมิต่ำ เนื่องจากไม่มีแหล่งกำเนิดความร้อน ในบริเวณที่แก๊สมีความหนาแน่นสูง อะตอมจะยึดติดกันเป็นโมเลกุล ทำให้เกิดแรงโน้มถ่วงดึงดูดแก๊สจากบริเวณโดยรอบมารวมกันอีก ทำให้มีความหนาแน่นและมวลเพิ่มขึ้นอีกจนกระทั่งอุณหภูมิภายในสูงประมาณ 10 เคลวิน   มวลที่เพิ่มขึ้นทำให้พลังงานศักย์โน้มถ่วงของแต่ละโมเลกุลที่ตกเข้ามายังศูนย์กลางของกลุ่มแก๊ส เปลี่ยนรูปเป็นพลังงานความร้อน และแผ่รังสีอินฟราเรดออกมา",
        "การสิ้นอายุขัยของดาวมวลปานกลาง จะก้าวพ้นลำดับหลักกลายเป็นดาวยักษ์สีแดง แล้วจบชีวิตเป็นเนบิวลาดาวเคราะห์และดาวแคระขาว เช่นเดียวกับดาวมวลน้อย หากแต่ดาวมวลปานกลางมีมวลมากพอที่จะกดดันให้แก่นดาวมีอุณหภูมิสูง 600 ล้านเคลวิน จุดฟิวชันคาร์บอนให้หลอมรวมเป็นออกซิเจน ดาวแคระขาวที่เกิดจากดาวมวลปานกลางจึงเป็นดาวออกซิเจน",
        "ระยะทาง มวล และรัศมีของดาวยักษ์แดง แม้ว่าดาวยักษ์แดงจะสามารถมองเห็นได้ด้วยตาเปล่าเหมือนดาวฤกษ์ทั่ว ๆ ไป แต่มันก็หายาก เพราะว่าดาวยักษ์แดงเป็นช่วงอายุสั้น ๆ ของดาวฤกษ์ ในช่วงก่อนปี 1990 นักดาราศาสตร์ยังไม่ค่อยรู้ระยะทาง และความสว่างของดาวยักษ์แดง แต่หลังจากภารกิจ Hipparcos (ในช่วงปี 1989-1993) นักดาราศาสตร์สามารถวัดระยะทางของดาวยักษ์แดงจำนวนมากได้อย่างแม่นยำ แต่มีเพียงไม่กี่ดวงที่นักดาราศาสตร์สามารถวัดมวลได้ เนื่องจากมวลของดาวฤกษ์สามารถวัดได้เฉพาะเมื่อมันเป็นระบบดาวคู่ สำหรับระบบดาวคู่ในกรณีที่ดาวดวงหนึ่งเป็นดาวยักษ์แดง มันก็จะกลืนดาวที่เป็นคู่ของมันได้ง่ายถ้าคู่ของมันอยู่ใกล้มันมากเกินไป แต่ถ้าคู่มันอยู่ไกลเกินไปมันก็จะใช้เวลาเป็นศตวรรษหรือมากกว่าในการโคจรครบหนึ่งรอบ ซึ่งทำให้การวัดมีความแม่นยำน้อยลงเช่นกัน สำหรับรัศมีของดาวยักษ์แดงนั้น ไม่เพียงแต่จะยากในการวัด มันยังยากในการนิยามอีกด้วย เนื่องจากชั้นบรรยากาศของดาวยักษ์แดงค่อนข้างจะทึบมาก ๆ  ซึ่งนักดาราศาสตร์กำลังพยายามที่จะหาวิธีที่จะวัดให้แม่นยำขึ้น",
        "ตัวอย่างของดาวยักษ์ใหญ่สีแดงที่เป็นที่รู้จักกันมากในจักรวาลของเราได้แก่ Betelgeuse และ Antares ซึ่งเป็นดาวที่สามารถมองเห็นได้ด้วยตาเปล่าในภาพที่สวยงามของท้องฟ้าในช่วงเวลาต่างๆ ของปี",
        "เนบิวลาดาวเคราะห์ไม่ได้มีส่วนเกี่ยวข้องใดกับดาวเคราะห์ ชื่อนี้ได้มาจากลักษณะที่เป็นวงกลมขนาดเล็กคล้ายดาวเคราะห์เมื่อสังเกตจากกล้องโทรทรรศน์นั่นเอง ตัวอย่างของเนบิวลาชนิดนี้ได้แก่ เนบิวลาวงแหวน ในกลุ่มดาวพิณ (M57 Ring Nebula) เนบิวลาดัมเบลล์ (M27 Dumbbell Nebula)เนบิวลาตาแมว (Cat’s eye Nebula) เนบิวลาเกลียว (Helix Nebula) เป็นต้น",
        "ชนิดของดาวแคระขาว ดาวฤกษ์ที่มีมวลน้อยจนไม่สามารถเผาคาร์บอนในแกนได้จะกลายเป็นดาวแคระขาวแบบคาร์บอน-ออกซิเจน ขณะที่ดาวฤกษ์มีมวลตอนเริ่มต้นเป็น 1.4 เท่าของมวลของดวงอาทิตย์จะกลายเป็นดาวแคระขาว นีออน-ออกซิเจน ดาวแคระขาวแต่ละชนิดจะต่างกันที่สเปกตรัมที่เปล่งออกมา ซึ่งขึ้นกับธาตุที่อยู่บนผิวของดาวนั้น ๆ ดาวแคระขาวชนิด dA, dB และ dO (d ย่อมาจาก degenerate) จะมีธาตุเพียงชนิดเดียวอยู่ที่ผิวซึ่งอาจจะเป็นไฮโดรเจนหรือฮีเลียมก็ได้ ผิวของดาวแคระขาวอาจมีธาตุมากกว่าหนึ่งธาตุก็ได้ และเราจะเรียกชนิดของมันตามธาตุที่อยู่บนผิว เช่น ดาวแคระขาว dAB ก็เป็นดาวแคระขาวที่ผิวประกอบด้วยไฮโดรเจนและฮีเลียม ส่วนดาวแคระขาว dAO ก็เป็นดาวแคระขาวที่ผิวประกอบด้วยไฮโดรเจนกับไฮเลียมอะตอมที่ถูกทำให้มีประจุ"
    ]

    const moveTime = 2;
    const handleRangeChange = (event) => {
        const step = event.target.value;
        setNameTH(array_nameTH[step]);
        setNameENG(array_nameENG[step]);
        setInfoLeft(array_infoLeft[step]);
        setInfoRight(array_infoRight[step]);
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
            <div className='w-full absolute flex mt-6'>
                <p className='mx-auto text-white font-ibm-thai text-2xl'>วัฎจักรดวงอาทิตย์</p>
            </div>

            <div className="absolute font-ibm-thai text-white
               bg-gray-800 bg-opacity-20 w-1/5 h-1/2 left-0 mt-14 ml-14 mr-14
               overflow-auto overflow-y-scroll scrollbar-thin scrollbar-thumb-transparent pb-14" >
                <p className="text-3xl font-bold mx-10 mt-10" >{nameTH}</p>
                <p className="text-2xl font-bold mx-10 mt-2" >{nameENG}</p>
                <p className="mx-10 mt-4 text-xl">{infoLeft}</p>
            </div>

            <div className="absolute font-ibm-thai text-white
               bg-gray-800 bg-opacity-20 w-1/5 h-1/2 right-0 mt-14 ml-14 mr-14
               overflow-auto overflow-y-scroll scrollbar-thin scrollbar-thumb-transparent pb-14" >
                <p className="mx-10 mt-4 text-xl">{infoRight}</p>
            </div>

            <div className="absolute w-full bottom-32">
                <div className='max-w-4xl top-5 flex h-fit text-white mx-auto font-ibm-thai cursor-pointer'>
                    <div className='w-full max-w-4xl absolute'>
                        <div className='absolute -top-10 left-0'>
                            <p>Stellar Nebula</p>
                        </div>
                        <div className='absolute -top-10 left-[16%] text-center'>
                            <p>Average Star</p>
                        </div>
                        <div className='absolute -top-10 left-[36%]'>
                            <p>Red Giant</p>
                        </div>
                        <div className='absolute -top-10 left-[54%]'>
                            <p>Red Supergiant</p>
                        </div>
                        <div className='absolute -top-10 right-[13.5%] text-center'>
                            <p>Planetary Nebula
                            </p>
                        </div>
                        <div className='absolute -top-10 right-0'>
                            <p>White Dwarf</p>
                        </div>
                    </div>
                    <input type="range" className="w-full h-4 appearance-none rounded-full bg-white outline-none mx-auto" min={0} max={rangeValues.length - 1} step={1}
                        defaultValue={0} onChange={handleRangeChange} />
                </div>
            </div>
        </div>
    )
}

export default LifeCycle;