import { useNavigate } from "react-router-dom";
import { useContext, useState } from 'react';

import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import firebase from 'firebase/compat/app';

import {UserContext} from "../App"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const Account = () => {

    const {userData,logged,setLogged, setUserData} = useContext(UserContext)

    const [urlTemp, setUrlTemp] = useState(null);
    const [image, setimage] = useState(null);
    const [userID, setuserID] = useState(null);
    const [chooseFile, setchooseFile] = useState(false);

    const handleImageChange = (event) => {
        // Choosen image file
        if (event.target.files[0] && event.target.files[0].type === 'image/png' && (event.target.files[0].name.endsWith('.png') || event.target.files[0].name.endsWith('.jpg'))) {
            uploadTempToStorage(event.target.files[0], userData.userId);
            setchooseFile(true);
        }
        // Choosen another type file
        else if (event.target.files[0] && !(event.target.files[0].name.endsWith('.png') || event.target.files[0].name.endsWith('.jpg'))){
            showAlert('บันทึกข้อมูลไม่สำเร็จ', 'กรุณาเลือกไฟล์ที่เป็นรูป', 'error', '/account');
        }
        // No file choosen (used to choosen and then cancel)
        else{
            setchooseFile(false);
        }
    }

    // Upload temp image that user select to show on page (not click save yet)
    const uploadTempToStorage = (image, userID) => {
        const imageRef = ref(storage, `profile_image/${userID}/temp/image_temp`);
        uploadBytes(imageRef, image)
            .then(() => {
                getDownloadURL(imageRef)
                    .then((url) => {
                        setUrlTemp(url);
                        setimage(image);
                        setuserID(userID);
                    })
                    .catch((error) => {
                        console.log(error.message, "error getting the image url");
                    })
                    setimage(null);
            })
            .catch((error) => {
                console.log(error.message);
            })
    }

    // Upload real image that user want to use (after click save)
    const handleSubmit = () => {
        const imageRef = ref(storage, `profile_image/${userID}/save/image_saved`);
        if(chooseFile){
            uploadBytes(imageRef, image)
            .then(() => {
                getDownloadURL(imageRef)
                    .then((url) => {
                        updateImageProfile(url);
                        showAlert('บันทึกข้อมูลสำเร็จ', 'ข้อมูลบัญชีของคุณอัปเดตแล้ว', 'success', '/');
                    })
                    .catch((error) => {
                        console.log(error.message, "error getting the image url");
                    })
            })
            .catch((error) => {
                console.log(error.message);
            })
        }
        else{
            showAlert('บันทึกข้อมูลสำเร็จ', 'ข้อมูลบัญชีของคุณอัปเดตแล้ว', 'success', '/');
        }
    }

    const updateImageProfile = (url) => {
        const userId = userData.userId;
        const userRef = firebase.firestore().collection('users').doc(userId);
        userRef.update({
            profileImage: url
            })
            .catch((error) => {
            console.error('Error updating profile image: ', error);
            });
    }

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

    return (
        <div className="w-full h-[96vh] text-center">
            <div className="h-full max-w-xl mx-auto flex">
                <div className="w-full h-fit my-auto relative">
                    <p className="text-2xl font-ibm-thai font-bold">ตั้งค่าบัญชี</p>
                    <div className="font-ibm-thai  w-full flex flex-col  px-4 py-4 shadow-none sm:shadow-md 
                    rounded-md border-t-[0] sm:border-t-[1px] mt-4 z-5 bg-white">
                        <label className="text-left text-lg font-bold text-gray-600">รูปโปรไฟล์</label>

                        <div className="flex flex-wrap justify-center">
                            <div className="w-6/12 sm:w-4/12 px-4 mb-5">
                                <img src={ !chooseFile ? ( userData.userProfile === "default" ? "/assets/default.png" : userData.userProfile ) : urlTemp}
                                    alt="profile" className="shadow rounded-full max-w-full h-auto align-middle border-none" />
                            </div>
                        </div>

                        <input type="file" accept="image/png" onChange={handleImageChange} />
                        <button onClick={handleSubmit}
                            className="py-3 rounded-xl mt-6 text-lg bg-gradient-to-r 
                        from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white">บันทึก</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account;