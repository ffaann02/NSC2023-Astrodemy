import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { shuffle } from "lodash"
import "./puzzlegame.css"
const planetsData = [
    {
        id: "io",
        name: "Io",
        imageUrl: "https://www6.solarsystemscope.com/spacepedia/images/handbook/renders/io.png",
        key: "ecorrect"
    },
    {
        id: "europa",
        name: "Europa",
        imageUrl: "https://cdn130.picsart.com/268480448003211.png",
        key: "correct"
    },
    {
        id: "ganymede",
        name: "Ganymede",
        imageUrl: "https://www.lpi.usra.edu/resources/gc/ganymede.png",
        key: "correct"
    },
    {
        id: "callisto",
        name: "Callisto",
        imageUrl: "https://w.solarsystemscope.com/spacepedia/images/handbook/renders/callisto.png",
        key: "correct"
    },
    {
        id: "titan",
        name: "Titan",
        imageUrl: "https://www.pngkit.com/png/full/234-2348193_class-n-planet-svg-library-library-titan-moon.png",
        key: "incorrect"
    },
    {
        id: "enceladus",
        name: "Enceladus",
        imageUrl: "https://frostydrew.org/images/enceladus.png",
        key: "incorrect"
    },
    {
        id: "luna",
        name: "Luna",
        imageUrl: "https://www.freeiconspng.com/thumbs/moon-png/moon-png-no-background-15.png",
        key: "incorrect"
    }
];


const solutionOrder = planetsData.slice(0, 4).map((planet) => planet.id);

function MoonJupiterSort(props) {
    const [render,setRender] = useState("");
    const [planets, updatePlanets] = useState(planetsData);
    const [hoverList, setHoverList] = useState(Array(8).fill(true));
    function handleOnDragEnd(result) {
        if (!result.destination) {
            // User dropped the item outside of the list, so delete it
            const items = Array.from(planets);
            items.splice(result.source.index, 1);
            updatePlanets(items);
            return;
        }

        const items = Array.from(planets);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        updatePlanets(items);
    }
    useEffect(()=>{
        updatePlanets(shuffle(planetsData));
    },[render])
    function handleOnDragEnd(result) {
        if (!result.destination) {
            // User dropped the item outside of the list, so delete it
            const items = Array.from(planets);
            items.splice(result.source.index, 1);
            updatePlanets(items);
            return;
        }

        const items = Array.from(planets);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        updatePlanets(items);
    }

    const [submit, setSubmit] = useState(false);

    function checkOrder() {
        const playerOrder = planets.map((planet) => planet.id);
        const playerOrderSet = new Set(playerOrder);
        const solutionOrderSet = new Set(solutionOrder.slice(0, 4));
        
        const isOrderCorrect =
          playerOrderSet.size === 4 &&
          Array.from(playerOrderSet).every((id) => solutionOrderSet.has(id));
      
        // Update hoverList state based on correctness of each planet's position in the order
        setHoverList(playerOrder.map((id, index) => solutionOrder.indexOf(id) === index));
        if (isOrderCorrect) {
          props.getNextQuestion();
        } else if (!isOrderCorrect) {
          setRender(Date.now());
        }
      }
      
    useEffect(() => {
        updatePlanets(shuffle(planets)); // Shuffle the planets array when the component mounts
    }, []);


    return (
        <div className="App">
            <header className="App-header">
                <p className="text-center font-ibm-thai text-xl 2xl:text-3xl">ลากดาวบริวารที่ไม่ใช่ของดาวพฤหัสทิ้งในหลุมดำ</p>
                <img src="/assets/puzzle_game_page/black-hole.png" className='mx-auto mb-6 mt-4 w-32 2xl:w-52' id="black-hole"/>
                <div className='w-fit mx-auto'>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="characters" direction="horizontal">
                        {(provided) => (
                            <ul className="characters" {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'row' }}>
                                {planets.map(({ id, name, imageUrl }, index) => {
                                    return (
                                        <Draggable key={id} draggableId={id} index={index}>
                                            {(provided) => (
                                                <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <div
                                                        className={` w-24 2xl:w-32 p-2 relative`}
                                                        onDragEnd={() => { setSubmit(false) }}>
                                                        <img src={imageUrl} alt={`${name} Thumb`} className={`${submit ?
                                                            (planets[index].id === solutionOrder[index] ? "opacity-100" : "opacity-50")
                                                            :
                                                            "opacity-100"
                                                            }`} />
                                                        <p className="text-center font-ibm-thai mt-2 font-bold">{name}</p>
                                                    </div>
                                                </li>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
                </div>
                <div className='text-center'>
                    <button className="py-3 rounded-xl mt-6 text-lg bg-gradient-to-r font-ibm-thai
                ease-in-out duration-300 from-[#6e3f92] to-[#a94fa4]
                        hover:marker:from-[#754798] hover:to-[#a65ea3] text-white px-4"
                        onClick={checkOrder}>ส่งคำตอบ</button>
                </div>
            </header>
        </div>
    );
}

export default MoonJupiterSort;
