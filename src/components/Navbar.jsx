import { Link ,useNavigate} from "react-router-dom";
import { useContext,useEffect, useState } from "react";
import {UserContext} from "../App"
import {FaAngleDown} from 'react-icons/fa'
import { AiFillSetting } from "react-icons/ai";
const Navbar = () => {
    const {userData,logged,setLogged, setUserData,userId} = useContext(UserContext)
    const [toggleUserIcon,setToggleUserIcon] = useState(false);



    const navigate = useNavigate();
    const Logout=()=>{
        setToggleUserIcon(false);
        setLogged(false);
        setUserData(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('userData');
        window.location.reload();
        navigate("/");
    }

    return (
        <nav className="sticky w-full bg-white h-16 top-0 shadow-lg font-golos z-10">
            <div className="max-w-6xl mx-auto h-full flex justify-between relative">
                <div className="py-2 flex cursor-pointer">
                    <Link to="/"><img src="/logoAS.png" className="w-full h-full py-1" /></Link>
                    <p className="my-auto ml-2 font-bold text-2xl tracking-wider text-[#852E97]"><Link to="/">Astrodemy</Link></p>
                </div>
                <div className="h-full flex w-fit font-ibm-thai">
                    <div className="w-fit h-full flex mr-2 text-lg cursor-pointer text-gray-600 hover:text-gray-800">
                        <p className="my-auto mx-2 text-gray-600 hover:text-gray-800">เกี่ยวกับเรา</p>
                        <p className="my-auto mx-2 text-gray-600 hover:text-gray-800">
                            <Link to="/game">เกม</Link>
                        </p>
                        <p className="my-auto mx-2 text-gray-600 hover:text-gray-800">บทความ</p>
                        <p className="my-auto mx-2 text-gray-600 hover:text-gray-800">คอร์สออนไลน์</p>
                        <p className="my-auto mx-2 text-gray-600 hover:text-gray-800">แบบจำลอง 3D</p>
                    </div>
                    {!userData && logged===false ? <div className="flex">
                        <p className="my-auto mr-4 text-gray-600 hover:text-gray-800 text-lg cursor-pointer"><Link to="/register">ลงทะเบียน</Link></p>
                        <button className="rounded-3xl text-lg bg-gradient-to-r px-4 my-2
                        from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white"><Link to="/login">เข้าสู่ระบบ</Link></button>
                    </div>:null}
                    {userData? <div className="flex border-l-2 my-2 w-fit cursor-pointer relative hover:opacity-80">
                        <img src={userData.userProfile === "default" ? "/assets/default.png":userData.userProfile} 
                        className="ml-3 rounded-full my-" onClick={()=>setToggleUserIcon(prev=>!prev)}/>
                        <FaAngleDown className="absolute bg-white rounded-full
                        text-md p-[0.5px] bottom-0 -right-[2px] border-gray-100 border-[2px]"
                        onClick={()=>setToggleUserIcon(prev=>!prev)}/>
                        {/* <div className="h-fit bg-red-200 absolute w-full">
                            <p>hello</p>
                            <p>hello</p>
                            <p>hello</p>
                            <p>hello</p>
                        </div> */}
                    </div>:null}
                </div>
                {toggleUserIcon ? <div className="w-fit bg-white absolute pt-2 h-fit right-0 mt-[4.25rem]
                rounded-md shadow-md shadow-white">
                    <div className="py-2 px-4 font-ibm-thai text-lg flex"><AiFillSetting className="my-auto text-xl mr-2"/>
                    <p><Link to="/account">ตั้งค่าบัญชี</Link></p></div>
                    <p className="px-2"><button className="rounded-xl text-lg bg-gradient-to-r px-6 my-2 py-2 font-ibm-thai
                        from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white" onClick={Logout}>ออกจากระบบ </button></p>
                </div>:null}
            </div>
        </nav>
    )
}
export default Navbar