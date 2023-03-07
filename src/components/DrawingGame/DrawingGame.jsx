import { useState } from "react"
import Canvas from "./Canvas"
import "./canvas.css"
import { FaEraser } from 'react-icons/fa'
import { GrClearOption } from "react-icons/gr"
const DrawingGame = () => {
    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState(5);
    const [clear, setClear] = useState("");
    const handleColorChange = (newColor) => {
        setColor(newColor);
    }

    const pencil_color_list = ["#000000", "#ffffff", "#017420", "#11b03c", "#b0701c", "#ffc126", "#666666", "#aaaaaa", "#990000", "#ff0013", "#99004e", "#ff008f", "#0050cd", "#26c9ff", "#964112", "#ff7829", "#cb5a57", "#feafa8", "#2B0C51", "#371761", "#663299", "#5746A6", "#5746A6", "#476CA9"];
    const [canvas, setCanvas] = useState(null);

    const clearCanvas = () => {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };
    return (
        <div className="w-full h-screen flex">
            <div className="h-fit w-full max-w-[52rem] mx-auto grid grid-cols-12">
                <div className="w-full h-[55vh] mx-auto mb-auto mt-20 rounded-l-2xl bg-white border-2 col-span-11 
                " id="canvas-container">
                    <Canvas color={color} clear={clear} size={size}/>
                </div>
                <div className="col-span-1 mt-20 rounded-r-lg border-2 border-l-[0px] bg-sky-600 relative">
                    <div className="grid grid-cols-3 h-fit">
                        {pencil_color_list.map((item, index) => {
                            let ml = '';
                            let mr = '';
                            if (index % 3 === 0) {
                                ml = 'ml-2';
                                mr = 'mr-0';
                            } else if (index % 3 === 1) {
                                ml = 'ml-1';
                                mr = 'mr-1';
                            } else if (index % 3 === 2) {
                                ml = 'ml-0';
                                mr = 'mr-2';
                            }
                            return (
                                <div
                                    key={index}
                                    style={{ backgroundColor: item }}
                                    className={`rounded-sm mt-2 h-4 cursor-pointer ${ml} ${mr}`}
                                    onClick={() => handleColorChange(item)}
                                />
                            )
                        })}
                    </div>
                    <div className="h-fit w-full flex mt-1">
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                            className="cursor-pointer ml-[0.5rem]
                            h-6 w-1/2 my-auto bg-transparent"/>
                        <div className="w-1/2 ml-1 mr-2 my-1 flex border-2 rounded-md bg-white border-white">
                            <FaEraser className="m-auto text-xl p-[1px] cursor-pointer"
                                onClick={() => handleColorChange("#ffffff")} />
                        </div>
                    </div>
                    <div className=" bg-red-200 col-span-3">
                        <input
                            type="range"
                            min="5"
                            max="50"
                            value={size}
                            onChange={(event) => setSize(parseInt(event.target.value))}
                            className="w-[100%] block cursor-pointer"
                        />
                    </div>
                    <div className="w-full my-1 flex border-2 col-span-3
                        border-none cursor-pointer absolute bottom-1" onClick={() => { setClear(Date.now()) }}>
                        <div className="mx-2 w-full h-full bg-red-500 py-1 rounded-md hover:bg-red-600">
                            <p className="text-center font-golos font-bold text-white my-auto tracking-wider">
                                Clear
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DrawingGame
