import { useState } from 'react';
const Register=()=>{
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmpassword,setConfirmPassword] = useState("");

    // case duplicate   
    const username_duplicate = "examplename";
    const email_duplicate = "example@gmail.com";

    // case format
    const email_format = "@gmail.com";

    const handleForm = (setState) => (event) => {
        setState(event.target.value);
    }
    
    const validateSubmit=()=>{
        // validate username
        if(username === ""){
            alert("กรุณาระบุชื่อผู้ใช้")
            return;
        }
        else if(username.length < 8 || username.length > 16){
            alert("ชื่อผู้ใช้ต้องมีความยาวไม่น้อยกว่า 8 และไม่เกิน 16 ตัวอักษร")
            return;
        }
        else if(username === username_duplicate){
            alert("ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว")
            return;
        }

        // validate email
        if(email===""){
            alert("กรุณาระบุอีเมลของคุณ")
            return;
        }
        else if(email===email_duplicate){
            alert("อีเมลนี้ถูกใช้ไปแล้ว");
            return;
        }
        else if(!email.includes(email_format)){
            alert("กรุณาระบุอีเมลให้ถูกต้อง")
            return;
        }

        // validate password
        if(password===""){
            alert("กรุณาระบุรหัสผ่าน")
            return;
        }
        else if(password!==confirmpassword){
            alert("รหัสผ่านไม่ตรงกัน");
            return;
        }

        // pass every case
        else{
            alert("ลงทะเบียนสำเร็จ")
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
                        <input type="text" name="username" id="username" onChange={handleForm(setUsername)}
                        className="border-[1.5px] rounded-md px-3 py-2 w-full h-12 text-gray-500  text-lg
                        focus:outline-gray-300"/>
                        <label className="text-left text-lg font-bold mt-10 text-gray-600">อีเมล</label>
                        <input type="text" name="email" id="email" onChange={handleForm(setEmail)}
                        className="border-[1.5px] rounded-md px-3 py-2 w-full h-12 text-gray-500  text-lg
                        focus:outline-gray-300"/>
                        <label className="text-left font-ibm-thai text-lg font-bold mt-10 text-gray-600">รหัสผ่าน</label>
                        <input type="password" name="password" id="password" onChange={handleForm(setPassword)}
                        className="border-[1.5px] rounded-md px-3 py-2 w-full h-12 text-gray-500  text-lg
                        focus:outline-gray-300"/>
                        <label className="text-left font-ibm-thai text-lg font-bold mt-4 text-gray-600">ยืนยันรหัสผ่าน</label>
                        <input type="password" name="confirm-password" id="confirm-password" onChange={handleForm(setConfirmPassword)}
                        className="border-[1.5px] rounded-md px-3 py-2 w-full h-12 text-gray-500  text-lg
                        focus:outline-gray-300"/>
                        <button className="py-3 rounded-xl mt-6 text-lg bg-gradient-to-r 
                        from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white"
                        onClick={validateSubmit}>ลงทะเบียน</button>
                        <div className="mt-10 text-center text-gray-600 text-lg flex mx-auto">
                            <p>สมัครสมาชิกแล้ว?</p>
                            <p className="ml-1 text-[#a94fa4] hover:text-[#6e3f92] cursor-pointer">เข้าสู่ระบบเลย</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Register;