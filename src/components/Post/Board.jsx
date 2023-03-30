import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import "./poststyle.css"
const Board = ({ match }) => {
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const { title } = useParams();
  const [notFound, setNotFound] = useState(null);
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/article?title=${title}`);
        setArticle(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchArticle();
  }, []);
  return (
    <>
      {article && !article &&
        <div className="w-full h-full min-h-screen flex">
          <div className='m-auto text-3xl font-ibm-thai mt-[10%]'>
            <img src="https://cdn-icons-png.flaticon.com/512/4625/4625357.png" className='w-32 mx-auto' />
            <p className="mt-4  text-center font-bold text-gray-700">ไม่พบบทความนี้</p>
            <p className="text-lg text-center text-gray-400 ">ดูเหมือนว่าคุณกำลังมองหาบทความชื่อเรื่องที่คุณต้องการ
              <br />เพียงแต่เราไม่พบบทความนั้นในคลังของพวกเรา <br /><p className="text-violet-900 font-bold">หากคิดว่านี่คือปัญหาโปรดแจ้งทีมงานของเรา</p></p>
            <button className="bg-gradient-to-r px-6 mx-auto py-3 mt-2
                                    from-[#6e3f92] to-[#a94fa4]
                                    hover:marker:from-[#754798] hover:to-[#a65ea3] text-white rounded-xl flex
                                    font-ibm-thai">
              <p className="text-xl" onClick={() => { navigate("/post") }}>ย้อนกลับ</p></button>
          </div>
        </div>}
    </>
  )
}
export default Board;