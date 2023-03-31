import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Float32BufferAttribute } from 'three';

const Sun = () => {

    const [isHover, setIsHover] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    const canvasRef = useRef();
    const cameraRef = useRef();
    const planetRef = useRef();
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
        vec3 atmosphere = vec3(1.0, 0.0, 0.0) * pow(intensity, 1.5);

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
        float intensity = pow(0.75 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
        gl_FragColor = vec4(1.0, 0.25, 0.0, 1.0) * intensity;
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

        // Sun mesh
        const sun = new THREE.Mesh(
            new THREE.SphereGeometry(6, 32, 32),
            new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    globeTexture: {
                        value: textureLoader.load('/assets/3d_page/texture/sun.jpg')
                    }
                }
            })
        );
        meshes_planet.push(sun);

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
        group.add(sun);
        scene.add(group);

        planetRef.current = group;
        shaderRef.current = atmosphere;

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
            sun.rotation.y += 0.002;
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
               bg-gradient-to-b from-zinc-800 w-1/2 h-full right-0
               overflow-auto overflow-y-scroll scrollbar-thin scrollbar-thumb-transparent pb-14" >
                    <p className="text-4xl font-bold mx-14 mt-14" >ดวงอาทิตย์ (The Sun)</p>
                    <p className="mx-14 mt-2 text-2xl font-bold text-yellow-600" >ดาวฤกษ์</p>
                    <p className="mx-14 mt-4 text-xl">
                        ดวงอาทิตย์ (The Sun) คือดาวฤกษ์ที่อยู่ตรงศูนย์กลางของระบบสุริยะ มีขนาดเส้นผ่านศูนย์กลาง 1.4 ล้านกิโลเมตร 
                        หรือ 109 เท่าของเส้นผ่านศูนย์กลางโลก อยู่ห่างจากโลก 149,600,000 กิโลเมตร หรือ 1 หน่วยดาราศาสตร์ (AU)  
                        ดวงอาทิตย์มีมวลมากกว่าโลก 333,000 เท่า แต่มีความหนาแน่นเพียง 0.25 เท่าของโลก เนื่องจากมีองค์ประกอบเป็นไฮโดรเจน 74% 
                        ฮีเลียม 25% และธาตุชนิดอื่น 1%"</p>

                    <p className="mx-14 mt-4 text-2xl font-bold text-yellow-600" >พื้นผิวของดวงอาทิตย์</p>
                    <p className="mx-14 mt-2 text-xl">พื้นผิวของดวงอาทิตย์เต็มไปด้วยแก๊สร้อนซึ่งประทุอยู่ตลอดเวลา เมื่อแก๊สร้อนบนดวงอาทิตย์พุ่งตัวสูงเหนือชั้นโครโมสเฟียร์ขึ้นมาหลายหมื่นกิโลเมตร  "พวยแก๊ส" (Prominences) จะเคลื่อนที่เข้าสู่อวกาศด้วยความเร็ว 1,000 กิโลเมตร/วินาที หรือ 3.6 ล้านกิโลเมตรต่อชั่วโมง  ในบางครั้งมีการระเบิดใหญ่กว่าเรียกว่า การลุกจ้า (Solar flare) ทำให้เกิดกลุ่มอนุภาคพลังงานสูงเรียกว่า "พายุสุริยะ" (Solar storm) ซึ่งสามารถสร้างความเสียหายให้แก่ดาวเทียมและยานอวกาศ</p>

                    <p className="mx-14 mt-4 text-2xl font-bold text-yellow-600" >โครงสร้างภายในของดวงอาทิตย์</p>
                    <ul>
                        <li className="mx-14 mt-2 text-xl"><b>แก่นปฏิกรณ์นิวเคลียร์ (Fusion core) </b>
                        อยู่ที่ใจกลางของดวงอาทิตย์ถึงระยะ 25% ของรัศมี แรงโน้มถ่วงของดวงอาทิตย์ทำให้มวลสารของดาวกดทับกันจนอุณหภูมิที่ใจกลางสูงถึง 15 ล้านเคลวิน จุดปฏิกิริยานิวเคลียร์ฟิวชันหลอมอะตอมของไฮโดรเจนให้กลายเป็นฮีเลียม และปลดปล่อยพลังงานออกมา </li>
                        <li className="mx-14 mt-2 text-xl"><b>โซนการแผ่รังสี (Radiative zone) </b>
                        อยู่ที่ระยะ 25 - 70% ของรัศมี พลังงานที่เกิดขึ้นจากแก่นปฏิกรณ์นิวเคลียร์ถูกนำขึ้นสู่ชั้นบนโดยการแผ่รังสีด้วยอนุภาคโฟตอน  </li>
                        <li className="mx-14 mt-2 text-xl"><b>โซนการพาความร้อน (Convection zone) </b>
                        อยู่ที่ระยะ 70 - 100% ของรัศมี พลังงานที่เกิดขึ้นไม่สามารถแผ่สู่อวกาศได้โดยตรง เนื่องจากมวลของดวงอาทิตย์เต็มไปด้วยแก๊สไฮโดรเจนซึ่งเคลื่อนที่หมุนวนด้วยกระบวนการพาความร้อน  </li>
                    </ul>

                    <p className="mx-14 mt-4 text-2xl font-bold text-yellow-600" >ข้อมูลเชิงตัวเลข</p>
                    <p className="mx-14 mt-2 text-xl">ขนาดของเส้นรอบวง 4,379,000 กม.</p>
                    <p className="mx-14 mt-2 text-xl">ปริมาตรของดาว 1,300,000 เท่าของโลก</p>
                    <p className="mx-14 mt-2 text-xl">มวลของดาว 333,000 เท่าของโลก</p>
                    <p className="mx-14 mt-2 text-xl">ค่าแรงโน้มถ่วงบนดาว 274 ม./วินาที² </p>
                </div> : null}
        </div>
    )
}

export default Sun;