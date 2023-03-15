import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../App';
import {CiSearch} from "react-icons/ci"
import { useNavigate } from 'react-router-dom';
const Post = () => {
    const navigate = useNavigate();
    const { userData, logged, setLogged, setUserData, userId } = useContext(UserContext)
    const dummyBlogData = [
        {
            id: 1,
            author: "Jack Sally",
            authorProfile: "https://play-lh.googleusercontent.com/nfIdgkZjC76XpbLvqcSSe15QtKCIEacTBijH_bQdTuJDX0ogBe-iB-MopQVTDBTWTrjB=w750-h750",
            date: "12 มกราคม 2566",
            title: "Astronomy Eiei Haha Wakuwu",
            content: `Contrary to popular belief, Lorem Ipsum is not simply random 
            text. It has roots in a piece of classical Latin literature from 45 BC, 
            making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia`,
            tags: ["Astrophysics", "High School", "NASA"],
            coverImage: "https://www.gizmodo.com.au/wp-content/uploads/sites/2/2021/08/05/spongebob.jpg",
            url:"/post/astronomy-eiei-haha-wakuwu"
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
            url:"/post/i-dont-like-saturn-because-satun-hate-me"
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
            url:"/post/astronomy-eiei-haha-wakuwu"
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
            url:"/post/astronomy-eiei-haha-wakuwu"
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
            url:"/post/astronomy-eiei-haha-wakuwu"
        },
    ]
    return (
        <div className="w-full h-full">
            <div className="w-full h-full max-w-6xl mx-auto mt-14 grid grid-cols-12">
                <div className="col-span-9 h-full">
                    <div className='w-full flex'>
                        <div className='flex p-2 rounded-xl bg-gray-100 w-3/4'>
                            <CiSearch className="text-xl my-auto"/>
                            <input className="w-full border-none bg-transparent outline-none font-ibm-thai text-gray-600 px-2 pt-1"
                            placeholder="ค้นหาบทความดาราศาสตร์"/>
                        </div>
                    </div>
                    <div className="w-full pr-20">
                        <div className='border-b-[1px] w-full p-2 pb-1'>
                            <p className='text-xl font-ibm-thai'>บทความ 💫</p>
                        </div>
                        <div id="blog-container">
                            {dummyBlogData.map((post) => (
                                <div className="px-2 py-6 font-ibm-thai grid grid-cols-12 border-b-[1px] cursor-pointer" key={post.id}>
                                    <div className="col-span-9">
                                        <div className="flex">
                                            <img src={post.authorProfile} alt="Author profile" className="w-8 rounded-full" />
                                            <p className="my-auto ml-2 font-semibold">{post.author} </p>
                                            <p className="my-auto ml-2 text-sm text-gray-400">{post.date}</p>
                                        </div>
                                        <p className="text-2xl my-1 font-bold" onClick={() => navigate(post.url)}>{post.title}</p>
                                        <p>{post.content.substring(0, 150)}{post.content.length > 150 && "..."}</p>
                                        <div className='flex mt-3' id="tag-container">
                                            {post.tags.map((tag, index) => (
                                                <div className="px-2 py-1 bg-gray-200 rounded-full text-gray-600 text-sm mr-2" key={index}>
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-3 flex">
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
                        {dummyBlogData.slice(0, 3).map((blog) => (
                            <div className='w-full mt-6 cursor-pointer'>
                                <div className="flex my-2">
                                    <img src={blog.authorProfile} className="w-8 rounded-full" />
                                    <p className='my-auto ml-2'>{blog.author}</p>
                                </div>
                                <p className="font-bold text-lg">{blog.title}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 bg-violet-100 text-center py-4 rounded-md">
                        <p>อยากแบ่งปันอะไรบางอย่างเกี่ยวกับดาราศาสตร์ให้คนอื่นอยู่ใช่ไหม ?</p>
                        <button className="rounded-xl text-lg bg-gradient-to-r px-6 py-2 font-ibm-thai mt-4
                        from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white"
                        onClick={()=>{navigate("/post/create")}}>เขียนบทความ</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Post