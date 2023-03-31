import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../App.css"
function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState();
    const [calendarData, setCalendarData] = useState(null);
    const icons = [
        {
            id: 0,
            name: "full_moon",
            url: "https://cdn-icons-png.flaticon.com/512/7651/7651008.png"
        },
        {
            id: 1,
            name: "full_moon",
            url: "https://cdn-icons-png.flaticon.com/512/7651/7651008.png"
        },
        {
            id: 2,
            name: "new_moon",
            url: "https://cdn-icons-png.flaticon.com/512/2204/2204373.png"
        },
        {
            id: 3,
            name: "eclipse_moon",
            url: "https://cdn-icons-png.flaticon.com/512/4663/4663426.png"
        },
        {
            id: 4,
            name: "eclipse_sun",
            url: "https://cdn-icons-png.flaticon.com/512/5903/5903918.png"
        },
        {
            id: 5,
            name: "eclipse_sun",
            url: "https://cdn-icons-png.flaticon.com/512/5903/5903918.png"
        },
        {
            id: 6,
            name: "shower",
            url: "https://cdn-icons-png.flaticon.com/512/4274/4274624.png"
        },
        {
            id: 7,
            name: "planet",
            url: "https://cdn-icons-png.flaticon.com/512/2407/2407423.png"
        },
        {
            id: 8,
            name: "",
            url: "https://cdn-icons-png.flaticon.com/512/3751/3751403.png"
        }
    ]
    const months = [
        { value: 0, month_en: "January", month_th: "มกราคม" },
        { value: 1, month_en: "February", month_th: "กุมภาพันธ์" },
        { value: 2, month_en: "March", month_th: "มีนาคม" },
        { value: 3, month_en: "April", month_th: "เมษายน" },
        { value: 4, month_en: "May", month_th: "พฤษภาคม" },
        { value: 5, month_en: "June", month_th: "มิถุนายน" },
        { value: 6, month_en: "July", month_th: "กรกฎาคม" },
        { value: 7, month_en: "August", month_th: "สิงหาคม" },
        { value: 8, month_en: "September", month_th: "กันยายน" },
        { value: 9, month_en: "October", month_th: "ตุลาคม" },
        { value: 10, month_en: "November", month_th: "พฤศจิกายน" },
        { value: 11, month_en: "December", month_th: "ธันวาคม" }
    ];
    useEffect(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        setCurrentMonth(currentMonth);
    }, [])
    useEffect(() => {
        axios.get('https://astrodemy-db.herokuapp.com/calendar')
            .then(res => setCalendarData(res.data))
            .catch(err => console.log(err));
    }, []);
    const [isOn, setIsOn] = useState(false);

    const handleClick = () => {
        if(!isOn){
            Swal.fire({
                title: 'เปิดรับการแจ้งเตือน',
                text: "คุณต้องการเปิดรับการแจ้งเตือนเกี่ยวกับวันพิเศษทางดาราศาสตร์ใช่ไหม",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ใช่ เปิดรับการแจ้งเตือน',
                cancelButtonText:"ยกเลิก"
              }).then((result) => {
                if (result.isConfirmed) {
                  setIsOn(true)
                }
                else{
                    setIsOn(false);
                }
              })
        }
        else{
            Swal.fire({
                title: 'ปิดรับการแจ้งเตือน',
                text: "คุณต้องการปิดรับการแจ้งเตือนเกี่ยวกับวันพิเศษทางดาราศาสตร์ใช่ไหม",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ใช่ ปิดรับการแจ้งเตือน',
                cancelButtonText:"ยกเลิก"
              }).then((result) => {
                if (result.isConfirmed) {
                  setIsOn(false)
                }
                else{
                    setIsOn(true);
                }
              })
        }
    };


    return (
        <div className='w-full h-full '>
            <div className="w-full h-full min-h-screen bg-white max-w-6xl mx-auto shadow-xl mt-10 px-10
         py-6 border-gray-100 border-t-[1px] rounded-2xl relative">
                <div className="absolute right-5 ">
                    <p className="text-md font-ibm-thai text-gray-400">รับการแจ้งเตือน</p>
                <div className="w-[60px] bg-gray-200 flex rounded-3xl ml-auto mt-1">
                <label id="toggle-button" className='mt-1 ml-1 w-full cursor-pointer'>
                    <input type="checkbox" checked={isOn} onChange={handleClick} />
                    <span className="toggle-button-slider"></span>
                </label>
                </div>
                </div>
                <div className="col-span-full h-fit flex mt-2">
                    <img src="/assets/AstroCalendar.png" className="w-56 mx-auto" />
                </div>
                <div className='grid grid-cols-12 mt-10 font-ibm-thai'>
                    <div className="col-span-3 ">
                        <div className="w-fit">
                            <p className="font-semibold text-xl">ปี: 2566</p>
                            {months.map((month, index) => (
                                <div className={`${index === currentMonth ? "bg-violet-100 border-[2px] border-violet-200 hover:border-violet-300"
                                    : "bg-gray-50 border-[1px] border-gray-50 hover:bg-gray-100 hover:border-[1px] hover:border-gray-300"} 
                            py-3 px-10 my-2 cursor-pointer rounded-md relative transition ease-in-out duration-100 text-lg`}
                                    onClick={() => { setCurrentMonth(index) }}>
                                    <p className="ml-2">{month.month_th}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="col-span-9">
                        {calendarData && <p className='mb-10 font-ibm-thai text-3xl font-bold text-right'>{currentMonth && months[currentMonth].month_th}</p>
}
                        {calendarData && calendarData
                            .filter(event => event.month === currentMonth) // Filter events by current month
                            .map(event => {
                                const icon = icons[event.type];
                                return (
                                    <div className="flex border-b-[1px] mb-10 pb-6" key={event.id}>
                                        {icon && <img src={icon.url} className="w-20 h-20 mr-5" />}
                                        <div className="font-ibm-thai">
                                            <p className='mr-2 text-2xl font-bold text-blue-800'>{event.name}</p>
                                            <p className="text-lg font-semibold mb-1 text-gray-600">วันที่ {event.date} {months[currentMonth].month_th}</p>
                                            <p className='text-md'>{event.detail}</p>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarPage;
