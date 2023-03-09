import { useState, useContext, useEffect } from "react"
import Canvas from "./Canvas"
import { UserContext } from "../../App"
import "./canvas.css"
import { FaEraser } from 'react-icons/fa'
import { GrClearOption } from "react-icons/gr"
import { RiBrushFill } from "react-icons/ri"
import io from "socket.io-client"
const socket = io.connect("http://localhost:3001")
const DrawingGame = () => {
    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState(5);
    const [clear, setClear] = useState("");
    const [isJoin, setIsJoin] = useState(false);
    const [start, setStart] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [playerNames, setPlayerNames] = useState([]);
    const handleColorChange = (newColor) => {
        setColor(newColor);
    }
    const { userData, logged, setLogged, setUserData, userId } = useContext(UserContext);
    const pencil_color_list = [
        "#000000", "#ffffff", "#017420", "#11b03c",
        "#b0701c", "#ffc126", "#666666", "#aaaaaa",
        "#990000", "#ff0013", "#99004e", "#ff008f",
        "#0050cd", "#26c9ff", "#964112", "#ff7829",
        "#cb5a57", "#feafa8", "#2B0C51", "#371761",
        "#663299", "#5746A6", "#5746A6", "#476CA9"
    ];

    const handleJoinRoom = () => {
        if (roomId) {
          socket.emit("join", roomId);
          // Emit an event to the server to inform that a new player has joined the room
          socket.emit("newPlayer", { roomId, playerName: userData.username });
          setIsJoin(true);
        }
      };
      useEffect(() => {
        if (roomId) {
          socket.on("playerList", (playerList) => {
            setPlayerNames(playerList);
          });
        }
      }, [roomId]);
    return (
        <div className="w-full h-screen flex">
            {!isJoin && (
                <div className="w-full max-w-3xl h-full bg-red-300 mx-auto">
                    <input type="text" name="roomId" id="roomId" onChange={(event) => setRoomId(event.target.value)}
                        className={`border-[1.5px] rounded-md px-3 py-2 w-full h-12 text-gray-500  text-lg
                            focus:outline-gray-300`} />
                    <button className="px-2 bg-blue-200" onClick={handleJoinRoom}>Join Room</button>
                </div>
            )}
            {isJoin && !start && (
                <div className="flex-row">
                    <button className="bg-red-200" onClick={()=>{setStart(true)}}>Start</button>
                    <div>
                        <p>List of Player: </p>
                        <ul>
                            {playerNames.map((name, index) => (
                                <li key={index}>{name}</li>
                            ))}
                        </ul>
                    </div></div>
            )}
            {isJoin && start && (<>
                <img src="/assets/astranaunt-painting.png"
                    id="astranaunt-painting"
                    className="max-w-md absolute -z-10" />
                <div className="h-fit w-full max-w-[52rem] mx-auto grid grid-cols-12 z-10">
                    <div className="w-full h-[55vh] mx-auto mb-auto mt-20 rounded-l-2xl bg-white border-2 col-span-11 
                " id="canvas-container">
                        <Canvas color={color} clear={clear} size={size} socket={socket} roomId={roomId} />
                    </div>
                    <div className="col-span-1 mt-20 rounded-r-lg border-2 border-l-[0px] bg-sky-500 relative">
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
                        <div className="w-full h-1/2 pb-10">
                            <div className="w-full h-full flex relative pb-4">
                                <RiBrushFill className="text-2xl bg-white p-[2px] rounded-full mx-auto mt-1" />
                                <input id="large-range" type="range" value={size} min="5" max="100"
                                    onChange={(event) => setSize(parseInt(event.target.value))}
                                    className="w-[100px] 2xl:w-[120px] h-5 bg-white rounded-lg m-auto -mb-2
                            appearance-none cursor-pointer range-lg absolute bottom-1/2 -right-[25%] 2xl:-right-[41%]
                            transform -rotate-90"/>

                            </div>
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
                </div></>)}
        </div>
    )
}
export default DrawingGame
