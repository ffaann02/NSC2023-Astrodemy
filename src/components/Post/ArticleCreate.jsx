import { useContext, useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import 'firebase/firestore';
import { BsImage } from "react-icons/bs"
import { FaRegWindowClose } from "react-icons/fa"
import ReactQuill from 'react-quill';
import Swal from 'sweetalert2';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
const ArticleCreate = () => {
    const navigate = useNavigate();
    const { userData, logged, setLogged, setUserData } = useContext(UserContext)
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
    const [blogContent, setBlogContent] = useState('');
    const [coverUrl, setCoverUrl] = useState("");
    const handlePublishBlog = () => {
        console.log(blogTitle);
        console.log(blogContent);
        if (blogTitle === "") {
            setPopupFade(true);
            setPopupText("โปรดใส่หัวเรื่องบทความ");
            setPopupColor("text-red-600");
            return;
        }
        if (!preview) {
            setPopupFade(true);
            setPopupText("โปรดเพิ่มหน้าปกบทความ");
            setPopupColor("text-red-600");
            return;
        }
        Swal.fire({
            title: 'เผยแพร่บทความนี้',
            text: "บทความนี้จะสามารถทำให้คนอื่นเข้าถึงบทความได้อย่างสาธารณะ และยอมรับเงื่อนไขว่าบทความนี้สามารถถูกระงับการเผยแพร่ได้ทุกเมื่อ หากมีการตรวจสอบภายหลังว่าเป็นข้อมูลเท็จ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ตกลง',
            cancelButtonText: "ยกเลิก"
        }).then((result) => {
            const convertedStr = blogTitle.toLowerCase().replace(/[^a-z0-9ก-๙]+/g, "-");
            const today = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = today.toLocaleDateString('th-TH', options);
            alert(formattedDate);
            if (result.isConfirmed) {
                axios.post('http://localhost:3005/create_article', {
                    author: userData.username,
                    authorProfile: userData.userProfile,
                    date:formattedDate,
                    title:blogTitle,
                    content:blogContent,
                    tags:"Astronomy",
                    coverImage:coverUrl,
                    path:convertedStr
                })
                Swal.fire(
                    'ส่งบทความสำเร็จ',
                    'กรุณาโปรดรอระบบตรวจสอบบทความเพื่อเผยแพร่',
                    'success'
                )
                 navigate("/post");
            }
        })
    }
    const [previewBlog, setPreviewBlog] = useState(false);
    const [blogTitle, setBlogTitle] = useState("");
    const popupRef = useRef(null);
    const previewRef = useRef(null);
    const [hoverChange, setHoverChange] = useState(false);
    const [preview, setPreview] = useState(null);
    const [coverUpload, setCoverUpload] = useState(false);
    const [comments,setComments] = useState([]);
    function handleImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            const storage = getStorage();
            const storageRef = ref(storage, `cover_articles/${userData.username}` + file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result)
            };
            reader.readAsDataURL(file);
            // Upload file to Firebase Storage
            uploadBytes(storageRef, file).then((snapshot) => {
                console.log("Uploaded a blob or file!", snapshot);

                // Get download URL
                getDownloadURL(storageRef).then((url) => {
                    console.log("File available at", url);
                    setCoverUrl(url);
                    setCoverUpload(false);
                }).catch((error) => {
                    console.log("Error getting download URL", error);
                });
            }).catch((error) => {
                console.log("Error uploading file", error);
            });
        }
    }
    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setCoverUpload(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popupRef]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (previewRef.current && !previewRef.current.contains(event.target)) {
                setPreviewBlog(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [previewRef]);
    const [popupFade, setPopupFade] = useState(false);
    const [popupText, setPopupText] = useState("");
    const [popupColor, setPopupColor] = useState("text-gray-400")
    useEffect(() => {
        if (popupFade) {
            setTimeout(() => {
                setPopupFade(false);
                setPopupText("");
                setPopupColor("text-gray-400");
            }, 2000);
        }
    }, [popupFade]);
    const handlePreviwPopup = () => {
        if (blogTitle === "") {
            setPopupFade(true);
            setPopupText("โปรดใส่หัวเรื่องบทความ");
            setPopupColor("text-red-600");
            return;
        }
        if (!preview) {
            setPopupFade(true);
            setPopupText("โปรดเพิ่มหน้าปกบทความ");
            setPopupColor("text-red-600");
            return;
        }
        setPreviewBlog(true);
    }
    return (
        <>
            {popupFade && (
                <div className={`z-[200] fixed font-ibm-thai ${popupColor} w-full text-center top-20`} id="popup-text">
                    <p>{popupText}</p>
                </div>)}
            {previewBlog && (
                <div className="fixed z-[50] w-full min-h-screen flex bg-transparent">
                    <div className="w-full h-full z-[15] absolute flex bg-black bg-opacity-50">
                        <div className="max-w-5xl w-full h-fit m-auto mt-4 min-h-screen" ref={previewRef}>
                            <div className="bg-white w-full h-full rounded-lg relative pt-5 py-5 pb-20"
                                data-aos="fade-up">
                                <div className="absolute top-4 right-4 cursor-pointer" onClick={() => { setPreviewBlog(false) }}>
                                    <FaRegWindowClose className="text-4xl text-red-400" />
                                </div>
                                <div className='w-full h-[300px] px-20'>
                                    {preview && <img src={preview} alt="Preview" className={`w-full h-full
                                object-cover ${hoverChange ? "opacity-80" : "opacity-100"}`} />}
                                </div>
                                <div className='font-ibm-thai px-20 mt-4'>
                                    <p className={`text-4xl font-bold text-black`}>
                                        {blogTitle}</p>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: blogContent }} className="px-20 w-full h-full bg-red-200" />
                                <div className='font-ibm-thai px-20 mt-4'>
                                    <p className={`text-4xl font-bold text-black`}>
                                        {blogTitle}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {coverUpload && (
                <div className="fixed z-[50] w-full h-full flex bg-transparent">
                    <div className="w-full h-full z-[15] absolute flex bg-black bg-opacity-50">
                        <div className="max-w-4xl w-full h-fit m-auto mt-10" ref={popupRef}>
                            <div className="bg-white w-full h-[65vh] rounded-3xl relative pt-5 py-5" data-aos="fade-up">
                                <div className="absolute top-4 right-4 cursor-pointer" onClick={() => { setCoverUpload(false) }}>
                                    <FaRegWindowClose className="text-4xl text-red-400" />
                                </div>
                                <p className="text-center font-ibm-thai text-2xl mt-5">อัปโหลดรูปภาพหน้าปกบทความ</p>
                                <div className='w-full h-3/4 mt-5 relative'>
                                    <div className="w-full h-full flex box-border">
                                        <div className='w-full h-full bg-gray-100 rounded-xl border-2 flex'>
                                            {!preview && <div className='m-auto font-ibm-thai'>
                                                <BsImage className='mx-auto mb-2 text-3xl' />
                                                <p className="text-xl">เลือกไฟล์</p>
                                            </div>}
                                            {hoverChange && preview && <div className='top-[48%] left-[49%] font-ibm-thai absolute z-[110] text-white'>
                                                <BsImage className='mx-auto mb-2 text-3xl' />
                                                <p className="text-xl">แก้ไข</p>
                                            </div>}
                                        </div>
                                        {preview && <img src={preview} alt="Preview" className={`w-full h-full absolute z-[100] 
                                    top-0 object-cover ${hoverChange ? "opacity-80" : "opacity-100"}`} />}
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleImageChange}
                                        onMouseOver={() => { setHoverChange(true) }} onMouseLeave={() => { setHoverChange(false) }}
                                        className="top-0 w-full h-full cursor-pointer absolute bg-blue-200 opacity-0 z-[120]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full h-full max-w-5xl mx-auto rounded-lg shadow-lg border-t-gray-100 border-t-[1px] relative top-10">
                <div className="w-full h-fit flex font-ibm-thai flex-col pb-10 mb-10">
                    <p className='text-center mt-6 text-xl text-gray-400'>หน้าปกบทความ</p>
                    <div className="w-1/2 h-[300px] mt-2 mx-auto">
                        <div className="relative w-full h-full bg-gray-100 rounded-2xl border-[1.5px] flex hover:opacity-60 cursor-pointer"
                            onClick={() => { setCoverUpload(true) }}>
                            {!preview && <div className='w-fit h-fit m-auto'>
                                <BsImage className="text-3xl mx-auto" />
                                <p className='mt-2'>อัปโหลดหน้าปกบทความ</p>
                            </div>}
                            {preview && hoverChange && <div className='w-fit h-fit m-auto z-[20] text-white'>
                                <BsImage className="text-3xl mx-auto" />
                                <p className='mt-2'>แก้ไขหน้าปก</p>
                            </div>}
                            {preview && <img src={preview} alt="Preview" className={`w-full h-full absolute z-[10]
                                    top-0 object-cover ${hoverChange ? "opacity-80" : "opacity-100"} rounded-xl`}
                                onMouseOver={() => { setHoverChange(true) }} onMouseLeave={() => { setHoverChange(false) }} />}
                        </div>
                    </div>
                    <input className="w-full border-none bg-transparent font-bold outline-none font-ibm-thai text-gray-800 mt-4
                    b ml-10 text-3xl py-4 leading-[50px]" placeholder="หัวเรื่อง" onChange={(e) => { setBlogTitle(e.target.value) }} />
                    <p className='text-center mt-1 text-xl text-gray-400'>เนื้อหาบทความ</p>
                    <div className="px-10 mt-2 h-full">
                        <ReactQuill
                            className="w-full mx-auto font-ibm-thai h-full"
                            theme="snow"
                            value={blogContent}
                            onChange={setBlogContent}
                            modules={{
                                toolbar: {
                                    container: [
                                        [{ 'header': '1' }, { 'header': '2' },],
                                        [{ 'size': [] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                        { 'indent': '-1' }, { 'indent': '+1' }],
                                        ['link', 'image', 'video'],
                                        ['clean']
                                    ],
                                    style: { fontFamily: 'Golos Text, sans-serif' }
                                },
                                clipboard: {
                                    matchVisual: false
                                }
                            }}
                            formats={[
                                'header', 'font', 'size',
                                'bold', 'italic', 'underline', 'strike', 'blockquote',
                                'list', 'bullet', 'indent',
                                'link', 'image', 'video'
                            ]}
                            placeholder="เริ่มเขียนบทความเลย!"
                        />
                        <p className='mt-2 text-red-600 text-sm text-right'>ขั้นต่ำ 250 คำ</p>
                        <div className="flex">
                            {/* <button className="py-3 rounded-xl mt-6 text-md bg-gradient-to-r font-ibm-thai
                ease-in-out duration-300 from-[#6e3f92] to-[#a94fa4] hover:marker:from-[#754798] hover:to-[#a65ea3] 
                text-white px-4" onClick={handlePreviwPopup}>แสดงตัวอย่าง</button> */}
                            <button className="py-3 rounded-xl mt-6 text-md bg-gradient-to-r font-ibm-thai
                ease-in-out duration-300 from-[#6e3f92] to-[#a94fa4] hover:marker:from-[#754798] hover:to-[#a65ea3] 
                text-white px-4" onClick={handlePublishBlog}>บันทึกและเผยแพร่</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ArticleCreate