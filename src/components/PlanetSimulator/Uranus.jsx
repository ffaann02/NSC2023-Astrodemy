import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Float32BufferAttribute } from 'three';

const Uranus = (event) => {

    const [isHover, setIsHover] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    const canvasRef = useRef();
    const cameraRef = useRef();
    const planetRef = useRef();
    const shaderRef = useRef();
    const ringRef = useRef();
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
        vec3 atmosphere = vec3(0.3, 0.6, 0.7) * pow(intensity, 1.5);

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
        gl_FragColor = vec4(0.3, 0.6, 0.7, 1.0) * intensity;
    }
    `;

    //     const ringVertex =
    //         `
    //     varying vec2 vertexRingUV;
    //     varying vec3 vertexRingNormal;

    //     void main() {
    //         vertexRingUV = uv;
    //         vertexRingNormal = normalize(normalMatrix * normal) * -1.0;;

    //         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //     }
    //   `;

    //     const ringFragment =
    //         `
    //     uniform sampler2D ringTexture;
    //     varying vec2 vertexRingUV;
    //     varying vec3 vertexRingNormal;

    //     void main() {
    //         vec4 textureColor = texture2D(ringTexture, vertexRingUV);
    //         if (textureColor.a == 0.0) {
    //             discard; // discard fragments with 0 alpha
    //         }
    //         float intensity = 0.8 - dot(vertexRingNormal, vec3(0.0, 0.0, 1.0));
    //         vec3 atmosphere = vec3(0.3, 0.6, 0.7) * pow(intensity, 1.5);
    //         gl_FragColor = vec4(atmosphere + textureColor.rgb, textureColor.a);
    //   }
    //   `;

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
        vec4 textureColor = texture2D(ringTexture, vertexRingUV);
        float intensity = 0.6 - dot(vertexRingNormal, vec3(0.0, 0.0, 1.0));
        vec3 atmosphere = vec3(0.3, 0.6, 0.7) * pow(intensity, 1.5);
    
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

        // Uranus mesh
        const uranus = new THREE.Mesh(
            new THREE.SphereGeometry(6, 32, 32),
            new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    globeTexture: {
                        value: textureLoader.load('/assets/3d_page/texture/uranus.jpg')
                    }
                },
                transparent: true
            })
        );
        meshes_planet.push(uranus);

        // Ring mesh
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(7, 8.5, 32),
            new THREE.ShaderMaterial({
                vertexShader: ringVertex,
                fragmentShader: ringFragment,
                uniforms: {
                    ringTexture: {
                        value: textureLoader.load('/assets/3d_page/texture/uranus ring.png')
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
        group.add(uranus);
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
            uranus.rotation.y += 0.002;
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
                    <p className="text-4xl font-bold mx-14 mt-14" >ยูเรนัส (Uranus)</p>
                    <p className="mx-14 mt-2 text-2xl font-bold text-yellow-600" >ดาวเคราะห์แก๊ส</p>
                    <p className="mx-14 mt-4 text-xl">
                    ยูเรนัส (Uranus) ถูกค้นพบครั้งแรกโดย วิลเลี่ยม เฮอส์เชล ในปี พ.ศ.2534  สองร้อยปีต่อมา ยานวอยเอเจอร์ 2 
                    ทำการสำรวจดาวยูเรนัสในปี พ.ศ. 2529 พบว่า
                    ดาวยูเรนัสมีสีฟ้าเนื่องจากแก๊สมีเทนดูดกลืนสีแดงและสะท้อนสีน้ำเงิน บรรยากาศมีลมพัดแรงมาก ลึกลงไปที่แก่นของดาวห่อหุ้มด้วยโลหะไฮโดรเจนเหลว  
                    ขณะที่ดาวเคราะห์ส่วนใหญ่มีแกนหมุนรอบตัวเองเกือบตั้งฉากกับระนาบสุริยวิถี แต่แกนของดาวยูเรนัสวางตัวเกือบขนานกับสุริยวิถี 
                    ดังนั้นอุณหภูมิบริเวณขั้วดาวจึงสูงกว่าบริเวณเส้นศูนย์สูตร</p>

                    <p className="mx-14 mt-4 text-2xl font-bold text-yellow-600" >องค์ประกอบหลักของบรรยากาศ</p>
                    <p className="mx-14 mt-2 text-xl">บรรยากาศของดาวยูเรนัสประกอบด้วยไฮโดรเจน 83%, ฮีเลียม 15% และมีเทน 2% ดาวยูเรนัสมีสีฟ้าเนื่องจากแก๊สมีเทนดูดกลืนสีแดงและสะท้อนสีน้ำเงิน บรรยากาศมีลมพัดแรงมาก ลึกลงไปที่แก่นของดาวห่อหุ้มด้วยโลหะไฮโดรเจนเหลว</p>

                    <p className="mx-14 mt-4 text-2xl font-bold text-yellow-600" >วงแหวนและดวงจันทร์บริวาร</p>
                    <p className="mx-14 mt-2 text-xl">ดาวยูเรนัสมีวงแหวนเช่นเดียวกับดาวเคราะห์ชั้นนอกดวงอื่นๆ วงแหวนของดาวยูเรนัสมีความสว่างไม่มาก เนื่องจากประกอบด้วยอนุภาคขนาดเล็ก มีขนาดตั้งแต่ฝุ่นผงจนถึง 10 เมตร  ดาวยูเรนัสมีดวงจันทร์บริวารอย่างน้อย 27 ดวง ดวงจันทร์ขนาดใหญ่ที่มีรูปร่างเป็นทรงกลม ได้แก่ มิรันดา แอเรียล อัมเบรียล ไททาเนีย และ โอเบรอน</p>

                    <p className="mx-14 mt-4 text-2xl font-bold text-yellow-600" >ข้อมูลเชิงตัวเลข</p>
                    <p className="mx-14 mt-2 text-xl">ระยะทางเฉลี่ยจากดวงอาทิตย์ 2,870 ล้านกิโลเมตร</p>
                    <p className="mx-14 mt-2 text-xl">มวล 14.536 เท่าของมวลโลก </p>
                    <p className="mx-14 mt-2 text-xl">แรงโน้มถ่วง 8.43 เมตร/วินาที² </p>
                    <p className="mx-14 mt-2 text-xl">เวลาในการหมุนรอบตัวเอง 17.24 ชั่วโมง</p>
                    <p className="mx-14 mt-2 text-xl">คาบวงโคจร 80 ปี</p>
                    <p className="mx-14 mt-2 text-xl">ดวงจันทร์ที่ค้นพบแล้ว 27 ดวง</p>
                    <p className="mx-14 mt-2 text-xl">วงแหวนที่ค้นพบแล้ว 13 วง</p>
                </div> : null}
        </div>
    )
}

export default Uranus;