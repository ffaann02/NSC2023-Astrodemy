import { Link } from "react-router-dom";
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

const Register=()=>{

    const sweetAlert = withReactContent(Swal)
    const showAlert = (title, html, icon) => {
        sweetAlert.fire({
          title: <strong>{title}</strong>,
          html: <i>{html}</i>,
          icon: icon,
          confirmButtonText: 'ตกลง'
        });
    }

    const [isSuccess,setIsSuccess] = useState(null);
    const [alertText,setAlertText] = useState("");
    const [errorCase,setErrorCase] = useState(0);

    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmpassword,setConfirmPassword] = useState("");

    // case duplicate   
    const username_duplicate = "examplename";
    const email_duplicate = "example@gmail.com";

    // case format
    const email_format = "@gmail.com";

    const resetAlertText = () => {
        setIsSuccess(true);
        setErrorCase(0);
    }

    const handleForm = (setState) => (event) => {
        setState(event.target.value);
    }
    
    const validateSubmit=()=>{
        // validate username
        if(username === ""){
            setAlertText("กรุณาระบุชื่อผู้ใช้");
            setIsSuccess(false);
            setErrorCase(1);
            return;
        }
        else if(username.length < 8 || username.length > 16){
            setAlertText("ชื่อผู้ใช้ต้องมีความยาวไม่น้อยกว่า 8 และไม่เกิน 16 ตัวอักษร");
            setIsSuccess(false);
            setErrorCase(1);
            return;
        }
        else if(username === username_duplicate){
            setAlertText("ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว");
            setIsSuccess(false);
            setErrorCase(1);
            return;
        }

        // validate email
        if(email===""){
            setAlertText("กรุณาระบุอีเมลของคุณ");
            setIsSuccess(false);
            setErrorCase(2);
            return;
        }
        else if(email===email_duplicate){
            setAlertText("อีเมลนี้ถูกใช้ไปแล้ว");
            setIsSuccess(false);
            setErrorCase(2);
            return;
        }
        else if(!email.includes(email_format)){
            setAlertText("กรุณาระบุอีเมลให้ถูกต้อง");
            setIsSuccess(false);
            setErrorCase(2);
            return;
        }

        // validate password
        if(password===""){
            setAlertText("กรุณาระบุรหัสผ่าน");
            setIsSuccess(false);
            setErrorCase(3);
            return;
        }
        else if(password!==confirmpassword){
            setAlertText("รหัสผ่านไม่ตรงกัน");
            setIsSuccess(false);
            setErrorCase(3);
            return;
        }

        // pass every case
        else{
            showAlert("ลงทะเบียนสำเร็จ!", "ดำเนินการเสร็จสิ้น", "success");
            setIsSuccess(true);
            // alert("ลงทะเบียนสำเร็จ")
            return;
        }
    }

    return(
        <div className="w-full h-[96vh] text-center">
            <div className="h-full max-w-md mx-auto flex">
                <div className="w-full h-fit my-auto relative">
                    <p className="text-2xl font-ibm-thai font-bold">สมัครสมาชิก</p>
                    <div className="font-ibm-thai  w-full flex flex-col  px-4 py-4 shadow-none sm:shadow-md 
                    rounded-md border-t-[0] sm:border-t-[1px] mt-4 z-5 bg-white">
                        <label className="text-left text-lg font-bold text-gray-600">ชื่อผู้ใช้</label>
                        <input type="text" name="username" id="username" onChange={handleForm(setUsername)} onFocus={resetAlertText}
                        className={`border-[1.5px] rounded-md px-3 py-2 w-full h-12 text-gray-500  text-lg
                        focus:outline-gray-300 ${errorCase === 1 ? "border-red-600" :null}`}/>

                        <label className="text-left text-lg font-bold mt-10 text-gray-600">อีเมล</label>
                        <input type="text" name="email" id="email" onChange={handleForm(setEmail)} onFocus={resetAlertText}
                        className={`border-[1.5px] rounded-md px-3 py-2 w-full h-12 text-gray-500  text-lg
                        focus:outline-gray-300 ${errorCase === 2 ? "border-red-600" :null}`}/>

                        <label className="text-left font-ibm-thai text-lg font-bold mt-10 text-gray-600">รหัสผ่าน</label>
                        <input type="password" name="password" id="password" onChange={handleForm(setPassword)} onFocus={resetAlertText}
                        className={`border-[1.5px] rounded-md px-3 py-2 w-full h-12 text-gray-500  text-lg
                        focus:outline-gray-300 ${errorCase === 3 ? "border-red-600" :null}`}/>

                        <label className="text-left font-ibm-thai text-lg font-bold mt-4 text-gray-600">ยืนยันรหัสผ่าน</label>
                        <input type="password" name="confirm-password" id="confirm-password" onChange={handleForm(setConfirmPassword)} onFocus={resetAlertText}
                        className={`border-[1.5px] rounded-md px-3 py-2 w-full h-12 text-gray-500  text-lg
                        focus:outline-gray-300 ${errorCase === 3 ? "border-red-600" :null}`}/>

                        {!isSuccess ? <div className="mt-5 text-center text-gray-600 text-lg flex mx-auto">
                            <p className="mx-10 text-red-600">{alertText}</p>
                        </div> :null}
                        <button className="py-3 rounded-xl mt-6 text-lg bg-gradient-to-r 
                        from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white"
                        onClick={validateSubmit}>ลงทะเบียน</button>
                        <div className="mt-10 text-center text-gray-600 text-lg flex mx-auto">
                            <p>สมัครสมาชิกแล้ว?</p>
                            <p className="ml-1 text-[#a94fa4] hover:text-[#6e3f92] cursor-pointer"><Link to="/login">เข้าสู่ระบบเลย</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Register;