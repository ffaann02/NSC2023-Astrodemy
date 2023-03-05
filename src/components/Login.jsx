import { useState ,useEffect} from 'react';
import {FaFacebook,FaGoogle} from 'react-icons/fa'
import axios from 'axios';
import { Link } from "react-router-dom";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};
firebase.initializeApp(firebaseConfig);
const Login=()=>{
    console.log(process.env.REACT_APP_API_KEY)
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const SubmitLogin=()=>{
        axios.post('http://localhost:3005/login', {
            username: username,
            password: password
          })
          .then(response => {
            console.log(response.data); // "Login Pass"
          })
          .catch(error => {
            console.log(error.response.status);
          });
    }
    const handleForm = (setState) => (event) => {
        setState(event.target.value);
    }

    const handleLoginWithFacebook = () => {
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider)
          .then((result) => {
            console.log(result.user);
          })
          .catch((error) => {
            console.log(error);
          });
      };
    
      const handleLoginWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
          .then((result) => {
            console.log(result.user);
          })
          .catch((error) => {
            console.log(error);
          });
      };

    return(
        <div className="w-full h-[96vh] text-center">
            <div className="h-full max-w-md mx-auto flex">
                <div className="w-full h-fit my-auto relative">
                    <p className="text-2xl font-ibm-thai font-bold">เข้าสู่ระบบ</p>
                    <div className="font-ibm-thai  w-full flex flex-col  px-4 py-4 shadow-none sm:shadow-md 
                    rounded-md border-t-[0] sm:border-t-[1px] mt-4 z-5 bg-white">
                        <label className="text-left text-lg font-bold text-gray-600">อีเมล</label>
                        <input type="text" name="email" id="email" onChange={handleForm(setUsername)}
                        className="border-[1.5px] rounded-md px-3 py-2 w-full h-12 text-gray-500  text-lg
                        focus:outline-gray-300"/>
                        <label className="text-left font-ibm-thai text-lg font-bold mt-10 text-gray-600">รหัสผ่าน</label>
                        <input type="password" name="password" id="password" onChange={handleForm(setPassword)}
                        className="border-[1.5px] rounded-md px-3 py-2 w-full h-12 text-gray-500  text-lg
                        focus:outline-gray-300"/>
                        <p className="mt-2 text-left font-semibold text-gray-600 cursor-pointer">ลืมรหัสผ่าน?</p>
                        <button className="py-3 rounded-xl mt-6 text-lg bg-gradient-to-r 
                        from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white" onClick={SubmitLogin}>เข้าสู่ระบบ</button>
                        <p className="mt-4 text-center font-semibold text-gray-600 text-sm">หรือเข้าสู่ระบบด้วย</p>
                        <div className="mx-auto flex mt-4 cursor-pointer">
                            <FaFacebook className="text-2xl text-[#a94fa4] hover:text-[#6e3f92] mx-1"
                            onClick={handleLoginWithFacebook}/>
                            <FaGoogle className="text-2xl text-[#a94fa4] hover:text-[#6e3f92] mx-1"
                            onClick={handleLoginWithGoogle}/>
                        </div>
                        <div className="mt-10 text-center text-gray-600 text-lg flex mx-auto">
                            <p>ยังไม่ได้สมัครสมาชิก?</p>
                            <p className="ml-1 text-[#a94fa4] hover:text-[#6e3f92] cursor-pointer"><Link to="/register">ลงทะเบียนเลย</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;