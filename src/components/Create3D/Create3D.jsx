import { useState, useRef, useEffect, useContext } from "react"
import { UserContext } from '../../App';
import { useNavigate } from "react-router-dom";
import { AiFillMinusSquare, AiFillPlusSquare } from "react-icons/ai"
import * as THREE from 'three';
import { HuePicker } from 'react-color';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios';

const Create3D = (event) => {

    const { userData, logged, setLogged, setUserData, userId } = useContext(UserContext)

    const [modelAmount, setmodelAmount] = useState(1);

    // 3D Title
    const [title, setTitle] = useState();

    // Model Name
    const [name, setName] = useState(['']);

    // Shape (Done)
    const [shape, setShape] = useState(['Sphere']);
    const modelShapeRef = useRef(shape);

    // Size (Done)
    const [size, setSize] = useState([1]);
    const modelSizeRef = useRef([1]);

    // Texture (Done)
    const [texture, setTexture] = useState(['/assets/3d_page/texture/moon.jpg']);
    const modelTextureRef = useRef(['/assets/3d_page/texture/moon.jpg']);

    // Rotation (Done)
    const [hadRotate, setHadRotate] = useState([false]);
    const [rotateSpeed, setRotateSpeed] = useState([0.001]);
    const modelRotateSpeedRef = useRef([0]);

    // Ring (Done, but with some bugs)
    const [hadRing, setHadRing] = useState([false]);
    const modelHadRingRef = useRef([false]);
    const [ringInnerRadius, SetRingInnerRadius] = useState([5]);
    const modelRingInnerRadiusRef = useRef([5]);
    const [ringOuterRadius, SetRingOuterRadius] = useState([10]);
    const modelRingOuterRadiusRef = useRef([10]);
    const [ringTexture, setRingTexture] = useState(['/assets/3d_page/texture/saturn ring.png']);
    const modelRingTextureRef = useRef(['/assets/3d_page/texture/saturn ring.png']);


    const [hadDetail, setHadDetail] = useState([false]);
    const [detail, setDetail] = useState(['']);

    // Color Picker (For Nebula)
    const [color_1, setColor_1] = useState(['#d8547e']);
    const modelNebula_Color1_Ref = useRef(['#d8547e']);
    const [color_2, setColor_2] = useState(['#cc6600']);
    const modelNebula_Color2_Ref = useRef(['#cc6600']);
    const [color_3, setColor_3] = useState(['#3677ac']);
    const modelNebula_Color3_Ref = useRef(['#3677ac']);

    const canvasRef = useRef([]);
    const cameraRef = useRef([]);

    // useEffect focus on model index that updated value
    const [focusOnRefIndex, setFocusOnRefIndex] = useState(0);

    // Preview Cover Image
    const [previewImage, setPreviewImage] = useState("");
    const [hover, setHover] = useState(false);

    const navigate = useNavigate();
    const sweetAlert = withReactContent(Swal)
    const showAlert = (title, html, icon, path) => {
        sweetAlert.fire({
            title: <strong>{title}</strong>,
            html: <i>{html}</i>,
            icon: icon,
            confirmButtonText: 'ตกลง'
        })
            .then(() => {
                navigate(path);
            });
    }

    useEffect(() => {
        const canvas = canvasRef.current[focusOnRefIndex];
        const textureLoader = new THREE.TextureLoader();

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
        cameraRef.current = camera
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        camera.position.set(0, 0, 24);

        // Light
        const ambientLight = new THREE.AmbientLight(0x333333, 5);
        scene.add(ambientLight);

        // Object Parent
        const object = new THREE.Object3D();
        scene.add(object);

        // Texture
        let texture = modelTextureRef.current[focusOnRefIndex];

        if (modelShapeRef.current[focusOnRefIndex] === 'Sphere') {
            // Create Sphere object
            const sphereGeometry = new THREE.SphereGeometry(modelSizeRef.current[focusOnRefIndex], 32, 32);
            const sphereMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load(texture) });
            const sphereObject = new THREE.Mesh(sphereGeometry, sphereMaterial);
            object.add(sphereObject);
        }
        else if (modelShapeRef.current[focusOnRefIndex] === 'Box') {
            //Create Box object
            const boxGeometry = new THREE.BoxGeometry(modelSizeRef.current[focusOnRefIndex], modelSizeRef.current[focusOnRefIndex], modelSizeRef.current[focusOnRefIndex]);
            const boxMaterial = new THREE.MeshStandardMaterial({
                map: textureLoader.load(texture)
            })
            const boxObject = new THREE.Mesh(boxGeometry, boxMaterial);
            object.add(boxObject);
        }
        else if (modelShapeRef.current[focusOnRefIndex] === 'Nebula') {
            let cloundAddSize = modelSizeRef.current[focusOnRefIndex] / 5;
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
                cloud.scale.set(1 + cloundAddSize, 1 + cloundAddSize, 1 + cloundAddSize);
                cloud.material.opacity = 0.4;
                cloundParticles.push(cloud);
                scene.add(cloud);
            }
            // Remove Original Light
            scene.remove(ambientLight);
            // Light color for Nebula
            const redLight = new THREE.PointLight(convertColor(modelNebula_Color1_Ref.current[focusOnRefIndex]), 2, 1000);
            // const redLight = new THREE.PointLight(0xd8547e, 2, 1000);
            redLight.position.set(-0, 0, 40);
            scene.add(redLight);

            const orangeLight = new THREE.PointLight(convertColor(modelNebula_Color2_Ref.current[focusOnRefIndex]), 2, 1000);
            orangeLight.position.set(-0, 0, 0);
            scene.add(orangeLight);
            const blueLight = new THREE.PointLight(convertColor(modelNebula_Color3_Ref.current[focusOnRefIndex]), 2, 100, 1000);

            blueLight.position.set(-0, 0, 60);
            scene.add(blueLight);
        }

        // Condition for preview ring
        let ringOpacity = 0;
        if (modelHadRingRef.current[focusOnRefIndex] === true) {
            ringOpacity = 1;
        }
        else {
            ringOpacity = 0;
        }
        // console.log(modelHadRingRef.current[focusOnRefIndex] + " index " + focusOnRefIndex + " opacity " + ringOpacity);

        // Create ring object
        let ringTexture = modelRingTextureRef.current[focusOnRefIndex];
        const ringGeometry = new THREE.RingGeometry(modelRingInnerRadiusRef.current[focusOnRefIndex], modelRingOuterRadiusRef.current[focusOnRefIndex], 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ringTexture),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: ringOpacity
        })
        const ringObject = new THREE.Mesh(ringGeometry, ringMaterial);
        ringObject.rotation.x = -0.5 * 2.9
        scene.add(ringObject);

        const animate = function () {
            requestAnimationFrame(animate);
            object.rotateY(modelRotateSpeedRef.current[focusOnRefIndex]);
            renderer.render(scene, cameraRef.current);
        }
        animate();

    }, [shape, size, texture, rotateSpeed, hadRing, ringInnerRadius, ringOuterRadius, ringTexture, color_1, color_2, color_3, canvasRef.current])

    const handleCoverImageUpload = (event) => {
        const file = event.target.files[0];

        // Create a new FileReader instance
        const reader = new FileReader();

        // Set up the onload event for the FileReader
        reader.onload = () => {
            const img = new Image();

            // Set the src of the Image to the data URL of the uploaded file
            img.src = reader.result;
            console.log(reader.result);
            // Set the preview image and the image state
            setPreviewImage(reader.result);
        };

        // Read the uploaded file as a data URL
        reader.readAsDataURL(file);
    }

    function handleModelAmount(num) {
        const newAmount = modelAmount + num;
        if (num > 0) {
            setFocusOnRefIndex(modelAmount);
            setName(current => [...current, '']);
            setShape(current => [...current, 'Sphere']);
            setSize(current => [...current, 1]);
            setTexture(current => [...current, '/assets/3d_page/texture/moon.jpg']);
            setHadRotate(current => [...current, false]);
            setRotateSpeed(current => [...current, 0.001]);
            setHadRing(current => [...current, false]);
            SetRingInnerRadius(current => [...current, 5]);
            SetRingOuterRadius(current => [...current, 10]);
            setRingTexture(current => [...current, '/assets/3d_page/texture/saturn ring.png']);
            setHadDetail(current => [...current, false]);
            setDetail(current => [...current, '']);
            setColor_1(current => [...current, '#d8547e']);
            setColor_2(current => [...current, '#cc6600']);
            setColor_3(current => [...current, '#3677ac']);
            canvasRef.current.push(null);
            modelShapeRef.current.push('Sphere');
            modelSizeRef.current.push(1);
            modelTextureRef.current.push('/assets/3d_page/texture/moon.jpg');
            modelRotateSpeedRef.current.push(0);
            modelHadRingRef.current.push(false);
            modelRingInnerRadiusRef.current.push(5);
            modelRingOuterRadiusRef.current.push(10);
            modelRingTextureRef.current.push('/assets/3d_page/texture/saturn ring.png');
            modelNebula_Color1_Ref.current.push('#d8547e');
            modelNebula_Color2_Ref.current.push('#cc6600');
            modelNebula_Color3_Ref.current.push('#3677ac');
        }
        if (newAmount >= 1 && newAmount <= 6) {
            setmodelAmount(newAmount);
        }
    }

    const handleTitleName = (event) => {
        const title = event.target.value;
        setTitle(title);
    }

    const handleName = (event, modelNum) => {
        setFocusOnRefIndex(modelNum - 1);
        const newname = event.target.value;
        const newArray = [...name];
        newArray[focusOnRefIndex] = newname;
        setName(newArray);
        console.log(newArray[focusOnRefIndex]);
    }

    const handleShapeChange = (event, modelNum) => {
        setFocusOnRefIndex(modelNum - 1);
        const newShape = event.target.value;
        const newArray = [...shape];
        newArray[modelNum - 1] = newShape;
        setShape(newArray);
        modelShapeRef.current[focusOnRefIndex] = newShape;
    }

    function handleSizeChange(modelNum, num) {
        setFocusOnRefIndex(modelNum - 1);
        const newSize = size[modelNum - 1] + num;
        const newArray = [...size];
        if (newSize >= 1 && newSize <= 10) {
            newArray[modelNum - 1] = newSize;
            setSize(newArray);
            modelSizeRef.current[focusOnRefIndex] = newSize;
        }
    }

    const handleTextureUpload = (event, modelNum) => {
        setFocusOnRefIndex(modelNum - 1);
        const file = event.target.files[0];

        // Create a new FileReader instance
        const reader = new FileReader();

        // Set up the onload event for the FileReader
        reader.onload = () => {
            const img = new Image();

            // Set the src of the Image to the data URL of the uploaded file
            img.src = reader.result;

            const newArray = [...texture];
            newArray[focusOnRefIndex] = reader.result;
            setTexture(newArray);

            modelTextureRef.current[focusOnRefIndex] = reader.result;
        };

        // Read the uploaded file as a data URL
        reader.readAsDataURL(file);
    };

    const handleRingTextureUpload = (event, modelNum) => {
        setFocusOnRefIndex(modelNum - 1);
        const file = event.target.files[0];

        // Create a new FileReader instance
        const reader = new FileReader();

        // Set up the onload event for the FileReader
        reader.onload = () => {
            const img = new Image();

            // Set the src of the Image to the data URL of the uploaded file
            img.src = reader.result;

            const newArray = [...ringTexture];
            newArray[focusOnRefIndex] = reader.result;
            setRingTexture(newArray);

            modelRingTextureRef.current[focusOnRefIndex] = reader.result;
        };

        // Read the uploaded file as a data URL
        reader.readAsDataURL(file);
    };

    const handleCheckbox = (modelNum, setState, arrayState, arrayRef, arrayType) => {
        setFocusOnRefIndex(modelNum - 1);
        const newArray = [...arrayState];
        let status;
        if (newArray[modelNum - 1] === false) {
            newArray[modelNum - 1] = true;
            status = true;
        }
        else {
            newArray[modelNum - 1] = false;
            status = false;
        }
        if (arrayRef && arrayType && arrayType === 'boolean') {
            arrayRef.current[focusOnRefIndex] = status;
        }
        else if (arrayRef && arrayType && arrayType === 'integer' && status === false) {
            arrayRef.current[focusOnRefIndex] = 0;
        }
        else if (arrayRef && arrayType && arrayType === 'integer' && status === true) {
            arrayRef.current[focusOnRefIndex] = rangeValues[0];
        }
        setState(newArray);
    }

    const rangeValues = [0.001, 0.002, 0.004, 0.008, 0.016, 0.032, 0.064];
    const handleRangeChange = (event, modelNum) => {
        setFocusOnRefIndex(modelNum - 1);
        const step = event.target.value;
        const newRotateSpeed = [...rotateSpeed];
        newRotateSpeed[modelNum - 1] = rangeValues[step];
        setRotateSpeed(newRotateSpeed);
        modelRotateSpeedRef.current[focusOnRefIndex] = rangeValues[step];
    }

    function handleRingRadiusChange(modelNum, num, radius) {
        setFocusOnRefIndex(modelNum - 1);
        if (radius === 'Inner') {
            const newRadius = ringInnerRadius[focusOnRefIndex] + num;
            const newInnerArray = [...ringInnerRadius];
            if (newRadius >= 5 && newRadius <= 10) {
                newInnerArray[focusOnRefIndex] = newRadius;
                SetRingInnerRadius(newInnerArray);
                modelRingInnerRadiusRef.current[focusOnRefIndex] = newRadius;
            }
        }
        else {
            const newRadius = ringOuterRadius[focusOnRefIndex] + num;
            const newOuterArray = [...ringOuterRadius];
            if (newRadius >= 10 && newRadius <= 15) {
                newOuterArray[focusOnRefIndex] = newRadius;
                SetRingOuterRadius(newOuterArray);
                modelRingOuterRadiusRef.current[focusOnRefIndex] = newRadius;
            }
        }
    }

    const handleColorChange = (color, modelNum, setState, colorRef) => {
        setFocusOnRefIndex(modelNum - 1);
        const newArray = [...color_1];
        newArray[focusOnRefIndex] = color.hex;
        setState(newArray);
        colorRef.current[focusOnRefIndex] = color.hex;
    };
    const convertColor = (color) => {
        // Remove '#' from the color string
        const colorWithoutHash = color.replace("#", "");

        // Add '0x' prefix to the color string
        const convertedColor = parseInt("0x" + colorWithoutHash);

        return convertedColor;
    };

    const handleDetail = (event, modelNum) => {
        setFocusOnRefIndex(modelNum - 1);
        const newdetail = event.target.value;
        const newArray = [...detail];
        newArray[focusOnRefIndex] = newdetail;
        setDetail(newArray);
    }

    const handleCreateButton = () => {
        const model_data = [];
        // Fill model data
        for (let i = 0; i < modelAmount; i++) {
            let dataJoined = [name[i], shape[i], size[i], texture[i], hadRotate[i], rotateSpeed[i], hadRing[i], ringInnerRadius[i], 
                ringOuterRadius[i], ringTexture[i], hadDetail[i], detail[i], color_1[i], color_2[i], color_3[i]].join("@");
            model_data.push(dataJoined);
        }
        // Fill the empty array with -
        for(let i = modelAmount - 1; i <= 6; i++){
            model_data.push("-");
        }
        // showAlert('สร้างแบบจำลองสำเร็จ', 'เข้าชมแบบจำลองได้เลย', 'success', '/display-3d', modelData);
        const convertedStr = title.toLowerCase().replace(/[^a-z0-9ก-๙]+/g, "-");
        axios.post('http://localhost:3005/create_3d', {
            creator: userData.username,
            title: title,
            coverImage: "Image_Path",
            path: convertedStr,
            modelAmount: modelAmount,
            model_1: model_data[0],
            model_2: model_data[1],
            model_3: model_data[2],
            model_4: model_data[3],
            model_5: model_data[4],
            model_6: model_data[5],
        }).then(() => {
            // navigate to new model
            showAlert('สร้างแบบจำลองสำเร็จ', 'เข้าชมแบบจำลองได้เลย', 'success', `/display-3d/${convertedStr}`);
          })
          .catch((error) => {
            console.log(error);
          });
    }

    return (
        <div>
            <div className="w-full h-fit flex font-ibm-thai flex-col">
                <p className='text-center mt-10 text-2xl font-bold text-gray-600'>สร้างแบบจำลองสามมิติ</p>
            </div>

            <div className="w-full mx-auto flex  max-w-5xl mt-10">
                <div className="w-1/2 flex  mx-auto">
                    <label className="font-ibm-thai text-lg mr-4 my-auto">ชื่อแบบจำลอง</label>
                    <input type="text" name="modelName" id="modelName"
                        className="w-[70%] border-[1.5px] rounded-md px-3 py-2 h-8 text-gray-500  text-lg focus:outline-gray-300 " 
                        onChange={handleTitleName}/>
                </div>
            </div>

            <p className="text-center font-ibm-thai text-lg mt-6">รูปหน้าปกแบบจำลอง</p>
            <div className="w-full mt-0 relative">
                <label htmlFor="file-upload">
                    <img
                        src = {previewImage ? previewImage : "/assets/3d-cover-default.png"}
                        className={`mx-auto max-w-64 max-h-64 ${hover ? "opacity-70" : "opacity-90"} cursor-pointer p-1`}
                    />

                </label>
                <input
                    id="file-upload"
                    className="bg-red-200 mx-auto absolute top-0 max-w-44 h-full opacity-0 cursor-pointer w-full"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    onMouseEnter={() => { setHover(true) }}
                    onMouseLeave={() => { setHover(false) }}
                />
            </div>

            <p className="text-center mt-6 font-ibm-thai">จำนวนโมเดลที่ต้องการสร้าง</p>
            <div className="w-fit mx-auto font-ibm-thai flex">
                <AiFillMinusSquare className="my-auto mr-3 text-xl cursor-pointer text-red-300 hover:text-red-600"
                    onClick={() => handleModelAmount(-1)} />
                <p className="text-xl font-bold my-auto">{modelAmount}</p>
                <AiFillPlusSquare className="my-auto ml-3 text-xl cursor-pointer text-green-300 hover:text-green-600"
                    onClick={() => handleModelAmount(+1)} />
            </div>

            {/*Render component follonwing model amount*/}
            {Array.from({ length: modelAmount }, (v, i) => i + 1).map((modelNumber) => (
                <div key={modelNumber} className="flex w-full h-full max-w-5xl mx-auto rounded-lg shadow-lg border-t-gray-100 border-t-[1px] relative top-10 pb-10 mb-10">
                    <div className="w-1/2 ml-14">
                        <div className="w-full h-fit flex font-ibm-thai flex-col">
                            <p className='text-center mt-6 text-xl text-gray-600 mb-4'>โมเดลที่ {modelNumber}</p>
                        </div>

                        <div className="font-ibm-thai flex mt-4">
                            <label className="text-lg mr-4 my-auto">ชื่อโมเดล</label>
                            <input type="text" name="modelName" id="modelName"
                                className="w-3/4 border-[1.5px] rounded-md px-3 py-2 h-8 text-gray-500  text-lg focus:outline-gray-300 "
                                onChange={handleName} />
                        </div>

                        <div className="w-fit font-ibm-thai flex mt-4">
                            <p className="text-lg my-auto mr-4">รูปทรง</p>
                            <select value={shape[modelNumber - 1]} onChange={(e) => handleShapeChange(e, modelNumber)}>
                                <option value="Sphere">ทรงกลม</option>
                                <option value="Box" >ทรงสี่เหลี่ยม</option>
                                <option value="Nebula" >ฝุ่นในอวกาศ</option>
                            </select>
                        </div>

                        <div className="w-fit font-ibm-thai flex mt-4">
                            <p className="text-center font-ibm-thai mr-4 text-lg">ขนาด</p>
                            <AiFillMinusSquare className="my-auto mr-3 text-xl cursor-pointer text-gray-300 hover:text-red-600"
                                onClick={() => handleSizeChange(modelNumber, -1)} />
                            <p className="text-lg my-auto">{size[modelNumber - 1]}</p>
                            <AiFillPlusSquare className="my-auto ml-3 text-xl cursor-pointer text-gray-300 hover:text-green-600"
                                onClick={() => handleSizeChange(modelNumber, +1)} />
                        </div>

                        {shape[modelNumber - 1] !== 'Nebula' ?
                            <div>
                                <div className="w-fit font-ibm-thai flex mt-4">
                                    <p className="text-center font-ibm-thai mr-4 text-lg">พื้นผิว</p>
                                    <input type="file" className="my-auto" accept="image/*" onChange={(e) => handleTextureUpload(e, modelNumber)} />
                                </div>

                                <div className="w-fit my-auto font-ibm-thai flex mt-4 text-lg">
                                    <label><input type="checkbox" className="mr-4 mt-2" onChange={() => handleCheckbox(modelNumber, setHadRotate, hadRotate, modelRotateSpeedRef, 'integer')} />
                                        หมุนรอบตัวเอง
                                    </label>
                                </div>
                                {hadRotate[modelNumber - 1] ?
                                    <div className="font-ibm-thai mt-2 ml-4 flex">
                                        <p className="text-center font-ibm-thai mr-4 text-base my-auto text-gray-800">ความเร็ว</p>
                                        <input type="range" className="w-3/4 h-4 my-auto bottom-12 cursor-pointer bg-gray-200
                                 dark:bg-gray-200  appearance-none range-lg rounded-lg" min={0} max={rangeValues.length - 1} step={1}
                                            onChange={(e) => handleRangeChange(e, modelNumber)} defaultValue={0} />
                                    </div>
                                    : null}

                                <div className="w-fit my-auto font-ibm-thai flex mt-4 text-lg">
                                    <label><input type="checkbox" className="mr-4 mt-2" onChange={() => handleCheckbox(modelNumber, setHadRing, hadRing, modelHadRingRef, 'boolean')} />
                                        วงแหวนล้อมรอบ
                                    </label>
                                </div>
                                {hadRing[modelNumber - 1] ?
                                    <div>
                                        <div className="w-fit font-ibm-thai flex mt-2 ml-4">
                                            <p className="text-center font-ibm-thai mr-4 text-base my-auto text-gray-800">ขนาดวงใน</p>
                                            <AiFillMinusSquare className="my-auto mr-3 text-lg cursor-pointer text-gray-300 hover:text-red-600"
                                                onClick={() => handleRingRadiusChange(modelNumber, -1, 'Inner')} />
                                            <p className="text-lg my-auto">{ringInnerRadius[modelNumber - 1]}</p>
                                            <AiFillPlusSquare className="my-auto ml-3 text-lg cursor-pointer text-gray-300 hover:text-green-600"
                                                onClick={() => handleRingRadiusChange(modelNumber, +1, 'Inner')} />
                                        </div>
                                        <div className="w-fit font-ibm-thai flex mt-2 ml-4">
                                            <p className="text-center font-ibm-thai mr-4 text-base my-auto text-gray-800">ขนาดวงนอก</p>
                                            <AiFillMinusSquare className="my-auto mr-3 text-lg cursor-pointer text-gray-300 hover:text-red-600"
                                                onClick={() => handleRingRadiusChange(modelNumber, -1, 'Outer')} />
                                            <p className="text-lg my-auto">{ringOuterRadius[modelNumber - 1]}</p>
                                            <AiFillPlusSquare className="my-auto ml-3 text-lg cursor-pointer text-gray-300 hover:text-green-600"
                                                onClick={() => handleRingRadiusChange(modelNumber, +1, 'Outer')} />
                                        </div>
                                        <div className="w-fit font-ibm-thai flex mt-2 ml-4">
                                            <p className="text-center font-ibm-thai mr-4 text-base my-auto text-gray-800">พื้นผิววงแหวน</p>
                                            <input type="file" className="my-auto" accept="image/*" onChange={(e) => handleRingTextureUpload(e, modelNumber)} />
                                        </div>
                                    </div>
                                    : null}
                            </div>
                            : <div>
                                <div className="w-fit font-ibm-thai mt-4 flex">
                                    <p className="text-center font-ibm-thai mr-4 text-lg my-auto text-gray-800">สีที่ 1</p>
                                    <HuePicker color={color_1[modelNumber - 1]}
                                        onChangeComplete={(e) => handleColorChange(e, modelNumber, setColor_1, modelNebula_Color1_Ref)} className="my-auto" />
                                </div>
                                <div className="w-fit font-ibm-thai mt-4 flex">
                                    <p className="text-center font-ibm-thai mr-4 text-lg my-auto text-gray-800">สีที่ 2</p>
                                    <HuePicker color={color_2[modelNumber - 1]}
                                        onChangeComplete={(e) => handleColorChange(e, modelNumber, setColor_2, modelNebula_Color2_Ref)} className="my-auto" />
                                </div>
                                <div className="w-fit font-ibm-thai mt-4 flex">
                                    <p className="text-center font-ibm-thai mr-4 text-lg my-auto text-gray-800">สีที่ 2</p>
                                    <HuePicker color={color_3[modelNumber - 1]}
                                        onChangeComplete={(e) => handleColorChange(e, modelNumber, setColor_3, modelNebula_Color3_Ref)} className="my-auto" />
                                </div>
                            </div>
                        }

                        <div className="w-fit my-auto font-ibm-thai flex mt-4 text-lg">
                            <label><input type="checkbox" className="mr-4 mt-2" onChange={() => handleCheckbox(modelNumber, setHadDetail, hadDetail)} />
                                คำอธิบายเพิ่มเติม
                            </label>
                        </div>
                        {hadDetail[modelNumber - 1] ?
                            <div className="w-fit font-ibm-thai mt-6 ml-4 mb-6">
                                <p className="text-center font-ibm-thai mr-4 text-base my-auto  text-gray-500">เขียนอธิบาย</p>
                                <input type="text" name="modelName" id="modelName"
                                    className="w-5/6  mx-auto absolute border-[1.5px] rounded-md py-2 h-8 text-gray-500  text-lg focus:outline-gray-300 "
                                    onChange={handleDetail} />
                            </div>
                            : null}


                    </div>
                    <div className="w-1/2 mr-14">
                        <div className="w-full h-fit flex font-ibm-thai flex-col">
                            <p className='text-center mt-6 text-xl text-gray-600'>ตัวอย่างโมเดล</p>
                        </div>
                        <canvas id="preview" alt="preview" ref={(element) => { canvasRef.current[modelNumber - 1] = element }} className="mx-auto mt-6 h-5/6" />
                    </div>
                </div>
            ))}

            <div className="w-full flex">
                <button className="mx-auto py-3 rounded-xl mt-6 text-md bg-gradient-to-r font-ibm-thai
                    ease-in-out duration-300 from-[#6e3f92] to-[#a94fa4] hover:marker:from-[#754798] hover:to-[#a65ea3] 
                    text-white px-4 mb-10" onClick={handleCreateButton}>สร้างโมเดล
                </button>
            </div>
        </div>

    )
}

export default Create3D;