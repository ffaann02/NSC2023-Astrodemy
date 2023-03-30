import React, { useState ,useEffect} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { shuffle } from "lodash"

const planetsData = [
    { id: 'jupiter', name: 'Jupiter', imageUrl: '/assets/puzzle_game_page/PlanetSort/jupiter.png' },
    { id: 'saturn', name: 'Saturn', imageUrl: '/assets/puzzle_game_page/PlanetSort/saturn.png' },
    { id: 'uranus', name: 'Uranus', imageUrl: '/assets/puzzle_game_page/PlanetSort/uranus.png' },
    { id: 'neptune', name: 'Neptune', imageUrl: '/assets/puzzle_game_page/PlanetSort/neptune.png' },
    { id: 'earth', name: 'Earth', imageUrl: '/assets/puzzle_game_page/PlanetSort/earth.png' },
    { id: 'venus', name: 'Venus', imageUrl: '/assets/puzzle_game_page/PlanetSort/venus.png' },
    { id: 'mars', name: 'Mars', imageUrl: '/assets/puzzle_game_page/PlanetSort/mars.png' },
    { id: 'mercury', name: 'Mercury', imageUrl: '/assets/puzzle_game_page/PlanetSort/mercury.jpeg' }
];

const solutionOrder = planetsData.map((planet) => planet.id); // The solution list of planet IDs

function PlanetSortSize(props) {
    const [planets, updatePlanets] = useState(planetsData);
    const [hoverList, setHoverList] = useState(Array(8).fill(true));
    function handleOnDragEnd(result) {
        if (!result.destination) return;

        const items = Array.from(planets);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        updatePlanets(items);
    }
    const [submit, setSubmit] = useState(false);
    useEffect(() => {
        updatePlanets(shuffle(planets)); // Shuffle the planets array when the component mounts
      }, []);
    function checkOrder() {
        setSubmit(true);
        const playerOrder = planets.map((planet) => planet.id);
        const isOrderCorrect = JSON.stringify(playerOrder) === JSON.stringify(solutionOrder);

        // Update hoverList state based on correctness of each planet's position in the order
        setHoverList(playerOrder.map((id, index) => solutionOrder.indexOf(id) === index));
        if (isOrderCorrect) {
            props.getNextQuestion();
        }
    }


    return (
        <div className="App">
            <header className="App-header">
                <p className="text-center mb-10 font-ibm-thai text-3xl">จัดเรียงดาวเคราะห์จากขนาดใหญ่สุด - เล็กสุด</p>
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
                                                        className={`${name === "Saturn" ? "w-44" : "w-32"} p-2 relative`}
                                                        onDragEnd={()=>{setSubmit(false)}}>
                                                        <img src={imageUrl} alt={`${name} Thumb`} className={`${submit ?
                                                            (planets[index].id === solutionOrder[index] ? "opacity-100" : "opacity-50")
                                                            :
                                                            "opacity-100"
                                                            }`} />
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

export default PlanetSortSize;
