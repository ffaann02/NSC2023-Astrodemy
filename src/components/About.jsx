import "./HomeAssets/style.css"
import React, { useEffect } from "react"
const About = () => {
    // useEffect(() => {
    //     const body = document.getElementById("star");
    //     let meteorNumber = 35;
    //     for (let i = 1; i <= meteorNumber; i++) {
    //         body.innerHTML += `<div class="meteor-${i}"></div>`;
    //     }
    // },[]);
    return (
        <div className="w-full h-full relative overflow-hidden" id="star">
            <div className="h-screen w-full flex">
                <div className="text-6xl font-ibm-thai font-bold mx-auto mt-24 ">
                    <p className="text-white">แพลตฟอร์มการเรียนรู้ยุคใหม่</p>
                    <p className="text-white mt-6">ที่ทำให้อวกาศอยู่ใกล้แค่หน้าจอ</p>
                    <div className="mr-[25%] mt-6">
                    <p className="text-xl font-normal text-gray-200 leading-8">เรามุ่งเน้นที่จะสร้างประสบการณ์ใหม่แห่งการเรียนรู้ดาราศาสตร์แก่คนทุกคน
                    มาเริ่มเรียนรู้กันเลยเถอะ!</p>
                    </div>
                    <button className="rounded-3xl text-lg bg-gradient-to-r px-6 py-2
                        from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white">เริ่มต้นใช้งาน</button>
                </div>
                <img src="/assets/about_page/telescope_mountain.png" className="absolute w-3/4 left-1/2 transform -translate-x-1/2 
            -z-10 -bottom-10"/>
                <img src="/assets/about_page/hill.png" className="absolute w-full left-1/2 transform -translate-x-1/2 
            -bottom-16 -z-[12]"/>
            </div>
            <img src="/assets/about_page/pure_sky.png" className="absolute -z-[15] w-full top-0 h-full"/>
        </div>
    )
}
export default About