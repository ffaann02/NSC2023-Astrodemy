import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Float32BufferAttribute } from 'three';

const Saturn = (event) => {

    const [isHover, setIsHover] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    const canvasRef = useRef();
    const cameraRef = useRef();
    const planetRef = useRef();
    const ringRef = useRef();
    const shaderRef = useRef();
    const meshesRef = useRef([]);

    const vertex =
        `
    varying vec2 vertexUV;
    varying vec3 vertexNormal;
    void main() {
        vertexUV = uv;
        vertexNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

    const fragment =
        `
    uniform sampler2D globeTexture;
    varying vec2 vertexUV;
    varying vec3 vertexNormal;
    void main() {
        float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
        vec3 atmosphere = vec3(0.8, 0.7, 0.6) * pow(intensity, 1.5);

        gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 1.0);
    }
    `;

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
        float intensity = pow(0.6 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
        gl_FragColor = vec4(0.8, 0.7, 0.6, 1.0) * intensity;
    }
    `;

    const ringVertex =
        `
    varying vec2 vertexRingUV;
    varying vec3 vertexRingNormal;
    void main() {
        vertexRingUV = uv;
        vertexRingNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

    const ringFragment =
        `
    uniform sampler2D ringTexture;
    varying vec2 vertexRingUV;
    varying vec3 vertexRingNormal;
    void main() {
        float intensity = 0.6 - dot(vertexRingNormal, vec3(0.0, 0.0, 1.0));
        vec3 atmosphere = vec3(0.8, 0.7, 0.6) * pow(intensity, 1.5);

        gl_FragColor = vec4(atmosphere + texture2D(ringTexture, vertexRingUV).xyz, 1.0);
    }
    `;

    const mouse = {
        x: undefined,
        y: undefined
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const textureLoader = new THREE.TextureLoader();

        // Create the scene
        const scene = new THREE.Scene();

        // Camera and Renderer
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        cameraRef.current = camera;
        // const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // camera.position.setZ(15);
        cameraRef.current.position.setZ(15);
        cameraRef.current.lookAt(0, 0, 0);

        // Light
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 2, 1200)
        scene.add(pointLight);

        const meshes_planet = [];

        // Saturn mesh
        const saturn = new THREE.Mesh(
            new THREE.SphereGeometry(6, 32, 32),
            new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    globeTexture: {
                        value: textureLoader.load('/assets/3d_page/texture/saturn.jpg')
                    },
                },
            })
        );
        meshes_planet.push(saturn);

        // Ring mesh
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(7, 10, 32),
            new THREE.ShaderMaterial({
                vertexShader: ringVertex,
                fragmentShader: ringFragment,
                uniforms: {
                    ringTexture: {
                        value: textureLoader.load('/assets/3d_page/texture/saturn ring.jpg')
                    }
                },
                side: THREE.DoubleSide,
            })
        )
        ring.rotation.x = -0.5 * Math.PI

        // Shader
        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(6, 32, 32),
            new THREE.ShaderMaterial({
                vertexShader: atmosphereVertex,
                fragmentShader: atmosphereFragment,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
            })
        );
        atmosphere.scale.set(1.2, 1.2, 1.2)
        scene.add(atmosphere);

        // Create group (for rotate group)
        const group = new THREE.Group();
        group.add(saturn);
        group.add(ring);
        scene.add(group);

        planetRef.current = group;
        shaderRef.current = atmosphere;
        ringRef.current = ring;

        // Create star
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff
        });
        const starVertices = []
        for (let i = 0; i < 5000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = -Math.random() * 2000;
            starVertices.push(x, y, z);
        }
        starGeometry.setAttribute('position', new Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars)

        const animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, cameraRef.current);
            saturn.rotation.y += 0.002;
            gsap.to(group.rotation, {
                x: -mouse.y * 0.3,
                y: mouse.x * 0.5,
                duration: 2
            })
            meshesRef.current = meshes_planet;
        }
        animate();

    }, []);

    window.addEventListener('mousemove', (event) => {
        const clientWidth = event.clientX;
        const clientHeight = event.clientY;
        mouse.x = (clientWidth / window.innerWidth) * 2 - 1;
        mouse.y = -(clientHeight / window.innerHeight) * 2 + 1;
    });

    const moveTime = 1.5;
    const reScale = moveTime - (moveTime / 3);

    const movePlanet = (event) => {
        if (!showDetail) {
            gsap.to(cameraRef.current.position, {
                duration: moveTime,
                x: 12.5,
                y: 0,
                z: 18,
                onUpdate: function () {
                    gsap.to(shaderRef.current.position, {
                        duration: moveTime,
                        x: -1.5,
                        y: 0,
                        z: -1.2,
                    })
                    gsap.to(planetRef.current.scale, {
                        duration: reScale,
                        x: 1,
                        y: 1.2,
                        z: 1,
                    })
                    gsap.to(shaderRef.current.scale, {
                        duration: reScale,
                        x: 1.2,
                        y: 1.35,
                        z: 1.25,
                    })
                    gsap.to(ringRef.current.position, {
                        duration: moveTime,
                        x: 0.25,
                    })
                },
            })
            setShowDetail(true);
        }
        else {
            gsap.to(cameraRef.current.position, {
                duration: moveTime,
                x: 0,
                y: 0,
                z: 18,
                onUpdate: function () {
                    gsap.to(shaderRef.current.position, {
                        duration: moveTime,
                        x: 0,
                        y: 0,
                        z: 0,
                    })
                    gsap.to(planetRef.current.scale, {
                        duration: reScale,
                        x: 1,
                        y: 1,
                        z: 1,
                    })
                    gsap.to(shaderRef.current.scale, {
                        duration: reScale,
                        x: 1.2,
                        y: 1.2,
                        z: 1.2,
                    })
                    gsap.to(ringRef.current.position, {
                        duration: moveTime,
                        x: 0,
                    })
                },
            })
            setShowDetail(false);
        }

    };

    const handleMouseMove = (event) => {
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
        if (cameraRef.current) {
            raycaster.setFromCamera(mouse, cameraRef.current);
        }

        // Find all the intersections between the raycaster and the meshes
        const intersects = raycaster.intersectObjects(meshesRef.current);

        if (intersects.length > 0) {
            setIsHover(true);
        }
        else {
            setIsHover(false);
        }
    }

    const handleClick = (event) => {
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

        if (intersects.length > 0) {
            movePlanet();
        }
    };

    return (
        <div className="relative flex overflow-hidden w-full justify-center">
            <canvas id="space" alt="space" ref={canvasRef} onMouseMove={handleMouseMove} onClick={handleClick} />
            {(isHover && !showDetail) ?
                <p className='absolute mt-14 font-ibm-thai text-4xl font-bold text-white'>คลิกที่ดาวเพื่อดูข้อมูลเพิ่มเติม</p> : null}

            {showDetail ?
                <div className="absolute font-ibm-thai text-white 
               bg-gradient-to-b from-zinc-800 w-1/2 h-full right-0" >
                    <p className="text-4xl font-bold mx-14 mt-14" >ดาวเสาร์ (Saturn)</p>
                    <p className="mx-14 mt-2 text-2xl font-bold text-yellow-600" >ดาวเคราะห์แก๊ส</p>
                    <p className="mx-14 mt-4 text-xl">
                    ดาวเสาร์ (Saturn) เป็นดาวเคราะห์ที่รู้จักกันมาตั้งแต่ก่อนยุคประวัติศาสตร์ กาลิเลโอสังเกตดาวเสาร์ด้วยกล้องโทรทรรศน์เป็นครั้งแรกเมื่อปี พ.ศ. 2153  
                    เขามองเห็นดาวเสาร์มีลักษณะเป็นวงรี จนกระทั่งปี พ.ศ.2202 คริสเตียน ฮอยเกนส์ พบว่าวงรีที่กาลิเลโอเห็นนั้นคือวงแหวนของดาวเสาร์  
                    เป็นที่เชื่อกันว่าดาวเสาร์เป็นดาวเคราะห์เพียงดวงเดียวของระบบสุริยะที่มีวงแหวน จนกระทั่งต่อมาได้มีการส่งยานอวกาศไปค้นพบวงแหวนบางๆ 
                    รอบดาวพฤหัสบดี ดาวยูเรนัส และดาวเนปจูน ดาวเสาร์ถูกสำรวจโดยยานไพโอเนียร์ 11 ในปี พ.ศ.2522 ตามด้วยยานวอยเอเจอร์ 1 
                    ยานวอยเอเจอร์ 2 และยานแคสสินีในปี พ.ศ.2547</p>

                    <p className="mx-14 mt-4 text-2xl font-bold text-yellow-600" >องค์ประกอบหลักของบรรยากาศ</p>
                    <p className="mx-14 mt-2 text-xl">บรรยากาศของดาวเสาร์เป็น ไฮโดรเจน 75% ฮีเลียม 25% ปะปนไปด้วยน้ำ มีเทน แอมโมเนีย จำนวนเล็กน้อย</p>

                    <p className="mx-14 mt-4 text-2xl font-bold text-yellow-600" >วงแหวน</p>
                    <p className="mx-14 mt-2 text-xl">วงแหวนของดาวเสาร์ส่วนใหญ่ประกอบด้วยน้ำแข็ง ปะปนอยู่กับเศษหินเคลือบน้ำแข็ง วงแหวนของดาวเสาร์บางมาก แม้จะมีขนาดเส้นผ่านศูนย์กลางยาวถึง 250,000 กิโลเมตร แต่มีความหนาไม่ถึง 1.5 กิโลเมตร วงแหวนแต่ละชั้นมีชื่อเรียกตามอักษรภาษาอังกฤษ เช่น วงแหวนสว่าง (A และ B) และวงสลัว (C) ช่องระหว่างวงแหวน A และ B เรียกว่า ช่องแคสสินี (Cassini division )</p>

                    <p className="mx-14 mt-4 text-2xl font-bold text-yellow-600" >ข้อมูลเชิงตัวเลข</p>
                    <p className="mx-14 mt-2 text-xl">ระยะทางเฉลี่ยจากดวงอาทิตย์ 1,427 ล้านกิโลเมตร</p>
                    <p className="mx-14 mt-2 text-xl">มวล 95.162 เท่าของมวลโลก</p>
                    <p className="mx-14 mt-2 text-xl">แรงโน้มถ่วง 7.2 เมตร/วินาที²</p>
                    <p className="mx-14 mt-2 text-xl">เวลาในการหมุนรอบตัวเอง 10.66 ชั่วโมง</p>
                    <p className="mx-14 mt-2 text-xl">คาบวงโคจร 29.4 ปี</p>
                    <p className="mx-14 mt-2 text-xl">ดวงจันทร์ที่ค้นพบแล้ว 62 ดวง </p>
                    <p className="mx-14 mt-2 text-xl">วงแหวนที่ค้นพบแล้ว 7 วง</p>
                </div> : null}
        </div>
    )
}

export default Saturn;