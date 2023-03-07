import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from 'firebase/compat/app';
import { UserContext } from "../App"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { AiOutlineEdit } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';

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
    const { userData, logged, setLogged, setUserData } = useContext(UserContext)
    const [urlTemp, setUrlTemp] = useState(null);
    const [image, setimage] = useState(null);
    const [userID, setuserID] = useState(null);
    const [chooseFile, setchooseFile] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [editUsernameBox, setEditUsernameBox] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [accountUserData, setAccountUserData] = useState();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedUserData = localStorage.getItem('userData');
        console.log(storedUserData);
        setAccountUserData(storedUserData);
    }, []);

    const handleImageChange = (event) => {
        // Choosen image file
        if (event.target.files[0] && event.target.files[0].type === 'image/png' && (event.target.files[0].name.endsWith('.png') || event.target.files[0].name.endsWith('.jpg'))) {
            uploadTempToStorage(event.target.files[0], userData.userId);
            setchooseFile(true);
        }
        // Choosen another type file
        else if (event.target.files[0] && !(event.target.files[0].name.endsWith('.png') || event.target.files[0].name.endsWith('.jpg'))) {
            showAlert('บันทึกข้อมูลไม่สำเร็จ', 'กรุณาเลือกไฟล์ที่เป็นรูป', 'error', '/account');
        }
        // No file choosen (used to choosen and then cancel)
        else {
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
        if (chooseFile) {
            uploadBytes(imageRef, image)
                .then(() => {
                    getDownloadURL(imageRef)
                        .then((url) => {
                            updateImageProfile(url);
                        })
                        .catch((error) => {
                            console.log(error.message, "error getting the image url");
                        })
                })
                .catch((error) => {
                    console.log(error.message);
                })
        }
        if (newUsername === "") {
            showAlert('บันทึกข้อมูลสำเร็จ', 'ข้อมูลบัญชีของคุณอัปเดตแล้ว', 'success', '/');
            return;
        }
        else {
            const userId = userData.userId;
            const userRef = firebase.firestore().collection('users').doc(userId);
            userRef.update({
                username: newUsername
            })
                .catch((error) => {
                    console.error('Error updating profile image: ', error);
                });
            showAlert('บันทึกข้อมูลสำเร็จ', 'ข้อมูลบัญชีของคุณอัปเดตแล้ว', 'success', '/');
            return;
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
            .then(() => navigate(path))
            .then(() => {
                window.location.reload();
            })
    }

    const editUsername = () => {
        if (!editUsernameBox) {
            setEditUsernameBox(current => !current);
            return;
        }
        else {
            return;
        }
    }

    const handleForm = (setState) => (event) => {
        console.log(event.target.value);
        setState(event.target.value);
    }

    return (
        <>
            {userData && (
                <div className="w-full h-[96vh] text-center">
                    <div className="h-full max-w-xl mx-auto flex">
                        <div className="w-full h-fit my-auto relative">
                            <p className="text-2xl font-ibm-thai font-bold">ตั้งค่าบัญชี</p>
                            <div className="font-ibm-thai  w-full flex flex-col  px-4 py-4 shadow-none sm:shadow-md 
                        rounded-md border-t-[0] sm:border-t-[1px] mt-4 z-5 bg-white">
                                <label className="text-left text-lg font-bold text-gray-600">รูปโปรไฟล์</label>

                                <div className="justify-center relative ">
                                    <div className="w-1/2 sm:w-1/3 mb-5 flex mx-auto p-4">
                                        <img src={!chooseFile ? (userData.userProfile === "default" ? "/assets/default.png" : userData.userProfile) : urlTemp}
                                            alt="profile" className={`${isHover ? "opacity-50" : "opacity-100"} shadow
                                            rounded-full w-full `} />
                                        <input type="file" accept="image/png" onChange={handleImageChange}
                                            onMouseOver={() => { setIsHover(true) }} onMouseLeave={() => { setIsHover(false) }}
                                            className="opacity-0 absolute px-4 cursor-pointer w-1/3 h-full" />
                                        {isHover ? <BiImageAdd className="text-3xl absolute rounded-full p-1 text-white
                                        opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer w-10 h-10" 
                                        onMouseOver={() => { setIsHover(true) }} onMouseLeave={() => { setIsHover(false) }}/> : null}
                                    </div>
                                </div>



                                <label className="mt-10 text-left text-lg font-bold text-gray-600 flex">ชื่อผู้ใช้เดิม : {userData.username}
                                    <AiOutlineEdit className="my-auto ml-2 cursor-pointer" onClick={editUsername} />
                                </label>
                                {editUsernameBox ? (<input type="text" name="editUsername" id="editUsername"
                                    placeholder="ชื่อผู้ใช้ใหม่" onChange={handleForm(setNewUsername)}
                                    className={`mt-2 border-[1.5px] rounded-md px-3 py-2 w-full h-12 text-gray-500  text-lg
                                 focus:outline-gray-300`} />) : (null)
                                }

                                <button onClick={handleSubmit}
                                    className="py-3 rounded-xl mt-6 text-lg bg-gradient-to-r 
                            from-[#6e3f92] to-[#a94fa4]
                            hover:marker:from-[#754798] hover:to-[#a65ea3] text-white">บันทึก</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Account;