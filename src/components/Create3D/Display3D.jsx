import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as THREE from 'three';
import gsap from 'gsap';

const Display3D = () => {

  const { title } = useParams();
  const [rawData, setRawData] = useState(null);
  const [rawDataLoaded, setRawDataLoaded] = useState(false);
  const [formatedData, setFormatedData] = useState(null);
  const [formatedDataLoaded, setFormatedDataLoaded] = useState(false);

  const canvasRef = useRef();
  const cameraRef = useRef();
  const renderRef = useRef();

  const [rangeValues, setRangeValues] = useState(null);
  const [cameraPosValue, setCameraPosValue] = useState([]);

  const allObjectRef = useRef();
  const allRotateSpeedRef = useRef();

  const [infoLeft, setInfoLeft] = useState();
  let array_infoLeft = [];

  const convertColor = (color) => {
    // Remove '#' from the color string
    const colorWithoutHash = color.replace("#", "");
    // Add '0x' prefix to the color string
    const convertedColor = parseInt("0x" + colorWithoutHash);
    return convertedColor;
  };

  // Fetch Raw Data
  useEffect(() => {
    console.log(title);
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/3d_data?title=${title}`);
        setRawData(response.data);
        console.log(response.data);
        setRawDataLoaded(true);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);


  // Process rawData to formatedData
  useEffect(() => {
    const splitString = async (concatString) => {
      let splited_jsonFormat;
      let [name, shape, size, texture, hadRotate, rotateSpeed, hadRing, ringInnerRadius,
        ringOuterRadius, ringTexture, hadDetail, detail, color_1, color_2, color_3] = await concatString.split("@");
      if (hadRotate === 'false' || shape === 'Nebula') {
        rotateSpeed = 0;
      }
      splited_jsonFormat = {
        name: name,
        shape: shape,
        size: parseInt(size),
        texture: texture,
        hadRotate: hadRotate,
        rotateSpeed: parseFloat(rotateSpeed),
        hadRing: hadRing,
        ringInnerRadius: parseInt(ringInnerRadius),
        ringOuterRadius: parseInt(ringOuterRadius),
        ringTexture: ringTexture,
        hadDetail: hadDetail,
        detail: detail,
        color_1: color_1,
        color_2: color_2,
        color_3: color_3
      }
      return splited_jsonFormat;
    }
    const formatData = async () => {
      if (rawData) {
        const data3D_modelOnly = [rawData.model_1, rawData.model_2, rawData.model_3, rawData.model_4, rawData.model_5, rawData.model_6]
        const formated_data = [];

        // Delete empty model data
        for (let i = rawData.modelAmount; i <= 6; i++) {
          delete data3D_modelOnly[i];
        }

        // Split and format to json from
        for (let i = 0; i < rawData.modelAmount; i++) {
          formated_data.push(await splitString(data3D_modelOnly[i]));
          setCameraPosValue(cameraPosValue => [...cameraPosValue, [(i + 1) * 300, 0, 24]]);
        }

        // Store only info
        for (let i = 0; i < rawData.modelAmount; i++) {
          array_infoLeft.push(formated_data[i].detail);
        }

        setRangeValues(Array.apply(null, Array(rawData.modelAmount)).map(function (y, i) { return i + 1; }));
        setFormatedData(formated_data);
        setFormatedDataLoaded(true);
      }
    }
    formatData();
  }, [rawDataLoaded]);


  // Create 3D models
  useEffect(() => {
    if (formatedData) {
      console.log(formatedData);

      const canvas = canvasRef.current;
      const textureLoader = new THREE.TextureLoader();

      // Create the scene
      const scene = new THREE.Scene();

      // Camera and Renderer
      const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      cameraRef.current = camera;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      camera.position.set(300, 0, 24);
      // renderer.setPixelRatio(window.devicePixelRatio);
      // Responsive Render
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderRef.current = renderer;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      // Light
      const ambientLight = new THREE.AmbientLight(0x333333, 4);
      scene.add(ambientLight);

      // Object for store all model
      const ALL_MODEL_MESH = [];
      const ALL_MODEL_SPEED = [];

      // Loop for create each model
      for (let i = 0; i < rawData.modelAmount; i++) {
        const shape = formatedData[i].shape;
        const hadRotate = formatedData[i].hadRotate;
        const hadRing = formatedData[i].hadRing;
        const rotateSpeed = formatedData[i].rotateSpeed;

        const xPos = (i + 1) * 300;

        // Sphere
        if (shape === 'Sphere') {
          const sphereGeometry = new THREE.SphereGeometry(formatedData[i].size, 32, 32);
          const sphereMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load(formatedData[i].texture) });
          const sphereObject = new THREE.Mesh(sphereGeometry, sphereMaterial);
          sphereObject.position.set(xPos, 0, 0);
          scene.add(sphereObject);
          // Push mesh to ALL_MODEL_MESH (for useRef)
          ALL_MODEL_MESH.push(sphereObject);
          ALL_MODEL_SPEED.push(rotateSpeed);
          // Ring
          if (hadRing === 'true') {
            const ringGeometry = new THREE.RingGeometry(formatedData[i].ringInnerRadius, formatedData[i].ringOuterRadius, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
              map: textureLoader.load(formatedData[i].ringTexture),
              side: THREE.DoubleSide,
            })
            const ringObject = new THREE.Mesh(ringGeometry, ringMaterial);
            ringObject.position.set(xPos, 0, 0);
            ringObject.rotation.x = -0.5 * 2.9;
            scene.add(ringObject);
          }
        }
        // Nebula
        else if (shape === 'Nebula') {
          let cloundAddSize = formatedData[i].size / 5;
          let cloundParticles = [];
          for (let p = 0; p < 30; p++) {
            let cloud = new THREE.Mesh(
              new THREE.PlaneGeometry(50, 25, 25),
              new THREE.MeshLambertMaterial({
                map: textureLoader.load('/assets/3d_page/texture/smoke.png'),
                transparent: true,
              }));
            cloud.position.set(
              xPos,
              0,
              Math.random() * 100 - 100
            );
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.scale.set(1 + cloundAddSize, 1 + cloundAddSize, 1 + cloundAddSize);
            cloud.material.opacity = 0.4;
            cloundParticles.push(cloud);
            scene.add(cloud);
          }
          // Add color light
          const light_1 = new THREE.PointLight(convertColor(formatedData[i].color_1), 2, 100);
          light_1.position.set(xPos, 0, 40);
          scene.add(light_1);
          const light_2 = new THREE.PointLight(convertColor(formatedData[i].color_2), 2, 100);
          light_2.position.set(xPos, 0, 0);
          scene.add(light_2);
          const light_3 = new THREE.PointLight(convertColor(formatedData[i].color_3), 2, 100, 100);
          light_3.position.set(xPos, 0, 60);
          scene.add(light_3);
        }
        // Box
        else if (shape === 'Box') {
          const boxGeometry = new THREE.BoxGeometry(formatedData[i].size, formatedData[i].size, formatedData[i].size);
          const boxMaterial = new THREE.MeshStandardMaterial({
            map: textureLoader.load(formatedData[i].texture)
          })
          const boxObject = new THREE.Mesh(boxGeometry, boxMaterial);
          boxObject.position.set(xPos, 0, 0);
          scene.add(boxObject);
          // Push mesh to ALL_MODEL_MESH (for useRef)
          ALL_MODEL_MESH.push(boxObject);
          ALL_MODEL_SPEED.push(rotateSpeed);
          // Ring
          if (hadRing === 'true') {
            const ringGeometry = new THREE.RingGeometry(formatedData[i].ringInnerRadius, formatedData[i].ringOuterRadius, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
              map: textureLoader.load(formatedData[i].ringTexture),
              side: THREE.DoubleSide,
            })
            const ringObject = new THREE.Mesh(ringGeometry, ringMaterial);
            ringObject.position.set(xPos, 0, 0);
            ringObject.rotation.x = -0.5 * 2.9;
            scene.add(ringObject);
          }
        }
      }

      // useRef = array
      allObjectRef.current = ALL_MODEL_MESH;
      allRotateSpeedRef.current = ALL_MODEL_SPEED;

      const arrayRotate = (Array.apply(null, Array(allObjectRef.current.length)).map(function (y, i) { return i; }));

      const animate = function () {
        requestAnimationFrame(animate);
        arrayRotate.forEach(i => allObjectRef.current[i].rotateY(allRotateSpeedRef.current[i]));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, cameraRef.current);
      }

      animate();

    }
  }, [formatedDataLoaded]);

  window.addEventListener('resize', function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderRef.current.setSize(width, height);
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
  });

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
      {rawData &&
        <div className='w-full absolute flex mt-6'>
          <p className='mx-auto text-white font-ibm-thai text-2xl'>{rawData.title}</p>
        </div>}
      {formatedData &&
        <div>
          <canvas id="space" alt="space" ref={canvasRef} />

          <div className="absolute w-full bottom-32">
            <div className={`mx-auto max-w-4xl grid grid-cols-${rawData.modelAmount} w-full font-ibm-thai text-white`}>
              {[...Array(rawData.modelAmount)].map((_, index) => (
                <div className={`col-span-1 
                  ${index === 0 ? "text-left" : null}
                  ${(index !== 0) && (index + 1 !== rawData.modelAmount) ? "text-center" : null}
                  ${index + 1 === rawData.modelAmount ? "text-right" : null}`} key={index}>
                  <p>{formatedData[index].name}</p>
                </div>
              ))}
            </div>
            <div className={`max-w-4xl top-5 grid grid-cols-${rawData.modelAmount} h-fit text-white mx-auto font-ibm-thai cursor-pointer`}>
              <input type="range" className={`col-span-${rawData.modelAmount} w-full h-4 appearance-none rounded-full bg-white outline-none`} min={0} max={rangeValues.length - 1} step={1}
                defaultValue={0} onChange={handleRangeChange} />
            </div>
          </div>
        </div>}
    </div>
  )

}

export default Display3D;