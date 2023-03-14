import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../App';
const Post = () => {
    const { userData, logged, setLogged, setUserData, userId } = useContext(UserContext)
    return (
        <div className="w-full h-screen">
            <div className="w-full h-full max-w-7xl mx-auto mt-10 grid grid-cols-12">
                <div className="col-span-2 h-full font-ibm-thai cursor-pointer">
                    <div className="w-full h-fit px-5">
                        <div className="w-full h-full bg-white px-4 py-2 border-2 rounded-xl">โพสต์</div>
                    </div>
                    <div className="w-full h-fit px-5 mt-2">
                        <div className="w-full h-full bg-white px-4 py-2 border-2 rounded-xl">บทความ</div>
                    </div>
                </div>
                <div className="col-span-8 h-full">
                    <div className="w-full pr-24 pl-10">
                        <div className='border-2 w-full p-2 rounded-xl pb-2'>
                            <div className="w-full flex">
                                <img src={userData.userProfile} className="w-10 rounded-full" />
                                <div className='w-full border-2 font-ibm-thai my-auto py-2 ml-1 mr-20 
                                rounded-xl px-2 text-gray-600 cursor-pointer hover:bg-gray-100'>
                                    โพสต์อะไรสักอย่างสิ</div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="col-span-2 h-full font-ibm-thai cursor-pointer">
                    <div className="w-full h-fit px-5">
                        <div className="w-full h-full bg-white px-4 py-2 border-2 rounded-xl">โพสต์</div>
                    </div>
                    <div className="w-full h-fit px-5 mt-2">
                        <div className="w-full h-full bg-white px-4 py-2 border-2 rounded-xl">บทความ</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Post