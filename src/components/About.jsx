import "./HomeAssets/style.css"
import React, { useEffect } from "react"
import AboutUs from "./HomeAssets/AboutUs"
import { useNavigate,Link } from "react-router-dom"
const About = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const body = document.getElementById("star");
        let meteorNumber = 35;
        for (let i = 1; i <= meteorNumber; i++) {
            body.innerHTML += `<div class="meteor-${i}"></div>`;
        }
    },[]);
    return (
        <>
            <div className="w-full h-full relative overflow-hidden" id="star">
                <div className="h-screen w-full flex">
                    <div className="text-5xl lg:text-6xl font-ibm-thai font-semibold mx-auto mt-[15%] lg:mt-24 px-5 leading-[60px]">
                        <p className="text-white">แพลตฟอร์มการเรียนรู้ยุคใหม่</p>
                        <p className="text-white mt-6">ที่ทำให้อวกาศอยู่ใกล้แค่หน้าจอ</p>
                        <div className="mt-6">
                            <p className="text-xl font-normal text-gray-200 leading-8">เรามุ่งเน้นที่จะสร้างประสบการณ์ใหม่แห่งการเรียนรู้ดาราศาสตร์แก่คนทุกคน
                                มาเริ่มเรียนรู้กันเลยเถอะ</p>
                        </div>
                        <Link to="/select-simulate">
                        <button className="rounded-3xl text-lg bg-gradient-to-r px-6 py-2
                        from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white hover:px-7 ease-in-out duration-300"
                        >เริ่มต้นใช้งาน</button>
                        </Link>
                    </div>
                    <img src="/assets/about_page/telescope_mountain.png" className="absolute w-full xl:w-3/4 left-1/2 transform -translate-x-1/2 
            -z-10 -bottom-10"/>
                    <img src="/assets/about_page/hill.png" className="absolute w-full left-1/2 transform -translate-x-1/2 
            -bottom-16 -z-[12]" />
                    <img src="/assets/about_page/pure_sky.png" className="absolute -z-[15] w-full top-0 h-full"/>
                </div>
            </div>
            {/* <AboutUs/> */}
        </>
    )
}
export default About