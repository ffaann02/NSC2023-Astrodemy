import { useState,useEffect } from "react"
import axios from "axios";
const Admin = () => {
    const [stage,setStage] = useState(0);
    const [boardsData,setBoardsData] = useState([]);
    const [articlesData,setArticlesData] = useState([]);
    const [upgradeRoleData,setUpgradeRoleData] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:3005/articles')
            .then(res => {
                setArticlesData(res.data)
            })
            .catch(err => console.log(err));
    }, []);
    useEffect(() => {
        axios.get('http://localhost:3005/boards')
            .then(res => setBoardsData(res.data))
            .catch(err => console.log(err));
    }, []);
  return (
    <div className="w-full h-full flex font-ibm-thai">
        <div className="max-w-5xl w-full h-full min-h-screen bg-gray-50 mx-auto mt-10 rounded-md 
        border-t-[1px] border-gray-100 drop-shadow-md">
            <p className="text-center text-2xl mt-8 font-semibold mb-2">Dashboard สำหรับ Admin</p>
            <div className="w-full max-w-[30%] bg-gray-100 mx-auto px-2 py-3 border-[1px] rounded-lg grid grid-cols-3">
                <div className="col-span-1 px-2"> 
                   <p className={`text-center underline-offset-2 ${stage===0 && "underline"} cursor-pointer`}
                   onClick={()=>{setStage(0)}}>บทความ</p>
                </div>
                <div className="col-span-1 px-2">
                   <p className={`text-center underline-offset-2 ${stage===1 && "underline"} cursor-pointer`}
                   onClick={()=>{setStage(1)}}>บอร์ด</p>
                </div>
                <div className="col-span-1 px-2">
                   <p className={`text-center underline-offset-2 ${stage===2 && "underline"} cursor-pointer`}
                   onClick={()=>{setStage(2)}}>เลื่อนขั้น</p>
                </div>
            </div>
            {stage===0 && articlesData && 
            <div className="px-10 pt-6">
                <div className="w-full grid grid-cols-12 text-blue-800">
                    <p className="col-span-1">อันดับ</p>
                    <p className="col-span-4">ชื่อบทความ</p>
                    <p className="col-span-2">ผู้เขียน</p>
                    <p className="col-span-2">วันที่สร้าง</p>
                    <p className="col-span-2">สถานะ</p>
                    <p className="col-span-1">คำสั่ง</p>
                </div>
                {articlesData.map((article,index)=>(
                    <div className="w-full grid grid-cols-12 my-2 border-b-[1px] py-1">
                        <div className="col-span-1">{index+1}</div>
                        <div className="col-span-4 ">
                            <p>{article.title}</p>
                        </div>
                        <div className="col-span-2">
                            <p>{article.author}</p>
                        </div>
                        <div className="col-span-2">
                            <p>{article.date}</p>
                        </div>
                        <div className="col-span-2">
                            <p>กำลังเผยแพร่</p>
                        </div>
                        <div className="col-span-1">
                            <button className="bg-red-200 w-full py-1 rounded-md">ลบ</button>
                        </div>
                    </div>
                ))}
            </div>}
            {stage===1 && boardsData && 
            <div className="px-10 pt-6">
                <div className="w-full grid grid-cols-12 text-blue-800">
                    <p className="col-span-1">อันดับ</p>
                    <p className="col-span-4">ชื่อบทความ</p>
                    <p className="col-span-2">ผู้เขียน</p>
                    <p className="col-span-2">วันที่สร้าง</p>
                    <p className="col-span-2">สถานะ</p>
                    <p className="col-span-1">คำสั่ง</p>
                </div>
                {boardsData.map((article,index)=>(
                    <div className="w-full grid grid-cols-12 my-2 border-b-[1px] py-1">
                        <div className="col-span-1">{index+1}</div>
                        <div className="col-span-4 ">
                            <p>{article.title}</p>
                        </div>
                        <div className="col-span-2">
                            <p>{article.author}</p>
                        </div>
                        <div className="col-span-2">
                            <p>{article.date}</p>
                        </div>
                        <div className="col-span-2">
                            <p>กำลังเผยแพร่</p>
                        </div>
                        <div className="col-span-1">
                            <button className="bg-red-200 w-full py-1 rounded-md">ลบ</button>
                        </div>
                    </div>
                ))}
            </div>}
        </div>

    </div>
  )
}
export default Admin