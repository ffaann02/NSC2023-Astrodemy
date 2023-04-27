import { useContext, useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UserContext } from "./App";
import firebase from 'firebase/compat/app';
import { AiFillEdit, AiFillCheckCircle } from "react-icons/ai"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios';
import "./App.css"
const AccountSetting = () => {
    const { userData, logged, setLogged, setUserData, role, setRole, calendarNoti, setCalendarNoti } = useContext(UserContext);

    const [settingState, setSettingState] = useState(0);
    const [hover, setHover] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [pdfFile,setPdfFile] = useState("");
    const [pdfUrl,setPdfUrl] = useState("");
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_API_KEY,
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_PROJECT_ID,
        storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_APP_ID,
        measurementId: process.env.REACT_APP_MEASUREMENT_ID
    };

    const [previewImage, setPreviewImage] = useState("");

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log(selectedFile);
        setPdfFile(selectedFile);
      };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        // Create a new FileReader instance
        const reader = new FileReader();

        // Set up the onload event for the FileReader
        reader.onload = () => {
            const img = new Image();

            // Set up the onload event for the Image
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // Determine the size of the cropped square
                const size = Math.min(img.width, img.height);

                // Set the canvas dimensions to the size of the cropped square
                canvas.width = size;
                canvas.height = size;

                // Draw the image onto the canvas
                ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);

                // Get the data URL of the cropped image
                const dataURL = canvas.toDataURL();
                // Convert the base64-encoded dataURL to a Blob object
                const byteCharacters = atob(dataURL.split(",")[1]);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "image/png" });
                console.log(blob)
                // Set the preview image and the image state
                setPreviewImage(dataURL);
                setImage(blob);
            };

            // Set the src of the Image to the data URL of the uploaded file
            img.src = reader.result;
        };

        // Read the uploaded file as a data URL
        reader.readAsDataURL(file);
    };

    const sweetAlert = withReactContent(Swal)
    const showAlert = (title, html, icon) => {
        sweetAlert.fire({
            title: <strong>{title}</strong>,
            html: <i>{html}</i>,
            icon: icon,
            confirmButtonText: 'ตกลง'
        })
            .then(() => {
                window.location.reload();
            })
    }

    const [toggleChangePass, setToggleChangePassword] = useState(false);
    const handleUpload = async () => {
        if (image) {
            console.log("file that will be uploaded: " + image);
            setIsLoading(true);
            const storageRef = ref(getStorage(app), `userImages/${userData.username}`);
            await uploadBytes(storageRef, image).then(async (snapshot) => {
                const downloadURL = await getDownloadURL(storageRef);
                console.log(downloadURL);
                setImageUrl(downloadURL);
                setIsLoading(false);
                const userId = userData.userId;
                const userRef = firebase.firestore().collection('users').doc(userId);
                userRef.update({
                    profileImage: downloadURL
                })
                    .then(() => {
                        // Reload the page after the profile image has been updated
                        // window.location.reload();
                        showAlert('บันทึกข้อมูลสำเร็จ', 'ข้อมูลบัญชีของคุณอัปเดตแล้ว', 'success');
                    })
                    .catch((error) => {
                        console.error('Error updating profile image: ', error);
                    });
            });
        }
    }
    const handleUpgradeRole = async () => {
        const userId = userData.userId;
        const userRef = firebase.firestore().collection('users').doc(userId);
        if (pdfFile) {
            console.log("File that will be uploaded: " + pdfFile.name);
            setIsLoading(true);
            const storageRef = ref(getStorage(), `userPDFs/${pdfFile.name}`);
            await uploadBytes(storageRef, pdfFile).then(async (snapshot) => {
              const downloadURL = await getDownloadURL(storageRef);
              console.log(downloadURL);
              setPdfUrl(downloadURL);
              setIsLoading(false);
              const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
              const formattedDate = today.toLocaleDateString('th-TH', options);
              axios.post('http://localhost:3005/report', {
                title:"ขอเลื่อนขั้นเป็นคุณครู",
                username:userData.username,
                date:formattedDate,
                status:downloadURL
                })
            });
          }
        showAlert('ส่งคำร้องสำเร็จ', 'กำลังดำเนินการเลื่อนขั้น', 'success');
        userRef.update({
            role: "teacher"
        })
            .then(() => {
                // Reload the page after the profile image has been updated
                // window.location.reload();
                showAlert('ส่งคำร้องสำเร็จ', 'ข้อมูลบัญชีของคุณอัปเดตแล้ว', 'success');
            })
            .catch((error) => {
                console.error('Error updating profile image: ', error);
            });
    }
    const [upgradeRole, setUpgradeRole] = useState(false);
    const app = initializeApp(firebaseConfig);
    return (
        <>
            <div className="w-full h-full min-h-screen max-w-4xl  mx-auto flex p-4 md:p-10 drop-shadow-sm mt-10 md:mt-0">
                <div className="h-full sm:h-screen grid grid-cols-8 w-full font-ibm-thai bg-white p-5 rounded-lg drop-shadow-md border-t-[1px] border-gray-100">
                    <div className="col-span-full md:col-span-2">
                        <div
                            className={`w-full ${settingState === 0 ? "bg-gray-100" : ""
                                } p-2 text-xl pl-4 rounded-lg py-3 my-2 cursor-pointer`}
                            onClick={() => {
                                setSettingState(0);
                            }}
                        >
                            โปรไฟล์
                        </div>
                        <div
                            className={`w-full ${settingState === 1 ? "bg-gray-100" : ""
                                } p-2 text-xl pl-4 rounded-lg py-3 my-2 cursor-pointer`}
                            onClick={() => {
                                setSettingState(1);
                            }}
                        >
                            การแจ้งเตือน
                        </div>
                    </div>
                    {settingState === 0 && <div className="col-span-full md:col-span-6 p-10 pt-0 ">
                        <p className="text-2xl mt-2 font-semibold text-left">ตั้งค่าโปรไฟล์</p>
                        <div className=''>
                            <p className="text-lg mt-6 font-semibold">รูปโปรไฟล์</p>
                            <div className="mt-2 w-fit relative">
                                <label htmlFor="file-upload">
                                    {userData && <img
                                        src={previewImage ? previewImage : userData.userProfile}
                                        className={`rounded-full w-44 max-w-44 ${hover ? "opacity-80" : "opacity-100"} cursor-pointer p-1 border-2 border-gray-800`}
                                    />}

                                </label>
                                <input
                                    id="file-upload"
                                    className=" absolute top-0 max-w-44 h-full opacity-0 cursor-pointer w-full"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    onMouseEnter={() => { setHover(true) }}
                                    onMouseLeave={() => { setHover(false) }}
                                />
                            </div>
                            {/* <button onClick={handleUpload}>Upload</button> */}
                            {previewImage && <button className="py-3 rounded-xl mt-6 text-md bg-gradient-to-r font-ibm-thai
                ease-in-out duration-300 from-[#6e3f92] to-[#a94fa4] hover:marker:from-[#754798] hover:to-[#a65ea3] 
                text-white px-4 " onClick={handleUpload}>บันทึกการเปลี่ยนแปลง</button>}
                            {previewImage && <button className="py-3 rounded-xl mt-6 text-md bg-gradient-to-r font-ibm-thai
                ease-in-out duration-300 from-[#a9a9a9] to-[#afafaf] 
                text-white px-4 ml-2" onClick={() => {
                                    setPreviewImage(null);
                                    setImageUrl(null);
                                    setImage(null);
                                }}>ยกเลิก</button>}
                            {userData && <div className='w-full flex mt-4'>
                                <p className="text-md my-auto mt-[2px] text-gray-500">ชื่อผู้ใช้: </p>
                                <p className='text-xl ml-2 my-auto font-bold '>{userData.username}</p>
                            </div>}
                            {userData && <div className='w-full flex mt-2'>
                                <p className="text-md my-auto mt-[2px] text-gray-500">ระดับ: </p>
                                {role && role === "teacher" && <p className='text-lg ml-2 my-auto font-semibold text-blue-800'>คุณครู</p>}
                                {role && role === "general" && <p className='text-lg ml-2 my-auto font-semibold text-blue-800'>ผู้ใช้งานทั่วไป</p>}
                                {role && role !== "teacher" && <p className='text-sm ml-1 my-auto text-gray-400 mt-1 hover:underline 
                                cursor-pointer hover:text-blue-600' onClick={() => { setUpgradeRole(prev => !prev) }}>เลื่อนขั้น</p>}
                            </div>}
                            {upgradeRole &&
                                <div className='w-full flex rounded-lg bg-gray-50 py-3 border-[1px] flex-col px-4 mb-2'>
                                    <p className='text-blue-800 text-lg font-semibold'>เลื่อนขั้นเป็นคุณครู</p>
                                    <div className=''>
                                        <div className='w-full flex my-2'>
                                            <AiFillCheckCircle className='text-xl text-green-600 my-auto' />
                                            <p className='my-auto ml-4'>ปลดล็อกฟีเจอร์แบบจำลองสามมิติเพิ่ม</p>
                                        </div>
                                        <div className='w-full flex my-2'>
                                            <AiFillCheckCircle className='text-xl text-green-600 my-auto' />
                                            <p className='my-auto ml-4'>ปลดล็อกเครื่องมือที่ใช้ประกอบการสอน</p>
                                        </div>
                                        <div className='w-full flex my-2'>
                                            <AiFillCheckCircle className='text-xl text-green-600 my-auto' />
                                            <p className='my-auto ml-4'>สามารถสร้างห้องเรียนได้</p>
                                        </div>
                                    </div>
                                    <p className='text-blue-800 text-md mb-1'>ข้อมูลประกอบเพิ่มเติม</p>
                                    <div className='w-full'>
                                        <p className='text-blue-800 text-sm'>เอกสารยืนยันการเป็นครูผู้สอน</p>
                                        <input type="file" className='' accept=".pdf"  onChange={handleChange}/>
                                    </div>

                                    <div className='mt-2'>
                                        <button className="rounded-lg text-md bg-gradient-to-r px-6 py-2 font-ibm-thai w-fit
                        from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white" onClick={handleUpgradeRole}>ยืนยัน</button>
                                        <button className="py-2 rounded-lg text-md bg-gradient-to-r font-ibm-thai
                ease-in-out duration-300 from-[#a9a9a9] to-[#afafaf] 
                text-white px-4 ml-2" onClick={() => { setUpgradeRole(false) }}>ยกเลิก</button>
                                    </div>

                                </div>}
                            <div className='w-full flex mt-2'>
                                <p className="text-md my-auto mt-[2px] text-gray-500">เปลี่ยนรหัสผ่าน</p>
                                <AiFillEdit className='text-lg my-auto ml-1 hover:text-blue-600 cursor-pointer'
                                    onClick={() => { setToggleChangePassword(prev => !prev) }} />
                                {/* <p className='text-xl ml-2 my-auto font-bold '>{userData.username}</p> */}
                            </div>
                            {toggleChangePass &&
                                <div>
                                    <input
                                        className="w-3/4 border-2 bg-transparent outline-none font-ibm-thai text-gray-600 p-1 pt-2 pl-2 rounded-md my-[2px]"
                                        placeholder="รหัสผ่านเดิม" />
                                    <input
                                        className="w-3/4 border-2 bg-transparent outline-none font-ibm-thai text-gray-600 p-1 pt-2 pl-2 rounded-md my-[2px]"
                                        placeholder="รหัสผ่านใหม่" />
                                    <input
                                        className="w-3/4 border-2 bg-transparent outline-none font-ibm-thai text-gray-600 p-1 pt-2 pl-2 rounded-md my-[2px]"
                                        placeholder="ยืนยันรหัสผ่านใหม่" />
                                    <button className="py-3 rounded-xl mt-2 text-md bg-gradient-to-r font-ibm-thai
                ease-in-out duration-300 from-[#6e3f92] to-[#a94fa4] hover:marker:from-[#754798] hover:to-[#a65ea3] 
                text-white px-4 " >บันทึกการเปลี่ยนแปลง</button>
                                    <button className="py-3 rounded-xl mt-2 text-md bg-gradient-to-r font-ibm-thai
                ease-in-out duration-300 from-[#a9a9a9] to-[#afafaf] 
                text-white px-4 ml-2" onClick={() => { setToggleChangePassword(false) }}>ยกเลิก</button>
                                </div>}
                        </div>
                    </div>}
                    {settingState === 1 && <div className="col-span-full md:col-span-6 pr-2 md:pr-10 p-10 pt-0">
                        <p className="text-2xl mt-2 font-semibold text-left">ตั้งค่าการแจ้งเตือน</p>
                        <label id="toggle-button" className='mt-1 ml-1 w-full cursor-pointer'>
                            <div className='flex justify-between'>
                                <p className='text-gray-600 text-lg my-auto'>การแจ้งเตือนวันพิเศษตามปฏิทินดาราศาสตร์</p>
                                <div className='w-[4rem] bg-gray-100 my-auto 
                    border-2 rounded-full'>
                                    <div className='pt-[0.25rem] pl-1'>
                                        <label id="toggle-button" className='mt-1 ml-1 w-full cursor-pointer'>
                                            <input type="checkbox" />
                                            <span className="toggle-button-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between mt-3'>
                                <p className='text-gray-600 text-lg my-auto'>การแจ้งเตือนทางอีเมล</p>
                                <div className='w-[4rem] bg-gray-100 my-auto 
                    border-2 rounded-full'>
                                    <div className='pt-[0.25rem] pl-1'>
                                        <label id="toggle-button" className='mt-1 ml-1 w-full cursor-pointer'>
                                            <input type="checkbox" />
                                            <span className="toggle-button-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </label>
                    </div>}
                </div>
            </div>
        </>
    );
};

export default AccountSetting;
