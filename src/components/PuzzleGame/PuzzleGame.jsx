import { useState, useContext } from "react"
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
import { BsTriangleFill } from "react-icons/bs"
import { FaCrown } from "react-icons/fa"
const GameComponents = {
  0: PlanetSort,
  1: PlanetSortSize,
  2: MissionSort,
  3: MoonJupiterSort,
}

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
    console.log("hello")
    const newRoomId = generateRoomID();
    setRoomId(newRoomId);
    setIsJoin(true);
    setStart(true);
    if (newRoomId) {
      // socket.emit("join", newRoomId);
      // // Emit an event to the server to inform that a new player has joined the room
      // console.log(totalRounds);
      // socket.emit("newPlayer", {
      //     roomId: newRoomId, playerName: userData.username, playerProfile: userData.userProfile,
      //     totalRound: totalRounds
      // });
      setIsJoin(true);
      setStart(true);
    }
  };
  const getNextQuestion = () => {
    const index = getUniqueRandomIndex(playedGames);
    setPlayedGames([...playedGames, index]);
    setCurrentQuestion(index); // Set current question to the new index
    // Render the component at the random index
    // const Component = GameComponents[index];
    // return <Component />;
    console.log("now is: " + index)
  }
  const [start, setStart] = useState(false);
  const [playerList, setPlayerList] = useState([

  ])
  const MAKE_SCORE_PUZZLE = 100;
  const dummyPlayerList = [
    {
      id: 1,
      name: "KongChayapol",
      playerProfile: "https://thumbs.dreamstime.com/b/profile-astronaut-suit-usa-flag-space-generative-ai-profile-astronaut-suit-usa-flag-space-266767971.jpg",
      score: 0
    },
    {
      id: 2,
      name: "admin_faan",
      playerProfile: "https://play-lh.googleusercontent.com/2EA71-TRMKp1jUxOc6u-v1VUe5kDDznC4BdU6W2OMgxT3d-GQHEPNDshREQMSVIem3I",
      score: 10
    },
    {
      id: 3,
      name: "admin_faan02",
      playerProfile: "https://mars.nasa.gov/people/images/profile/2x2/mwsmith-23258-profile-hi_20BFFA1F-F1AD-414F-8550C9E61A6CB3B6.jpg",
      score: 50
    },
  ]
  return (
    <>
      <div className='w-full h-full'>
        {!start && userData &&
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
                focus:outline-gray-300`} />
                    <button className={`bg-gradient-to-r px-4
                    from-[#6e3f92] to-[#a94fa4]
                    hover:marker:from-[#754798] hover:to-[#a65ea3] text-white rounded-xl
                    rounded-l-none ${!roomId ? "cursor-no-drop" : "cursor-pointer"} font-ibm-thai`}
                    >เล่น</button>
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
              {renderComponentAtIndex(3)}
            </div>
          </div>
        </div>}
        {start && isJoin &&
          <div className="w-24 h-full  absolute left-0 top-0 pb-[10vh]">
            <FaCrown className="absolute top-2 text-yellow-400 text-2xl ml-4" />
            <div className=" w-[10%] h-full pt-10 ml-6">
              <div className="bg-white w-full h-full rounded-3xl bg-opacity-75">
                {dummyPlayerList.map((player, index) => (
                  <div
                    key={player.score}
                    className={`absolute left-16 w-16 rounded-2xl z-10 h-fit ${player.name===userData.username ?
                    "bg-purple-400":"bg-white"}`}
                    style={{ bottom: `${10 + player.score * 0.8}%` }}
                  >
                    <div className="w-12 ml-auto p-1 rounded-full">
                    <img className="rounded-full border-2 border-white" src={player.playerProfile} />
                    </div>
                    <BsTriangleFill className={`absolute ${player.name===userData.username ?
                    "text-purple-400":"text-white"} top-0 text-[2.75rem] -rotate-90 -left-6 z-0 mt-[1.5px]`} />
                  </div>
                ))}

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
