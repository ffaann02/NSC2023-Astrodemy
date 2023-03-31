import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../../App';
import axios from 'axios';
// import "./poststyle.css"
const Board = ({ match }) => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const { title } = useParams();
  const [notFound, setNotFound] = useState(null);
  const { userData, logged, setLogged, setUserData, userId } = useContext(UserContext)
  const [comments, setComments] = useState([]);
  const [allComments,setAllComments] = useState([]);
  useEffect(() => {
    console.log(title);
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`https://astrodemy-db.herokuapp.com/board?title=${title}`);
        setBoard(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://astrodemy-db.herokuapp.com/comments?title=${title}`);
        setComments(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    const fetchAllComments = async () => {
      try {
        const response = await axios.get(`https://astrodemy-db.herokuapp.com/all_comments`);
        setAllComments(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchBoard();
    fetchComments();
    fetchAllComments();
  }, []);
  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://astrodemy-db.herokuapp.com/comments?title=${title}`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  const [postComment, setPostComment] = useState("");
  const handleCommentSubmit = () => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('th-TH', options);
    axios.post('https://astrodemy-db.herokuapp.com/post_comment', {
      title: title,
      content: postComment,
      author: userData.username,
      authorProfile: userData.userProfile,
      date: formattedDate
    })
      .then(() => {
        // clear the input box after the comment has been posted
        fetchComments();
        document.getElementById("post-comment").value="";
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <>
      {board &&
        <div className="w-full h-full pb-10">
          <div className='mx-auto w-full h-full max-w-5xl min-h-screen grid grid-cols-12 bg-white mt-6 shadow-lg pt-10 pb-5 px-10 border-gray-100 
        border-t-[0.5px] rounded-2xl'>
            <div className="col-span-full">
              <div className="w-full font-ibm-thai text-center" id="header">
                <p className="font-semibold text-md text-gray-500">{board.date}</p>
                <p className="font-semibold text-4xl text-gray-800 mt-4">{board.title}</p>
                <img src={board.coverImage} className="max-w-[300px] max-h-[300px] mx-auto mt-4" />
              </div>
              <div className="mt-10 font-ibm-thai" id="content-container">
                <div className='text-2xl text-center'>{board.content}</div>
              </div>
              <div className="font-ibm-thai text-left border-b-[1px] pb-4">
                <p className="text-sm font-bold">ถามโดย</p>
                <img src={board.authorProfile} className="rounded-full w-10 mr-auto" />
                <p className="text-sm font-bold mt-2">{board.author}</p>
              </div>
              {userData &&
                <div className='w-full p-2 bg-gray-50 rounded-md flex cursor-pointer mb-6 mt-6'>
                  <img src={userData.userProfile} className="w-10 rounded-full" />
                  <input className='w-[85%] bg-gray-100 rounded-md rounded-l-none ml-2 flex border-[1px] my-auto 
font-ibm-thai text-gray-400 px-2 outline-none py-1 hover:outline-blue-200 focus:outline-blue-200'
                    placeholder='แสดงความคิดเห็น' id="post-comment"onChange={(e) => { setPostComment(e.target.value) }} />
                  <button className="bg-gradient-to-r ml-4 w-[10%]
                                    from-[#6e3f92] to-[#a94fa4]
                                    hover:marker:from-[#754798] hover:to-[#a65ea3] text-white rounded-xl flex
                                    font-ibm-thai">
                    <p className="text-md text-center m-auto" onClick={handleCommentSubmit}>โพสต์</p></button>
                </div>}
              <p className="font-ibm-thai">ความคิดเห็นทั้งหมด {comments && comments.length}</p>
              <div>
                {comments && comments.slice().reverse().map((comment) => (
                  <div className="w-full py-3 font-ibm-thai p-4 shadow-md my-2 rounded-md border-t-[0.5px]" key={comment.id}>
                    <div className='flex'>
                      <img src={comment.authorProfile} className="rounded-full w-10" />
                      <p className="ml-2 font-bold my-auto text-purple-800">{comment.author}</p>
                      <p className='my-auto ml-2 text-gray-600'>{comment.content}</p>
                    </div>
                    <div className='flex'>
                      <p className='my-auto ml-1 mt-2 text-gray-500 text-sm'>{comment.date}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      }
      {board && !board &&
        <div className="w-full h-full min-h-screen flex">
          <div className='m-auto text-3xl font-ibm-thai mt-[10%]'>
            <img src="https://cdn-icons-png.flaticon.com/512/4625/4625357.png" className='w-32 mx-auto' />
            <p className="mt-4  text-center font-bold text-gray-700">ไม่พบบอร์ดนี้</p>
            <p className="text-lg text-center text-gray-400 ">ดูเหมือนว่าคุณกำลังมองหาบอร์ดชื่อเรื่องที่คุณต้องการ
              <br />เพียงแต่เราไม่พบบอร์ดนั้นในคลังของพวกเรา <br /><p className="text-violet-900 font-bold">หากคิดว่านี่คือปัญหาโปรดแจ้งทีมงานของเรา</p></p>
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