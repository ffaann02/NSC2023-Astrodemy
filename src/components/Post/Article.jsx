import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import "./poststyle.css"
const Article = ({ match }) => {
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
    };

    fetchArticle();
  }, []);
  return (
    <>
      {article &&
        <div className="w-full h-full pb-10">
          <div className='mx-auto w-full h-full max-w-5xl min-h-screen grid grid-cols-12 bg-white mt-6 shadow-lg pt-10 pb-5 px-10 border-gray-100 
        border-t-[0.5px] rounded-2xl'>
            <div className="col-span-full">
              <div className="w-full font-ibm-thai text-center" id="header">
                <p className="font-semibold text-md text-gray-500">{article.date}</p>
                <p className="font-semibold text-4xl text-gray-800 mt-4">{article.title}</p>
                <img src={article.coverImage} className="max-w-[450px] max-h-[450px] mx-auto mt-4" />
              </div>
              <div className="mt-10 font-ibm-thai" id="content-container">
              <div id="article-content" dangerouslySetInnerHTML={{ __html: article.content }} className="w-full h-full"/>
              </div>
              <div className="mt-10 font-ibm-thai border-t-[1px] pt-4 text-right">
                <p className="text-md font-bold">เขียนโดย</p>
                <img src={article.authorProfile} className="rounded-full w-16 ml-auto mt-1"/>
                <p className="text-xl font-bold mt-2">{article.author}</p>
              </div>
            </div>
            {/* <div className="col-span-2 font-ibm-thai text-center">
            <p className="text-md">ผู้เขียน</p>
            <img src={article.authorProfile} className="rounded-full w-28 mx-auto mt-2"/>
            <p className="text-md mt-2 font-bold text-lg">{article.author}</p>
          </div> */}
          </div>
        </div>
      }
      {!article &&
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
export default Article