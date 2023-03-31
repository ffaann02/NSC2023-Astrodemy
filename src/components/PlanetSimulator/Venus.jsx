import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Float32BufferAttribute } from 'three';

const Venus = (event) => {

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
        vec3 atmosphere = vec3(1.0, 0.7, 0.4) * pow(intensity, 1.5);

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
        gl_FragColor = vec4(1.0, 0.7, 0.4, 1.0) * intensity;
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

        // Venus mesh
        const venus = new THREE.Mesh(
            new THREE.SphereGeometry(6, 32, 32),
            new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    globeTexture: {
                        value: textureLoader.load('/assets/3d_page/texture/venus.jpg')
                    }
                }
            })
        );
        meshes_planet.push(venus);

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
        group.add(venus);
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
            venus.rotation.y += 0.002;
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
                    <p className="text-4xl font-bold mx-14 mt-14" >ดาวศุกร์ (Venus)</p>
                    <p className="mx-14 mt-2 text-2xl font-bold text-yellow-600" >ดาวเคราะห์หิน</p>
                    <p className="mx-14 mt-4 text-xl">
                    ดาวศุกร์ (Venus) อยู่ห่างจากดวงอาทิตย์เป็นลำดับที่ 2 เป็นดาวเคราะห์ที่มีขนาดใหญ่เป็นอันดับที่ 6 ไม่มีดวงจันทร์บริวาร 
                    ดาวศุกร์มีลักษณะที่คล้ายคลึงกับโลก จนได้ชื่อว่าเป็นดาวเคราะห์ฝาแฝดกับโลกของเรา โครงสร้างภายในของดาวศุกร์ ประกอบด้วย 
                    แกนกลางที่เป็นเหล็กมีรัศมีประมาณ 3,000 กิโลเมตร ห่อหุ้มด้วยชั้นแมนเทิลที่มีความหนาประมาณ 3,000 กิโลเมตร 
                    และเปลือกแข็งที่ประกอบด้วยหินซิลิเกต </p>

                    <p className="mx-14 mt-4 text-2xl font-bold text-yellow-600" >ชั้นบรรยากาศ</p>
                    <p className="mx-14 mt-2 text-xl">ชั้นบรรยากาศของดาวศุกร์นั้นมีความหนาแน่นมาก ความกดอากาศบนพื้นผิวดาวศุกร์สูงกว่าความกดอากาศบนพื้นผิวโลก 90 เท่า หรือมีค่าเท่ากับความดันที่ใต้ทะเลลึก 1 กิโลเมตร  บรรยากาศของดาวศุกร์ประกอบไปด้วยแก๊สคาร์บอนไดออกไซด์เป็นส่วนใหญ่ และมีชั้นเมฆอยู่หลายชั้นที่ประกอบไปด้วยแก๊สซัลเฟอร์ไดออกไซด์ (กรดกำมะถัน) ซึ่งมีความหนาหลายกิโลเมตร ทำให้เราไม่สามารถมองเห็นพื้นผิวดาวศุกร์ ชั้นบรรยากาศที่หนาทึบทำให้เกิดสภาวะเรือนกระจกกักเก็บความร้อนไว้ ทำให้อุณหภูมิพื้นผิวสูงถึง 470°C  จะเห็นได้ว่าพื้นผิวดาวศุกร์ร้อนกว่าพื้นผิวดาวพุธมาก ทั้งๆ ที่อยู่ไกลจากดวงอาทิตย์กว่าดาวพุธถึงสองเท่าก็ตาม </p>

                    <p className="mx-14 mt-4 text-2xl font-bold text-yellow-600" >ข้อมูลเชิงตัวเลข</p>
                    <p className="mx-14 mt-2 text-xl">ระยะทางเฉลี่ยจากดวงอาทิตย์ 108.21 ล้านกิโลเมตร</p>
                    <p className="mx-14 mt-2 text-xl">มวล 0.815 เท่าของมวลโลก</p>
                    <p className="mx-14 mt-2 text-xl">แรงโน้มถ่วง 8.87 ม./วินาที² </p>
                    <p className="mx-14 mt-2 text-xl">เวลาในการหมุนรอบตัวเอง 243.02 วัน</p>
                    <p className="mx-14 mt-2 text-xl">คาบวงโคจร 224.70 วัน</p>
                    <p className="mx-14 mt-2 text-xl">ไม่มีดวงจันทร์​ ไม่มีวงแหวน </p>
                </div> : null}
        </div>
    )
}

export default Venus;