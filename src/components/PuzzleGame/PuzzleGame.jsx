import { useState, useContext, useEffect } from "react"
import About from "../About";
import MissionSort from "./Games/MissionSort";
import MoonJupiterSort from "./Games/MoonJupiterSort";
import PlanetSort from "./Games/PlanetSort"
import PlanetSortSize from "./Games/PlanetSortSize";
import { UserContext } from "../../App"
import { BiUser } from "react-icons/bi"
import { IoPlanetSharp } from "react-icons/io5"
import { MdOutlineContentCopy, MdDone, MdAccessTimeFilled, MdColorLens } from "react-icons/md"
import { StarSky } from "../StarSky";
import { BsTriangleFill,BsTrophy } from "react-icons/bs"
import { FaCrown ,FaTrophy} from "react-icons/fa"
import io from "socket.io-client"

const GameComponents = {
  0: PlanetSort,
  1: PlanetSortSize,
  2: MissionSort,
  3: MoonJupiterSort,
}
const socket = io.connect('http://localhost:3005')

const PuzzleGame = () => {
  const [roomId, setRoomId] = useState("");

  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [gameState, setGameState] = useState({ score: 0 });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playedGames, setPlayedGames] = useState([]);
  const [isJoin, setIsJoin] = useState(false);
  const { userData, logged, setLogged, setUserData, userId } = useContext(UserContext);

  const renderComponentAtIndex = (index) => {
    const Component = GameComponents[index];
    return <Component selectedPlanet={selectedPlanet} gameState={gameState} getNextQuestion={getNextQuestion} />
  }
  const getUniqueRandomIndex = (playedGames) => {
    const maxIndex = Object.keys(GameComponents).length - 1;
    let randomIndex = Math.floor(Math.random() * (maxIndex + 1));

    // Check if randomIndex has been played before
    while (playedGames.includes(randomIndex)) {
      randomIndex = Math.floor(Math.random() * (maxIndex + 1));
    }

    return randomIndex;
  }
  function generateRoomID() {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      // pick a random letter
      result += letters.charAt(Math.floor(Math.random() * letters.length));
      // pick a random number
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return result;
  }
  const handleGenerateRoomID = () => {
    const newRoomId = generateRoomID();
    setRoomId(newRoomId);
    setIsJoin(true);
    setStart(false);
    if (newRoomId) {
      socket.emit("join_quiz", newRoomId);
      socket.emit("newPlayer_quiz", {
        roomId: newRoomId, playerName: userData.username, playerProfile: userData.userProfile,
      });
      // Create a new player list with the current player
      const initialPlayerList = [{ id: userData.userId, name: userData.username }];
      // Emit a socket event to create the new room with the initial player list
      socket.emit('createRoom', { roomId: newRoomId, playerList: initialPlayerList });
    }
  };

  const handleJoinRoom = () => {
    socket.emit("checkRoom", roomId, (roomExists) => {
      if (roomExists) {
        socket.emit("join", roomId);
        // Emit an event to the server to inform that a new player has joined the room
        socket.emit("newPlayer_quiz", {
          roomId, playerName: userData.username, playerProfile: userData.userProfile,
        });
        setIsJoin(true);
        setStart(false);
      } else {
        // Handle the case where the room doesn't exist
        setPopupFade(true);
        setPopupText("ไม่พบไอดีห้องนี้");
        setPopupColor("text-red-600");
        return;
      }
    });
  };
  const [start, setStart] = useState(false);
  const [playerList, setPlayerList] = useState([])
  const [copyLink, setCopyLink] = useState(false);

  const handleStartGame = () => {
    socket.emit("startGame", roomId);
  }

  const getNextQuestion = () => {
    const indexUpdateScore = playerNameList.findIndex((name) => name === userData.username);
    const newScoreList = [...playerScoreList];
    newScoreList[indexUpdateScore] += 20;
    socket.emit('sendScoreListQuiz', { roomId: roomId, newScoreList: newScoreList });
    const index = getUniqueRandomIndex(playedGames);
    setPlayedGames([...playedGames, index]);
    setCurrentQuestion(index); // Set current question to the new index
    // Render the component at the random index
    // const Component = GameComponents[index];
    // return <Component />;
    console.log("now is: " + index)
  }
  const [playerNameList, setplayerNameList] = useState([]);
  const [playerProfileList, setplayerProfileList] = useState([]);
  const [playerScoreList, setPlayerScoreList] = useState([]);
  useEffect(() => {
    if (roomId) {
      socket.on("playerList", ({ playerNames, playerProfiles, scores }) => {
        // console.log(playerNames);
        // console.log(playerProfiles)
        setplayerNameList(playerNames);
        setplayerProfileList(playerProfiles);
        setPlayerScoreList(scores);
      });
    }
    socket.on("startGame", () => {
      setStart(true);
    });
    socket.on("updateScoreListQuiz",(newScoreList)=>{
      setPlayerScoreList(newScoreList);
    });
    return () => {
      socket.off("playerList");
    };
  }, [roomId]);

  const MAKE_SCORE_PUZZLE = 100;

  const [popupFade, setPopupFade] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupColor, setPopupColor] = useState("text-gray-400")
  const [combinedPlayerList,setCombinedPlayerList] = useState([]);
  useEffect(() => {
    if (popupFade) {
      setTimeout(() => {
        setPopupFade(false);
        setPopupText("");
        setPopupColor("text-gray-400");
      }, 2000);
    }
  }, [popupFade]);
  useEffect(()=>{
    const combinedArray = playerNameList.map((name, index) => ({
      name,
      score: playerScoreList[index],
      profile: playerProfileList[index]
    }));
    
    combinedArray.sort((a, b) => b.score - a.score);
    setCombinedPlayerList(combinedArray);
  },[playerScoreList])
  return (
    <>
      {popupFade && (
        <div className={`z-[200] font-ibm-thai ${popupColor} top-4 w-full text-center absolute`} id="popup-text">
          <p>{popupText}</p>
        </div>)}
      <div className='w-full h-full'>
        {!isJoin && userData &&
          <div className="w-full max-w-4xl h-full mx-auto p-4 relative">
            <div className="grid grid-cols-2 bg-white border-2 mt-10 rounded-2xl pt-10 pb-16
    drop-shadow-md">
              <div className="col-span-2 mb-14 text-center mt-0 text-2xl w-fit mx-auto">
                <img src="/assets/puzzle_game_page/AstroQuiz.png" className="w-52" />
              </div>
              <div className="">
                <p className="font-ibm-thai text-2xl font-bold text-center">ผู้เล่น</p>
                <div className="w-1/3 h-fit mx-auto rounded-full p-1 mt-2 border-[3px] border-[#663299]">
                  <img src={userData.userProfile} className="rounded-full mx-auto" />
                </div>
                <div className="w-full h-fit  flex mx-auto mt-6 px-4 justify-between">
                  <div className="flex mx-auto">
                    <BiUser className="my-auto mr-2 text-2xl" />
                    <p className="font-ibm-thai my-auto text-lg">ชื่อผู้เล่น:</p>
                    <p className="ml-2 font-golos text-xl text-purple-800 font-semibold opacity-80">{userData.username}</p>
                  </div>
                </div>
              </div>
              <div className="px-4 border-l-2 border-gray-200">
                <div className="w-full h-fit flex flex-col">
                  <p className="text-lg font-ibm-thai">ID ห้อง</p>
                  <div className="w-full h-full flex">
                    <input type="text" name="roomId" id="roomId" value={roomId}
                      className={`border-[1.5px] rounded-md px-3 py-2 w-full h-12 text-violet-800 text-xl rounded-r-none
                focus:outline-gray-300`} onChange={(e) => { setRoomId(e.target.value) }} />
                    <button className={`bg-gradient-to-r px-4
                    from-[#6e3f92] to-[#a94fa4]
                    hover:marker:from-[#754798] hover:to-[#a65ea3] text-white rounded-xl
                    rounded-l-none ${!roomId ? "cursor-no-drop" : "cursor-pointer"} font-ibm-thai`}
                      onClick={handleJoinRoom}>เล่น</button>
                  </div>
                  <p className="text-lg font-ibm-thai mx-auto mt-4">หรือ</p>

                </div>
                <div className="flex flex-col">
                  <button className="bg-gradient-to-r px-4 mx-[30%] py-3 mt-2
                    from-[#6e3f92] to-[#a94fa4]
                    hover:marker:from-[#754798] hover:to-[#a65ea3] text-white rounded-xl flex
                    font-ibm-thai"><IoPlanetSharp className="text-xl my-auto" />
                    <p className="ml-3" onClick={handleGenerateRoomID}>สร้างห้องใหม่</p></button></div>
                <div>
                  <p></p>
                </div>
              </div>
            </div>
          </div>
        }
        {start && isJoin && <div className="w-full h-full min-h-screen max-w-4xl 2xl:max-w-5xl mx-auto relative
        flex flex-col">
          <div className="my-auto pb-20">
            <img src="/assets/puzzle_game_page/AstroQuiz.png" className="w-36 2xl:w-56 mx-auto" />
            <div className="w-full h-full m-auto bg-gray-100 p-10 pb-6 rounded-2xl mt-6" id="game-container">
              {renderComponentAtIndex(currentQuestion)}
            </div>
          </div>
        </div>}
        {isJoin &&
          <div className="w-24 h-full  absolute left-0 top-0 pb-[10vh]">
            <FaCrown className="absolute top-2 text-yellow-400 text-2xl ml-4" />
            <div className=" w-[10%] h-full pt-10 ml-6">
              <div className="bg-white w-full h-full rounded-3xl bg-opacity-75">
                {playerNameList.map((player, index) => (
                  <div
                    key={index}
                    className={`absolute left-16 w-16 rounded-2xl h-fit ${player === userData.username ?
                      "bg-purple-400 z-[100]" : "bg-white z-[10]"}`}
                    style={{ bottom: `${10 + playerScoreList[index] * 0.8}%` }}
                  >
                    <div className="w-12 ml-auto p-1 rounded-full">
                      <img className="rounded-full border-2 border-white" src={playerProfileList[index]} />
                    </div>
                    <BsTriangleFill className={`absolute ${player === userData.username ?
                      "text-purple-400" : "text-white"} top-0 text-[2.75rem] -rotate-90 -left-6 z-0 mt-[1.5px]`} />
                  </div>
                ))}

              </div>
            </div>
          </div>}
          {isJoin && !start &&
          <div className="h-full  absolute right-0 top-0 pb-[10vh] pr-0 pt-4">
            <div className="h-full font-ibm-thai">
              <div className="bg-white w-full h-full rounded-2xl bg-opacity-75 pl-3 pr-0 rounded-r-none">
                <div className="flex pt-4">
                <p className="text-lg mb-2 flex text-center mx-auto">
                  <BsTrophy className="text-blue-700 my-auto mr-2 text-xl"/><p className="my-auto">อันดับคะแนน</p></p>
                </div>
                {combinedPlayerList.map((player,index)=>
                <div className="p-2 border-[1.5px] rounded-l-xl my-2 bg-blue-100">
                  <div className="flex">
                    <img src={player.profile} className="w-10 rounded-full h-10 my-auto border-2 border-white"/>
                    <div className="flex flex-col">
                      <p className="my-auto ml-2 font-bold">{player.name}</p>
                      <p className="my-auto ml-2 font-bold">คะแนน: {player.score}</p>
                    </div>
                  </div>
                </div>)}
              </div>
            </div>
          </div>}
        {!start && isJoin &&
          <div className="w-full max-w-4xl h-full top-0 pb-[10vh] pt-5 mx-auto flex min-h-screen font-ibm-thai">
            <div className="bg-white w-full h-full my-auto p-10 pt-6 rounded-lg mt-[8rem]">
              <div className="w-full mx-auto ">
                <img src="/assets/puzzle_game_page/AstroQuiz.png" className="w-44 mx-auto" />
                <div className="flex w-fit mx-auto mt-6"
                  onClick={() => {
                    navigator.clipboard.writeText(roomId);
                    setCopyLink(true);
                    setPopupFade(true);
                    setPopupText("คัดลอกลิงก์เรียบร้อยแล้ว")
                    setPopupColor("text-green-600");
                  }}
                  onMouseLeave={() => {
                    setTimeout(() => {
                      setCopyLink(false)
                    }, 1000);
                  }}>
                  <p className="font-ibm-thai text-xl mt-[6px] mr-2 text-black">ห้อง: </p>
                  <p className="text-3xl font-golos font-bold text-violet-600 cursor-pointer">{roomId}</p>
                  {!copyLink ? <MdOutlineContentCopy className="ml-1 text-2xl my-auto cursor-pointer text-gray-600" />
                    : <MdDone className="ml-1 text-2xl my-auto cursor-pointer text-green-500" />}
                </div>
                <p id="loading-text" className="font-ibm-thai font-bold text-xl text-center mt-2 text-gray-600"
                >กำลังรอผู้เล่นคนอื่น<span id="dot-animation"></span></p>
                {playerNameList[0] === userData.username && <div className="flex mt-2">
                  <button className={`bg-gradient-to-r px-4 text-xl py-2 mx-auto
                                    from-[#6e3f92] to-[#a94fa4]
                                    hover:marker:from-[#754798] hover:to-[#a65ea3] text-white rounded-xl font-ibm-thai`}
                    onClick={handleStartGame} >เริ่มเกม</button>
                </div>}
                <div className="w-full h-full grid grid-cols-12 mt-4 gap-10 px-20">
                  {playerNameList &&
                    playerNameList.map((player, index) => (
                      <div className="col-span-3 flex flex-col">
                        <img src={playerProfileList[index]} className="w-full rounded-full" />
                        <p className="text-center mt-2 font-bold">{player}</p>
                      </div>
                    ))
                  }
                  {/* <div className="col-span-3 flex flex-col">
                                    <img src={dummyPlayerList[0].playerProfile} className="w-full rounded-full"/>
                                    <p className="text-center mt-2 font-bold">{userData.username}</p>
                                </div> */}
                </div>
              </div>
            </div>
          </div>}
      </div>
      {/* {start && isJoin && 
    <div className="w-10 h-full bg-red-200 absolute left-0 top-0">

    </div>
    } */}
      <div className="absolute top-0 left-0 -z-[100] w-full h-full">
        <StarSky />
      </div></>
  )
}
export default PuzzleGame;
