import { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../../App';
import { CiSearch } from "react-icons/ci"
import { useNavigate } from 'react-router-dom';
import { BsKeyboardFill } from "react-icons/bs"
import { MdArticle } from "react-icons/md"
import { FaRegWindowClose } from "react-icons/fa"
import { BsImage } from "react-icons/bs"
import {AiOutlineMessage} from "react-icons/ai"
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import 'firebase/firestore';

import axios from 'axios';
const Post = () => {
    const navigate = useNavigate();
    const { userData, logged, setLogged, setUserData, userId } = useContext(UserContext)
    const [blogData, setBlogData] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:3005/articles')
            .then(res => setBlogData(res.data))
            .catch(err => console.log(err));
    }, []);
    const dummyBlogData = [
        {
            id: 1,
            author: "Divinezing",
            authorProfile: "https://play-lh.googleusercontent.com/nfIdgkZjC76XpbLvqcSSe15QtKCIEacTBijH_bQdTuJDX0ogBe-iB-MopQVTDBTWTrjB=w750-h750",
            date: "12 มกราคม 2566",
            title: "ทำไมอวกาศถึงต้องเงียบหรอครับ เห็นในหนังก็มีเสียง หรือจริง ๆ แล้วอวกาศมีเสียง",
            content: `ตามหัวข้อเลยครับผมสงสัยมากทำไมหนังในอวกาศบางเรื่องถึงมีเสียง บางเรื่องก็ไม่มีเสียง หรือเพราะว่าอยากให้มีดูแฟนตาซีเลยต้องให้มีเสียงพวกยิงเลเซอร์
            ระเบิด แล้วถ้าเอาตามหลักความเป็นจริง หนังไซไฟมันจะไปสนุกอะไรหรอครับ`,
            tags: ["Astrophysics", "High School", "NASA"],
            coverImage: "https://www.kidjarak.com/wp-content/uploads/2022/09/interstellar-03.jpg",
            url: "astronomy-eiei-haha-wakuwu"
        },
        {
            id: 2,
            authorProfile: "https://thypix.com/wp-content/uploads/2021/11/sponge-bob-profile-picture-thypix-m.jpg",
            author: "Mass Mutock",
            date: "12 พฤษภา 2566",
            title: "I don't like Saturn because Satun hate me",
            content: `Contrary to popular belief, Lorem Ipsum is not simply random 
            text. It has roots in a piece of classical Latin literature from 45 BC, 
            making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia`,
            tags: ["NASA", "Planet"],
            coverImage: "https://www.infoquest.co.th/wp-content/uploads/2022/05/20220522_Canva_%E0%B8%8A%E0%B8%B1%E0%B8%8A%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4.png",
            url: "/post/i-dont-like-saturn-because-satun-hate-me"
        },
        {
            id: 2,
            authorProfile: "https://thypix.com/wp-content/uploads/2021/11/sponge-bob-profile-picture-thypix-m.jpg",
            author: "Mass Mutock",
            date: "12 พฤษภา 2566",
            title: "I don't like Saturn because Satun hate me",
            content: `Contrary to popular belief, Lorem Ipsum is not simply random 
            text. It has roots in a piece of classical Latin literature from 45 BC, 
            making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia`,
            tags: ["NASA", "Planet"],
            coverImage: "https://www.infoquest.co.th/wp-content/uploads/2022/05/20220522_Canva_%E0%B8%8A%E0%B8%B1%E0%B8%8A%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4.png",
            url: "/post/astronomy-eiei-haha-wakuwu"
        },
        {
            id: 2,
            authorProfile: "https://thypix.com/wp-content/uploads/2021/11/sponge-bob-profile-picture-thypix-m.jpg",
            author: "Mass Mutock",
            date: "12 พฤษภา 2566",
            title: "I don't like Saturn because Satun hate me",
            content: `Contrary to popular belief, Lorem Ipsum is not simply random 
            text. It has roots in a piece of classical Latin literature from 45 BC, 
            making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia`,
            tags: ["NASA", "Planet"],
            coverImage: "https://www.infoquest.co.th/wp-content/uploads/2022/05/20220522_Canva_%E0%B8%8A%E0%B8%B1%E0%B8%8A%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4.png",
            url: "/post/astronomy-eiei-haha-wakuwu"
        },
        {
            id: 2,
            authorProfile: "https://thypix.com/wp-content/uploads/2021/11/sponge-bob-profile-picture-thypix-m.jpg",
            author: "Mass Mutock",
            date: "12 พฤษภา 2566",
            title: "I don't like Saturn because Satun hate me",
            content: `Contrary to popular belief, Lorem Ipsum is not simply random 
            text. It has roots in a piece of classical Latin literature from 45 BC, 
            making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia`,
            tags: ["NASA", "Planet"],
            coverImage: "https://www.infoquest.co.th/wp-content/uploads/2022/05/20220522_Canva_%E0%B8%8A%E0%B8%B1%E0%B8%8A%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4.png",
            url: "/post/astronomy-eiei-haha-wakuwu"
        },
    ]

    const [createBoard, setCreateBoard] = useState(false);
    const [option, setOption] = useState(1);
    const createBoardRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (createBoardRef.current && !createBoardRef.current.contains(event.target)) {
                setCreateBoard(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [createBoardRef]);
    const [hoverChange, setHoverChange] = useState(false);
    const [preview, setPreview] = useState(null);
    const [coverUpload, setCoverUpload] = useState(false);
    const [coverUrl, setCoverUrl] = useState("");
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_API_KEY,
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_PROJECT_ID,
        storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_APP_ID,
        measurementId: process.env.REACT_APP_MEASUREMENT_ID
    };
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
    const [boardTitle,setBoardTitle] = useState("");
    const [boardContent,setBoardContent] = useState("");
    const handlePublishBoard = () => {
        axios.post('http://localhost:3005/create_board', {
                    
                })
    }
    return (
        <>
            {createBoard && (
                <div className="fixed z-[50] w-full h-full flex bg-transparent top-0">
                    <div className="w-full h-full z-[15] absolute flex bg-black bg-opacity-50">
                        <div className="max-w-4xl w-full min-h-screen m-auto mt-[5%]" ref={createBoardRef}>
                            <div className="bg-white w-full h-full rounded-3xl relative pt-5 py-5" data-aos="fade-up">
                                <div className="absolute top-4 right-4 cursor-pointer" onClick={() => { setCreateBoard(false) }}>
                                    <FaRegWindowClose className="text-4xl text-red-400" />
                                </div>
                                <p className="text-center font-ibm-thai text-2xl mt-5">สร้างกระดานใหม่</p>
                                <div className='w-1/2 h-[300px] mt-5 relative mx-auto'>
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
                                <input type="text" className="w-full border-none bg-transparent font-bold outline-none font-ibm-thai text-gray-800 
                                mt-4 ml-10 text-2xl mb-2 leading-[0px]" placeholder="หัวเรื่อง" 
                                onChange={(e) => { setBoardTitle(e.target.value) }} />
                                <div className='px-10'>
                                <textarea rows="5" className="w-full bg-transparent outline-none font-ibm-thai text-gray-600
                                text-lg bg-gray-100 border-2 rounded-md px-2 py-2" placeholder="เนื้อหา" 
                                onChange={(e) => { setBoardContent(e.target.value) }} />
                                <button className="py-3 rounded-xl text-md bg-gradient-to-r font-ibm-thai
                ease-in-out duration-300 from-[#6e3f92] to-[#a94fa4] hover:marker:from-[#754798] hover:to-[#a65ea3] 
                text-white px-4">เผยแพร่</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full h-full relative">

                <div className="h-full w-fit px-5 fixed">
                    <div className='flex ml-2'>
                        <img src={userData && userData.userProfile} className="w-8 rounded-full" />
                        <p className='font-ibm-thai my-auto ml-2 font-bold'>{userData && userData.username}</p>
                    </div>
                    <div className={`ml-2 w-fit flex font-ibm-thai mt-4 pl-2 pr-6 py-1 hover:${option === 1 ? "" : "bg-gray-100"}
                cursor-pointer rounded-md ${option === 1 && "bg-gray-200"}`} onClick={() => { setOption(1) }}>
                        <MdArticle className="text-2xl my-auto text-blue-600" />
                        <p className='text-lg ml-3'>บทความ</p>
                    </div>
                    <div className={`ml-2 w-fit flex font-ibm-thai mt-1 pl-2 pr-6 py-1 hover:${option === 2 ? "" : "bg-gray-100"}
                cursor-pointer rounded-md ${option === 2 && "bg-gray-200"}`} onClick={() => { setOption(2) }}>
                        <BsKeyboardFill className="text-2xl my-auto text-red-500" />
                        <p className='text-lg ml-3'>กระดาน</p>
                    </div>
                </div>
                {option === 1 && userData && blogData &&
                    <div className="w-full h-full max-w-5xl 2xl:max-w-6xl mx-auto mt-14 grid grid-cols-12">
                        <div className="col-span-9 h-full">
                            <div className='w-full flex'>
                                <div className='flex p-2 rounded-xl bg-gray-100 w-3/4'>
                                    <CiSearch className="text-xl my-auto" />
                                    <input className="w-full border-none bg-transparent outline-none font-ibm-thai text-gray-600 px-2 pt-1"
                                        placeholder="ค้นหาบทความดาราศาสตร์" />
                                </div>
                            </div>
                            <div className="w-full pr-20">
                                <div className='border-b-[1px] w-full p-2 pb-1 mt-4'>
                                    <p className='text-xl font-ibm-thai'>บทความ 💫</p>
                                </div>
                                <div id="blog-container">
                                    {blogData && blogData.map((post) => (
                                        <div className="px-2 py-6 font-ibm-thai grid grid-cols-12 border-b-[1px] cursor-pointer" key={post.id}>
                                            <div className="col-span-9">
                                                <div className="flex">
                                                    <img src={post.authorProfile} alt="Author profile" className="w-8 rounded-full" />
                                                    <p className="my-auto ml-2 font-semibold">{post.author} </p>
                                                    <p className="my-auto ml-2 text-sm text-gray-400">{post.date}</p>
                                                </div>
                                                <p className="text-2xl my-1 font-bold" onClick={() => navigate("/post/" + post.path)}>{post.title}</p>
                                                <p onClick={() => navigate("/post/" + post.path)}>{new DOMParser().parseFromString(post.content, 'text/html').body.innerText.substring(0, 150)}{post.content.length > 150 && "..."}</p>
                                                {/* <div className='flex mt-3' id="tag-container">
                                        {post.tags.map((tag, index) => (
                                            <div className="px-2 py-1 bg-gray-200 rounded-full text-gray-600 text-sm mr-2" key={index}>
                                                {tag}
                                            </div>
                                        ))}
                                    </div> */}
                                            </div>
                                            <div onClick={() => navigate("/post/" + post.path)} className="col-span-3 flex">
                                                <img src={post.coverImage} className="my-auto" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3 h-full font-ibm-thai">
                            <p>กำลังมาแรง 🚀</p>
                            <div className="">
                                {blogData && blogData.slice(0, 3).map((post) => (
                                    <div className='w-full mt-6 cursor-pointer'>
                                        <div className="flex my-2">
                                            <img src={post.authorProfile} className="w-8 rounded-full" />
                                            <p className='my-auto ml-2'>{post.author}</p>
                                        </div>
                                        <p onClick={() => navigate("/post/" + post.path)} className="font-bold text-lg">{post.title}</p>
                                        <p onClick={() => navigate("/post/" + post.path)}>{new DOMParser().parseFromString(post.content, 'text/html').body.innerText.substring(0, 60)}{post.content.length > 60 && "..."}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 bg-violet-100 text-center py-4 rounded-md">
                                <p>อยากแบ่งปันอะไรบางอย่างเกี่ยวกับดาราศาสตร์ให้คนอื่นอยู่ใช่ไหม ?</p>
                                <button className="rounded-xl text-lg bg-gradient-to-r px-6 py-2 font-ibm-thai mt-4
                    from-[#6e3f92] to-[#a94fa4]
                    hover:marker:from-[#754798] hover:to-[#a65ea3] text-white"
                                    onClick={() => { navigate("/post/create") }}>เขียนบทความ</button>
                            </div>
                        </div>
                    </div>}
                {option === 2 && userData && blogData &&
                    <div className="w-full h-full max-w-4xl mx-auto mt-14 grid grid-cols-9">
                        <div className="col-span-full h-full">
                            <div className="w-full pr-20">
                                <div className='w-full flex'>
                                    <div className='flex p-2 rounded-lg bg-gray-100 w-3/4 mx-auto'>
                                        <CiSearch className="text-xl my-auto" />
                                        <input className="w-full border-none bg-transparent outline-none font-ibm-thai text-gray-600 px-2 pt-1"
                                            placeholder="ค้นหาการพูดคุยเกี่ยวกับดาราศาสตร์" />
                                    </div>
                                </div>

                                <div className='w-full p-2 pb-1 mt-10'>
                                    <p className='text-2xl font-ibm-thai'>กระดาน 💫</p>
                                </div>
                                <div id="blog-container">
                                    <div className='w-full p-2 bg-gray-50 rounded-md flex cursor-pointer mb-6'>
                                        <img src={userData.userProfile} className="w-10 rounded-full" />
                                        <input className='w-full bg-gray-100 rounded-md rounded-l-none ml-2 flex border-[1px] my-auto 
                        font-ibm-thai text-gray-400 px-2 outline-none py-1 hover:outline-blue-200 focus:outline-blue-200'
                                            placeholder='สร้างกระดานใหม่' onClick={() => { setCreateBoard(true) }} />
                                    </div>

                                    {blogData && dummyBlogData.map((post) => (
                                        <div className="border-gray-200 border-[1.5px] px-10 pt-10 pb-5 font-ibm-thai grid grid-cols-12 
                            cursor-pointer my-4 rounded-lg shadow-sm"
                                            key={post.id}>
                                            <div className="col-span-full">
                                                <div className="flex">
                                                    <img src={post.authorProfile} alt="Author profile" className="w-8 rounded-full" />
                                                    <p className="my-auto ml-2 font-semibold">{post.author} </p>
                                                    <p className="my-auto ml-2 text-sm text-gray-400">{post.date}</p>
                                                </div>
                                                <p className="text-2xl my-1 font-bold" onClick={() => navigate("/post/" + post.path)}>{post.title}</p>
                                                <p onClick={() => navigate("/post/" + post.path)}>{new DOMParser().parseFromString(post.content, 'text/html').body.innerText.substring(0, 150)}{post.content.length > 150 && "..."}</p>
                                                {/* <div className='flex mt-3' id="tag-container">
                                        {post.tags.map((tag, index) => (
                                            <div className="px-2 py-1 bg-gray-200 rounded-full text-gray-600 text-sm mr-2" key={index}>
                                                {tag}
                                            </div>
                                        ))}
                                    </div> */}
                                            </div>
                                            <div onClick={() => navigate("/post/" + post.path)} className="col-span-full flex">
                                                <img src={post.coverImage} className="my-auto" />
                                            </div>
                                            <div className='col-span-full mt-4'>
                                                <div className='text-gray-600 flex'>
                                                    <AiOutlineMessage className='text-xl mr-2'/>
                                                    <p>0 แสดงความคิดเห็น</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>}
            </div>
        </>
    )
}
export default Post