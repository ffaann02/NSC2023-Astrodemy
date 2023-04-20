import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App"
import { FaAngleDown } from 'react-icons/fa'
import { AiFillSetting } from "react-icons/ai";
import { GiHamburgerMenu ,GiCancel} from "react-icons/gi"
import { IoMdNotificationsOutline, IoMdNotifications} from "react-icons/io"
import {IoGameControllerSharp,IoPlanetSharp} from "react-icons/io5"
import { MdArticle ,MdManageAccounts} from "react-icons/md"
import {BsFillCalendarCheckFill} from "react-icons/bs"
const Navbar = () => {
    const { userData, logged, setLogged, setUserData, userId } = useContext(UserContext)
    const [toggleUserIcon, setToggleUserIcon] = useState(false);
    const [toggleNotiIcon, setToggleNotiIcon] = useState(false);
    const navigate = useNavigate();
    const Logout = () => {
        setToggleUserIcon(false);
        setLogged(false);
        setUserData(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('userData');
        window.location.reload();
        navigate("/");
    }
    const [toggleMobile, setToggleMobile] = useState(false);
    return (
        <>
            {toggleMobile &&
                <div className="w-full h-full bg-white absolute z-[2000] p-5 pl-3" data-aos="fade-down">
                    <GiCancel className="absolute text-3xl text-red-400 right-2 top-2" onClick={()=>{setToggleMobile(false)}}/>
                    <Link to="/">
                    <div className="flex" onClick={()=>{setToggleMobile(false)}}>
                        <img src="/logoAS.png" className="w-14" />
                        <p className="text-3xl font-bold font-ibm-thai my-auto ml-2 tracking-wider text-[#852E97]">Astrodemy</p>
                    </div>
                    </Link>
                    <Link to="/post">
                    <div className="pl-3 font-ibm-thai mt-4" onClick={()=>{setToggleMobile(false)}}>
                        <div className="flex">
                            <MdArticle className="text-2xl text-purple-800" />
                            <p className="text-xl pl-2">โพสต์</p>
                        </div>
                    </div>
                    </Link>
                    <Link to="game">
                    <div className="pl-3 font-ibm-thai mt-4" onClick={()=>{setToggleMobile(false)}}>
                        <div className="flex">
                            <IoGameControllerSharp className="text-2xl text-purple-800" />
                            <p className="text-xl pl-2">เกม</p>
                        </div>
                    </div>
                    </Link>
                    <Link to="calendar">
                    <div className="pl-3 font-ibm-thai mt-4" onClick={()=>{setToggleMobile(false)}}>
                        <div className="flex">
                            <BsFillCalendarCheckFill className="text-2xl text-purple-800" />
                            <p className="text-xl pl-2">ปฏิทิน</p>
                        </div>
                    </div>
                    </Link>
                    <Link to="/select-simulate">
                    <div className="pl-3 font-ibm-thai mt-4" onClick={()=>{setToggleMobile(false)}}>
                        <div className="flex">
                            <IoPlanetSharp className="text-2xl text-purple-800" />
                            <p className="text-xl pl-2">แบบจำลอง 3D</p>
                        </div>
                    </div>
                    </Link>
                    <Link to="/account">
                    <div className="pl-3 font-ibm-thai mt-4" onClick={()=>{setToggleMobile(false)}}>
                        <div className="flex">
                            <MdManageAccounts className="text-2xl text-purple-800" />
                            <p className="text-xl pl-2">บัญชี</p>
                        </div>
                    </div>
                    </Link>
                </div>}
            <nav className="sticky w-full bg-white h-16 top-0 shadow-lg font-golos z-[500]">
                <div className="max-w-4xl lg:max-w-6xl mx-auto h-full flex justify-between relative xl:px-0 md:px-5 px-2">
                    <div className="py-2 flex cursor-pointer">
                        <Link to="/"><img src="/logoAS.png" className="w-full h-full py-1" /></Link>
                        <p className="my-auto ml-2 font-bold text-2xl tracking-wider text-[#852E97]"><Link to="/">Astrodemy</Link></p>
                    </div>
                    <GiHamburgerMenu className="text-3xl my-auto text-violet-900 cursor-pointer block lg:hidden"
                        onClick={() => { setToggleMobile(true) }} />
                    <div className="h-full w-fit font-ibm-thai lg:flex hidden">
                        <div className="w-fit h-full flex mr-2 text-lg cursor-pointer text-gray-600 hover:text-gray-800">
                            {/* <p className="my-auto mx-2 text-gray-600 hover:text-gray-800">เกี่ยวกับเรา</p> */}
                            <p className="my-auto mx-2 text-gray-600 hover:text-gray-800">
                                <Link to="/post">โพสต์</Link>
                            </p>
                            <p className="my-auto mx-2 text-gray-600 hover:text-gray-800">
                                <Link to="/game">เกม</Link>
                            </p>
                            <p className="my-auto mx-2 text-gray-600 hover:text-gray-800"><Link to="/calendar">ปฏิทิน</Link></p>
                            <p className="my-auto mx-2 text-gray-600 hover:text-gray-800"><Link to="/select-simulate">แบบจำลอง 3D</Link></p>
                        </div>
                        {!userData && logged === false ? <div className="flex">
                            <p className="my-auto mr-4 text-gray-600 hover:text-gray-800 text-lg cursor-pointer"><Link to="/register">ลงทะเบียน</Link></p>
                            <button className="rounded-3xl text-lg bg-gradient-to-r px-4 my-2
                        from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white"><Link to="/login">เข้าสู่ระบบ</Link></button>
                        </div> : null}
                        {userData ? <div className="flex border-l-2 my-2 w-fit cursor-pointer relative">
                            <img src={userData.userProfile === "default" ? "/assets/default.png" : userData.userProfile}
                                className="ml-3 rounded-full" onClick={() => setToggleUserIcon(prev => !prev)} />
                            <FaAngleDown className="absolute bg-white rounded-full
                        text-md p-[0.5px] bottom-0 right-9 border-gray-100 border-[2px]"
                                onClick={() => setToggleUserIcon(prev => !prev)} />
                            <div className="bg-red-600 w-5 h-5 rounded-full flex absolute -right-3 top-1">
                                <p className="m-auto text-xs font-bold mt-[2.5px] text-white">2</p>
                            </div>
                            <div className="my-auto ml-3 bg-gray-100 p-1 rounded-full" onClick={() => setToggleNotiIcon(prev => !prev)}>
                                <IoMdNotificationsOutline className="text-xl text-black" />
                            </div>
                        </div> : null}
                    </div>
                    {toggleUserIcon ? <div className="w-fit bg-white absolute pt-2 h-fit right-0 top-[4.25rem] border-[1px] border-t-0
                rounded-md shadow-md shadow-white z-[501]" onMouseLeave={()=>{setToggleUserIcon(false)}}>
                        <div className="py-2 px-4 font-ibm-thai text-lg flex"><AiFillSetting className="my-auto text-xl mr-2" />
                            <p onClick={() => { setToggleUserIcon(false) }}><Link to="/account">ตั้งค่าบัญชี</Link></p></div>
                        <p className="px-2"><button className="rounded-xl text-lg bg-gradient-to-r px-6 my-2 py-2 font-ibm-thai
                        from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white" onClick={Logout}>ออกจากระบบ </button>
                        </p>
                    </div> : null}
                    {toggleNotiIcon ?
                        <div className="w-fit bg-white absolute pt-2 h-fit right-0 top-[4.25rem]
                rounded-md shadow-md s z-[501]" onMouseLeave={()=>{setToggleNotiIcon(false)}} 
                onMouseOut={()=>{setToggleNotiIcon(false)}}>
                            <div className="py-2 px-4 font-ibm-thai text-lg flex flex-col">
                                <p className="text-center mb-2">แจ้งเตือนวันนี้</p>
                                <div className="py-2 border-[1px] border-r-[0px] border-l-[0px] px-2">
                                    <p className="text-lg">วันแรม 15 ค่ำ</p>
                                    {/* <p className="text-sm">ไม่พบการแจ้งเตือน</p> */}
                                </div>
                                <div className="py-2 border-[1px] border-r-[0px] border-l-[0px] px-2">
                                    <p className="text-lg">สุริยุปราคาแบบผสม</p>
                                    {/* <p className="text-sm">ไม่พบการแจ้งเตือน</p> */}
                                </div>
                                {/* <p onClick={()=>{setToggleUserIcon(false)}}><Link to="/account">ตั้งค่าบัญชี</Link></p> */}
                            </div>
                            {/* <p className="px-2"><button className="rounded-xl text-lg bg-gradient-to-r px-6 my-2 py-2 font-ibm-thai
                        from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white" onClick={Logout}>ออกจากระบบ </button>
                    </p> */}
                        </div> : null}
                </div>
            </nav>
        </>
    )
}
export default Navbar