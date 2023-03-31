import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Float32BufferAttribute } from 'three';

const Mars = (event) => {

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
        vec3 atmosphere = vec3(0.9, 0.6, 0.6) * pow(intensity, 1.5);

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
        gl_FragColor = vec4(0.9, 0.6, 0.6, 1.0) * intensity;
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

        // Mars mesh
        const mars = new THREE.Mesh(
            new THREE.SphereGeometry(6, 32, 32),
            new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    globeTexture: {
                        value: textureLoader.load('/assets/3d_page/texture/mars.jpg')
                    }
                }
            })
        );
        meshes_planet.push(mars);

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
        group.add(mars);
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
            mars.rotation.y += 0.002;
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
               bg-gradient-to-b from-zinc-800 w-1/2 h-full right-0" >
                    <p className="text-4xl font-bold mx-14 mt-14" >ดาวอังคาร (Mars)</p>
                    <p className="mx-14 mt-2 text-2xl font-bold text-yellow-600" >ดาวเคราะห์หิน</p>
                    <p className="mx-14 mt-4 text-xl">
                    ดาวอังคาร(Mars) เป็นดาวเคราะห์ที่อยู่ห่างจากดวงอาทิตย์เป็นอันดับที่ 4 ในบรรดาดาวเคราะห์ทั้งหมด 
                    ดาวอังคารมีขนาดเส้นผ่านศูนย์กลางประมาณ 0.5 เท่าของโลก  ดาวอังคารมีโครงสร้างภายในประกอบด้วยแก่นของแข็งมีรัศมีประมาณ 
                    1,700 กิโลเมตร ห่อหุ้มด้วยชั้นแมนเทิลที่เป็นหินหนืดหนาประมาณ 1,600 กิโลเมตร และมีเปลือกแข็งเช่นเดียวกับโลก   
                    ดาวอังคารมีสีแดงเนื่องจากพื้นผิวประกอบด้วยออกไซด์ของเหล็ก (สนิมเหล็ก)  พื้นผิวของดาวอังคารเต็มไปด้วยหุบเหวต่างๆ มากมาย 
                    หุบเหวขนาดใหญ่ชื่อ หุบเหวมาริเนอริส (Valles Marineris) มีความยาว 4,000 กิโลเมตร กว้าง 600 กิโลเมตร ลึก 8 กิโลเมตร  
                    นอกจากนี้ดาวอังคารยังมีภูเขาไฟที่สูงที่สุดในระบบสุริยะชื่อ ภูเขาไฟโอลิมปัส (Mount Olympus) สูง 25 กิโลเมตร  
                    ฐานที่แผ่ออกไปมีรัศมี 300 กิโลเมตร </p>

                    <p className="mx-14 mt-4 text-2xl font-bold text-yellow-600" >องค์ประกอบหลักของบรรยากาศ</p>
                    <p className="mx-14 mt-2 text-xl">ดาวอังคารมีบรรยากาศเบาบางมาก ประกอบด้วยคาร์บอนไดออกไซด์เป็นส่วนใหญ่ซึ่งเกิดจากการระเหิดของน้ำแข็งแห้ง (คาร์บอนไดออกไซด์แข็ง) ปกคลุมอยู่ทั่วไปบนพื้นผิวดาวอังคาร  ที่บริเวณขั้วเหนือและขั้วใต้ของดาวมีน้ำแข็ง (Ice water) ปกคลุมอยู่ตลอดเวลา</p>

                    <p className="mx-14 mt-4 text-2xl font-bold text-yellow-600" >ดวงจันทร์บริวาร</p>
                    <p className="mx-14 mt-2 text-xl"> ดาวอังคารมีดวงจันทร์บริวารขนาดเล็ก 2 ดวง คือ โฟบัสและดีมอส ดวงจันทร์ทั้งสองดวงมีรูปร่างไม่สมมาตร และมีขนาดเล็กกว่า 25 กิโลเมตร  สันนิษฐานว่าเป็นดาวเคราะห์น้อยที่ถูกแรงโน้มถ่วงของดาวอังคารดูดจับมาเป็นบริวาร ภายหลังการก่อตัวของระบบสุริยะ</p>

                    <p className="mx-14 mt-4 text-2xl font-bold text-yellow-600" >ข้อมูลเชิงตัวเลข</p>
                    <p className="mx-14 mt-2 text-xl">ระยะทางเฉลี่ยจากดวงอาทิตย์ 227.94 ล้านกิโลเมตร</p>
                    <p className="mx-14 mt-2 text-xl">มวล 0.107 เท่าของมวลโลก</p>
                    <p className="mx-14 mt-2 text-xl">แรงโน้มถ่วง 3.721 ม./วินาที²</p>
                    <p className="mx-14 mt-2 text-xl">เวลาในการหมุนรอบตัวเอง 24.62 วัน</p>
                    <p className="mx-14 mt-2 text-xl">คาบวงโคจร 1.88 ปี (687 วัน) </p>
                    <p className="mx-14 mt-2 text-xl">มีดวงจันทร์ 2 ดวง ​ ไม่มีวงแหวน </p>
                </div> : null}
        </div>
    )
}

export default Mars;