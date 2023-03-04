const Navbar = () => {
    return (
        <nav className="sticky w-full bg-white h-16 top-0 shadow-lg font-golos z-10">
            <div className="max-w-6xl mx-auto h-full flex justify-between">
                <div className="py-2 flex cursor-pointer">
                    <img src="/logo192.png" className="w-full h-full py-1" />
                    <p className="my-auto ml-2 font-bold text-2xl tracking-wider text-gray-800">Astrodemy</p>
                </div>
                <div className="h-full flex w-fit font-ibm-thai">
                    <div className="w-fit h-full flex mr-2 text-lg cursor-pointer text-gray-600 hover:text-gray-800">
                        <p className="my-auto mx-2 text-gray-600 hover:text-gray-800">เกี่ยวกับเรา</p>
                        <p className="my-auto mx-2 text-gray-600 hover:text-gray-800">เกม</p>
                        <p className="my-auto mx-2 text-gray-600 hover:text-gray-800">บทความ</p>
                        <p className="my-auto mx-2 text-gray-600 hover:text-gray-800">คอร์สออนไลน์</p>
                        <p className="my-auto mx-2 text-gray-600 hover:text-gray-800">แบบจำลอง 3D</p>
                    </div>
                    <div className="flex">
                        <p className="my-auto mr-4 text-gray-600 hover:text-gray-800 text-lg cursor-pointer">ลงทะเบียน</p>
                        <button className="rounded-3xl text-lg bg-gradient-to-r px-4 my-2
                        from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white">เข้าสู่ระบบ</button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
export default Navbar