import { StarSky } from "./components/StarSky"
import { useNavigate } from "react-router-dom"
import {BsFillPlusCircleFill} from "react-icons/bs"
import { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from "./App";
const Select3D = () => {
    const navigate = useNavigate(); 
    const { userData, logged, setLogged, setUserData,role,setRole,calendarNoti,setCalendarNoti } = useContext(UserContext);

  return (
    <div>
        <div className="max-w-5xl m-auto h-fit my-auto grid grid-cols-12 z-[20] relative" data-aos="fade-up" data-aos-delay="300">
        <div className="col-span-full text-center mt-16">
          <img src="/assets/AstroSIM.png" className="w-52 mx-auto" data-aos="fade-down" data-aos-delay="200" />
        </div>
        <div className="col-span-full pl-6 font-ibm-thai text-2xl text-white -mb-6">
            <p>แบบจำลองจาก Astrodemy</p>
        </div>
        <div className={`col-span-4 px-5 hover:opacity-100 cursor-pointer mt-10 hover:mt-4 ease-in-out duration-300 relative 
        `}
          onClick={()=>{navigate("/simulate")}}>
          <img src="/assets/3d-cover-1.png" className="rounded-3xl ease-in-out duration-300 rounded-b-none hover:border-2"
          />
            <div className="w-full bg-white py-2 rounded-b-xl" >
            <p className="font-ibm-thai text-black text-xl text-center">แบบจำลองดาวเคราะห์ <br/>ในระบบสุริยะ</p>
            </div>
        </div>
        <div className="col-span-4 px-5 hover:opacity-100 cursor-pointer mt-10 hover:mt-4 ease-in-out duration-300"
        onClick={()=>{navigate("/moon-cycle")}}>
          <img src="/assets/3d-cover-2.png" className="rounded-3xl ease-in-out duration-300  rounded-b-none hover:border-2"
            />
            <div className="w-full bg-white py-2 rounded-b-xl" >
            <p className="font-ibm-thai text-black text-xl text-center">แบบจำลองการเปลี่ยนรูปร่าง <br/>ของดวงจันทร์</p>
            </div>
        </div>
        <div className="col-span-4 px-5 hover:opacity-100 cursor-pointer mt-10 hover:mt-4 ease-in-out duration-300 "
        onClick={()=>{navigate("/life-cycle")}}>
          <img src="/assets/3d-cover-3.png" className="rounded-3xl ease-in-out duration-300  rounded-b-none hover:border-2"
            />
            <div className="w-full bg-white py-2 rounded-b-xl" >
            <p className="font-ibm-thai text-black text-xl text-center">แบบจำลองวัฏจักร<br/>ของดาวฤกษ์</p>
            </div>
        </div>
        {userData && role==="teacher" && <div className="col-span-full pl-6 font-ibm-thai text-2xl text-white mt-6">
            <p>แบบจำลองของคุณ</p>
        </div>}
       {userData && role==="teacher" &&  <div className="col-span-4 px-5 hover:opacity-100 cursor-pointer mt-2 ease-in-out duration-300 mb-4 relative"
        onClick={()=>{navigate("/create-3d")}}>
          <img src="/assets/3d-cover-3.png" className="rounded-3xl ease-in-out duration-300  rounded-b-none hover:border-2 opacity-20"
            />
            <BsFillPlusCircleFill className="absolute text-5xl top-[40%] left-[43%] text-white opacity-40 hover:opacity-80"/>
          <div className="w-full bg-white py-2 rounded-b-xl" >
            <p className="font-ibm-thai text-black text-xl text-center">สร้างแบบจำลองทางดาราศาสตร์</p>
            </div>
        </div>}
      </div>
      <div className="absolute top-0 left-0 -z-[10] w-full h-full">
        <StarSky/>
      </div>
    </div>
  )
}
export default Select3D