import { StarSky } from "./components/StarSky"
import { useNavigate } from "react-router-dom"
import { BsFillPlusCircleFill } from "react-icons/bs"
import { AiOutlineDelete } from "react-icons/ai"
import { FiCopy } from "react-icons/fi"
import { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from "./App";
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

const Select3D = () => {
  const navigate = useNavigate();
  const { userData, logged, setLogged, setUserData, role, setRole, calendarNoti, setCalendarNoti } = useContext(UserContext);

  const [rawData, setRawData] = useState([]);

  const sweetAlert = withReactContent(Swal)
  const showAlert = (alertHead, alertDetail, data) => {
    sweetAlert.fire({
        title: <strong>{alertHead}</strong>,
        html: <i>{alertDetail}</i>,
        showDenyButton: true,
        confirmButtonText: 'ยืนยัน',
        denyButtonText: `ยกเลิก`,
    })
      .then((result) => {
        if (result.isConfirmed) {
            delete3D(data.title, userData.username);
          }
      });
  }

  // Fetch Raw Data
  useEffect(() => {
    if (userData) {
      const username = userData.username;
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:3005/3d_owner?username=${username}`);
          setRawData(response.data);
        } catch (error) {
          console.error(error);
        }
      }
      fetchData();
    }

  }, [userData]);

  const delete3D = async (title, username) => {
    try {
      await axios.post('http://localhost:3005/3d_owner_delete', {title: title})
        .then(() => {
          try {
            axios.get(`http://localhost:3005/3d_owner?username=${username}`)
            .then((response) => {setRawData(response.data);})
          } catch (error) {
            console.error(error);
          }
        });
      
    } catch (error) {
      console.error(error);
      // Handle the error here
    }
  };

  return (
    <div>
      <div className="max-4xl lg:max-w-5xl m-auto h-fit my-auto grid grid-cols-12 z-[20] relative" data-aos="fade-up" data-aos-delay="300">
        <div className="col-span-full text-center mt-4 lg:mt-16">
          <img src="/assets/AstroSIM.png" className="w-44 lg:w-52 mx-auto" data-aos="fade-down" data-aos-delay="200" />
        </div>
        <div className="col-span-full pl-6 font-ibm-thai text-2xl text-white -mb-6">
          <p>แบบจำลองจาก Astrodemy</p>
        </div>
        <div className={`col-span-full lg:col-span-4 px-5 hover:opacity-100 cursor-pointer mt-10 hover:mt-4 ease-in-out duration-300 relative 
        `}
          onClick={() => { navigate("/simulate") }}>
          <img src="/assets/3d-cover-1.png" className="rounded-3xl ease-in-out duration-300 rounded-b-none hover:border-2 w-full"
          />
          <div className="w-full bg-white py-2 rounded-b-xl" >
            <p className="font-ibm-thai text-black text-xl text-center">แบบจำลองดาวเคราะห์ <br />ในระบบสุริยะ</p>
          </div>
        </div>
        <div className="col-span-full lg:col-span-4 px-5 hover:opacity-100 cursor-pointer mt-10 hover:mt-4 ease-in-out duration-300"
          onClick={() => { navigate("/moon-cycle") }}>
          <img src="/assets/3d-cover-2.png" className="rounded-3xl ease-in-out duration-300  rounded-b-none hover:border-2"
          />
          <div className="w-full bg-white py-2 rounded-b-xl" >
            <p className="font-ibm-thai text-black text-xl text-center">แบบจำลองการเปลี่ยนรูปร่าง <br />ของดวงจันทร์</p>
          </div>
        </div>
        <div className="col-span-full lg:col-span-4  px-5 hover:opacity-100 cursor-pointer mt-10 hover:mt-4 ease-in-out duration-300 "
          onClick={() => { navigate("/life-cycle") }}>
          <img src="/assets/3d-cover-3.png" className="rounded-3xl ease-in-out duration-300  rounded-b-none hover:border-2"
          />
          <div className="w-full bg-white py-2 rounded-b-xl" >
            <p className="font-ibm-thai text-black text-xl text-center">แบบจำลองวัฏจักร<br />ของดาวฤกษ์</p>
          </div>
        </div>

        {userData && role === "teacher" && <div className="col-span-full pl-6 font-ibm-thai text-2xl text-white mt-6">
          <p>แบบจำลองของคุณ</p>
        </div>}

        {userData && role === "teacher" && rawData &&
          rawData.reverse().map((data, index) => (
            <div className={`col-span-full lg:col-span-4 px-5 hover:opacity-100 cursor-pointer mt-2 duration-300 relative `}>
              <div className="relative">
                <AiOutlineDelete className="absolute top-4 right-4 text-white text-2xl" 
                  onClick={() => showAlert('ต้องการลบแบบจำลองใช่หรือไม่', `ยืนยันที่จะลบแบบจำลอง ${data.title} ใช่หรือไม่`, data)}/>
                <img src={data.coverImage} className="w-full rounded-3xl ease-in-out duration-300 rounded-b-none hover:border-2" onClick={() => { navigate(`/display-3d/${data.path}`) }} />
              </div>
              <div className="w-full bg-white py-2 rounded-b-xl flex cursor-default">
                <p className="font-ibm-thai text-black text-xl text-center ml-4 cursor-pointer" onClick={() => { navigate(`/display-3d/${data.path}`) }}>{data.title}</p>
                <FiCopy className="absolute right-8 text-black text-2xl cursor-pointer" onClick={() => (navigator.clipboard.writeText(`http://localhost:3000/display-3d/${data.path}`))} />
              </div>
            </div>
          ))
        }

        {userData && role === "teacher" && <div className="col-span-full lg:col-span-4  px-5 hover:opacity-100 cursor-pointer mt-2 ease-in-out duration-300 mb-4 relative"
          onClick={() => { navigate("/create-3d") }}>
          <img src="/assets/3d-cover-3.png" className="rounded-3xl ease-in-out duration-300  rounded-b-none hover:border-2 opacity-20"
          />
          <BsFillPlusCircleFill className="absolute text-5xl top-[40%] left-[45%] text-white opacity-40 hover:opacity-80" />
          <div className="w-full bg-white py-2 rounded-b-xl" >
            <p className="font-ibm-thai text-black text-xl text-center">สร้างแบบจำลองทางดาราศาสตร์</p>
          </div>
        </div>}
      </div>
      <div className="absolute top-0 left-0 -z-[10] w-full h-full">
        <StarSky />
      </div>
    </div>
  )
}
export default Select3D