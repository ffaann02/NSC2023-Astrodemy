import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StarSky } from "./StarSky";
import { FaRegWindowClose } from "react-icons/fa"
import {RiCoinFill} from "react-icons/ri"
import { BsFillRocketTakeoffFill } from "react-icons/bs"
import {AiOutlineQuestionCircle} from "react-icons/ai"
import {IoMdPlanet} from "react-icons/io"
import {MdStars} from "react-icons/md"
const Game = () => {
  const navitage = useNavigate();
  const [popupGame, setPopupGame] = useState(0);
  const popupRef = useRef(null);
  const handlePopup = () => {
    setPopupGame(true);
  }
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupGame(0);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);
  return (
    <div className="w-full  min-h-screen relative">
      {popupGame===1 && (
        <div className="fixed z-[50] w-full h-full flex bg-transparent">
          <div className="w-full h-full z-[15] absolute flex bg-black bg-opacity-50">
            <div className="max-w-4xl w-full h-full pb-20 pt-10 m-auto" ref={popupRef}>
              <div className="bg-white w-full h-fit rounded-3xl relative pt-5 py-5" data-aos="fade-up">
                <div className="absolute top-4 right-4 cursor-pointer" onClick={() => { setPopupGame(false) }}>
                  <FaRegWindowClose className="text-4xl text-red-400" /></div>
                <img src="/assets/AstroPuzzle.png" className="w-52 mx-auto pt-4" />
                <div className="px-10 pt-10 font-ibm-thai grid grid-cols-6 relative h-full">
                  <div className="col-span-3 pr-10">
                    <p className="text-2xl font-bold">คำอธิบายเกม</p>
                    <p className="text-md mt-2">เกมปริศนาลับสมองในเรื่องของดาราศาสตร์ ดาราศาสตร์เป็นเรื่องที่กว้างขวาง หากจะไม่ให้เปิดอินเตอร์เน็ต
                    ตอนเล่นคงจะยากหน่อย เกมนี้อนุญาตให้คุณเปิดอินเตอร์เน็ตเพื่อค้นหาข้อมูล แต่ค้นหาให้เร็วละ! เพราะเกมนี้คนที่ไวที่สุดเท่านั้นถึงจะชนะ</p>
                    <p className="text-2xl font-bold mt-16">กฎและวิธีการเล่น</p>
                    <p className="text-md mt-2">
                      <ul className="list-outside text-lg">
                        <li className="flex"><BsFillRocketTakeoffFill className="my-auto text-violet-800" />
                          <p className="ml-2">รูปแบบเกม: Multiplayer</p>
                        </li>
                        <li className="flex mt-1"><BsFillRocketTakeoffFill className="my-auto text-violet-800" />
                          <p className="ml-2">เวลาไม่จำกัด แต่ผู้ชนะคือคนที่เร็วสุด</p>
                        </li>
                        <li className="flex mt-1"><BsFillRocketTakeoffFill className="my-auto text-violet-800" />
                          <p className="ml-2">ใช้่ไหวพริบ ความเร็วและความรู้รอบตัว</p>
                        </li>
                      </ul>
                    </p>
                  </div>
                  <div className="col-span-3">
                  <p className="text-2xl font-bold mb-2">ตัวอย่างเกมเพลย์</p>
                  <img src="/assets/puzzle_game_page/puzzle-example.png" className="w-[80%] border-2 rounded-xl"/>
                    <p className="text-2xl font-bold mb-2 mt-2">ทำไมต้องเล่น ?</p>
                    <ul className="list-outside text-lg">
                        <li className="flex"><MdStars className="my-auto text-yellow-600" />
                          <p className="ml-2 flex">ลุ้น AstroCoin<p className="ml-1">ในบางเกมโหมด</p>
                          <AiOutlineQuestionCircle 
                          className="ml-1 text-sm my-auto"/></p>
                        </li>
                        <li className="flex mt-1"><IoMdPlanet className="my-auto text-blue-600" />
                          <p className="ml-2">ทดสอบความเป็นนักดาราศาสตร์ในตัวคุณ</p>
                        </li>
                      </ul>
                  </div>
                  <div className="text-center w-full col-span-full mt-4">
                  <button className="py-3 rounded-xl mt-6 text-lg bg-gradient-to-r font-ibm-thai hover:px-5
                ease-in-out duration-300 from-[#6e3f92] to-[#a94fa4] hover:text-xl
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white px-4"
                    onClick={() => { navitage("/game/puzzle") }}>เล่นเกมเลย</button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {popupGame===2 && (
        <div className="fixed z-[50] w-full h-full flex bg-transparent">
          <div className="w-full h-full z-[15] absolute flex bg-black bg-opacity-50">
            <div className="max-w-4xl w-full h-full pb-20 pt-10 m-auto" ref={popupRef}>
              <div className="bg-white w-full h-fit rounded-3xl relative pt-5 py-5" data-aos="fade-up">
                <div className="absolute top-4 right-4 cursor-pointer" onClick={() => { setPopupGame(false) }}>
                  <FaRegWindowClose className="text-4xl text-red-400" /></div>
                <img src="/assets/drawing-game_page/AstroDraw.png" className="w-40 mx-auto pt-4" />
                <div className="px-10 pt-10 font-ibm-thai grid grid-cols-6 relative h-full">
                  <div className="col-span-3 pr-10">
                    <p className="text-2xl font-bold">คำอธิบายเกม</p>
                    <p className="text-md mt-2">เกมวาดรูปเกี่ยวกับดาราศาตร์ให้ผู้เล่นคนอื่นทาย แม้คุณรู้จักดาวเคราะห์หรือสิ่งอื่น ๆ ในระบบสุริยะ
                    แล้วคิดว่าการเล่นเกมนี้ง่ายขึ้นหรอกนะ คุณต้องถ่ายทอดสิ่งนั้นด้วยจินตนาการให้คนอื่นเข้าใจด้วย!</p>
                    <p className="text-2xl font-bold mt-10">กฎและวิธีการเล่น</p>
                    <p className="text-md mt-2">
                      <ul className="list-outside text-lg">
                        <li className="flex"><BsFillRocketTakeoffFill className="my-auto text-violet-800" />
                          <p className="ml-2">รูปแบบเกม: Multiplayer สลับกันวาดและทาย</p>
                        </li>
                        <li className="flex mt-1"><BsFillRocketTakeoffFill className="my-auto text-violet-800" />
                          <p className="ml-2">เวลา: 60 วินาที / 1 ข้อ</p>
                        </li>
                        <li className="flex mt-1"><BsFillRocketTakeoffFill className="my-auto text-violet-800" />
                          <p className="ml-2">ใช้่จินตนาการและความไว</p>
                        </li>
                      </ul>
                    </p>
                  </div>
                  <div className="col-span-3">
                  <p className="text-2xl font-bold">ตัวอย่างเกมเพลย์</p>
                  <img src="/assets/drawing-game_page/example-gameplay.png" className="w-[90%] border-2 rounded-xl"/>
                    <p className="text-2xl font-bold mt-2">ทำไมต้องเล่น ?</p>
                    <ul className="list-outside text-lg">
                        <li className="flex"><MdStars className="my-auto text-yellow-600" />
                          <p className="ml-2 flex">ลุ้น AstroCoin<p className="ml-1">ในบางเกมโหมด</p>
                          <AiOutlineQuestionCircle 
                          className="ml-1 text-sm my-auto"/></p>
                        </li>
                        <li className="flex mt-1"><IoMdPlanet className="my-auto text-blue-600" />
                          <p className="ml-2">ปลดปล่อยจินตนาการทางดาราศาสตร์</p>
                        </li>
                      </ul>
                  </div>
                  <div className="text-center w-full col-span-full mt-6">
                  <button className="py-3 rounded-xl mt-6 text-lg bg-gradient-to-r font-ibm-thai hover:px-5
                ease-in-out duration-300 from-[#6e3f92] to-[#a94fa4] hover:text-xl
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white px-4"
                    onClick={() => { navitage("/game/drawing") }}>เล่นเกมเลย</button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="md:max-4-xl xl:max-w-5xl m-auto h-fit grid grid-cols-12 z-[20] relative " id="game-block">
        <div className="col-span-full text-center mt-16">
          <img src="/assets/drawing-game_page/AstroArcade.png" className="w-52 mx-auto" data-aos="fade-down" data-aos-delay="200" />
        </div>
        <div className={`col-span-full md:col-span-6 px-5 opacity-80 hover:opacity-100 cursor-pointer mt-10 hover:mt-4 ease-in-out duration-300
        `}
          onClick={() => { setPopupGame(1) }}>
          <img src="/assets/drawing-game_page/quiz-game-cover.png" className="rounded-3xl ease-in-out duration-300 hover:border-4 border-blue-500"
            data-aos="fade-right" data-aos-delay="300" />
        </div>
        <div className="col-span-full md:col-span-6 px-5 opacity-80 hover:opacity-100 cursor-pointer mt-10 hover:mt-4 ease-in-out duration-300"
        onClick={() => { setPopupGame(2) }}>
          <img src="/assets/drawing-game_page/drawing-game-cover.png" className="rounded-3xl ease-in-out duration-300 hover:border-4 border-blue-500"
            data-aos="fade-left" data-aos-delay="300" />
        </div>
      </div>
      <div className="absolute top-0 left-0 -z-[10] w-full min-h-screen h-full">
        <StarSky />
      </div>
    </div>
  )
}
export default Game