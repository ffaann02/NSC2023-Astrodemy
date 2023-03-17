import React, { useEffect, useState } from 'react';
import axios from 'axios';
function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState();
    const [calendarData, setCalendarData] = useState([]);
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
        axios.get('http://localhost:3005/calendar')
            .then(res => setCalendarData(res.data))
            .catch(err => console.log(err));
    }, []);


    return (
        <div className='w-full h-full '>
            <div className="w-full h-full min-h-screen bg-white max-w-6xl mx-auto shadow-xl mt-10 px-10
         py-6 border-gray-100 border-t-[1px] rounded-2xl">
                <div className="col-span-full h-fit flex mt-2">
                    <img src="/assets/drawing-game_page/AstroArcade.png" className="w-52 mx-auto" />
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
                    <div className="col-span-9 mt-10">
                        {calendarData && calendarData
                            .filter(event => event.month === currentMonth) // Filter events by current month
                            .map(event => (
                                <div className="mb-10 font-ibm-thai" key={event.id}>
                                    <p className='text-xl font-semibold'>วันที่ {event.date} {months[currentMonth].month_th}</p>
                                    <p className="text-lg font-semibold">รายละเอียด</p>
                                    <p className='text-md'>{event.detail}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarPage;
