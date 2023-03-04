const Login=()=>{
    return(
        <div className="w-full h-screen text-center">
            <div className="h-full max-w-xl m-auto">
                <div className="w-full h-fit m-auto ">
                    <p className="text-2xl font-ibm-thai font-bold">เข้าสู่ระบบ</p>
                    <div className="font-golos w-full">
                        <input type="text" name="email" id="email"
                        className="shadow appearance-none border-[1.5px] rounded-md px-2 w-3/4 h-10 text-gray-600 focus:outline-emerald-700"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;