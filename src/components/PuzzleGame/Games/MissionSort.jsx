import React, { useState ,useEffect} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { shuffle } from "lodash"
let planetsData = [
    { id: 'apollo11', name: 'Apollo 11', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Aldrin_Apollo_11_original.jpg/1200px-Aldrin_Apollo_11_original.jpg' },
    { id: 'voyager', name: 'Voyager', imageUrl: 'https://voyager.jpl.nasa.gov/assets/images/galleries/Spacecraft_Profile.jpg' },
    { id: 'hubble', name: 'Hubble Space Telescope', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/HST-SM4.jpeg' },
    { id: 'sputnik', name: 'Sputnik', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Sputnik_asm.jpg/800px-Sputnik_asm.jpg' },
    { id: 'marsrover', name: 'Mars Exploration Rover', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/NASA_Mars_Rover.jpg' }
  ];
  

const solutionOrder = planetsData.map((planet) => planet.id); // The solution list of planet IDs

function MissionSort(props) {
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

    function checkOrder() {
        setSubmit(true);
        const playerOrder = planets.map((planet) => planet.id);
        const isOrderCorrect = JSON.stringify(playerOrder) === JSON.stringify(solutionOrder);

        // Update hoverList state based on correctness of each planet's position in the order
        setHoverList(playerOrder.map((id, index) => solutionOrder.indexOf(id) === index));
        if(isOrderCorrect){
            props.getNextQuestion();
        }
    }
    useEffect(() => {
        updatePlanets(shuffle(planets)); // Shuffle the planets array when the component mounts
      }, []);

    return (
        <div className="">
            <header className="App-header">
                <p className="text-center font-ibm-thai text-3xl">จัดเรียงภาพภารกิจทางอวกาศให้ตรงกับข้อความ</p>
                <div className="font-ibm-thai text-xl mb-10 mt-2 px-2 mx-auto grid grid-cols-10">
                    {planetsData.map((item)=>(
                        <div className="col-span-2 ">
                            <p className="text-center">{item.name}</p>
                        </div>
                    ))}
                </div>
                <div className='w-fit mx-auto'>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="characters" direction="horizontal">
                        {(provided) => (
                            <ul className="flex" {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'row' }}>
                                {planets.map(({ id, name, imageUrl }, index) => {
                                    return (
                                            <Draggable key={id} draggableId={id} index={index}>
                                            {(provided) => (
                                                <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <div
                                                        className={`p-2 relative`}
                                                    onDragEnd={()=>{setSubmit(false)}}>
                                                        <img src={imageUrl} alt={`${name} Thumb`} className={`w-40 h-40 ${submit ?
                                                                (planets[index].id === solutionOrder[index] ? "opacity-100" : "opacity-50")
                                                                :
                                                                "opacity-100"
                                                            }`}/>
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

export default MissionSort;
