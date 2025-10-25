import Project from "./Project.jsx";
import chess from './assets/chess-game-image.png';


export default function ProjectsPage () {

    const projs = [
        {
            title: "Chess App",
            desc: "A fully functioning chess game built with React (well... mostly functioning). This is a fun project to work on and has a lot left to work on before I could call it a fully functioning/featured chess game. Click on the image to head over and play a game.",
            toDoList: ["Computer Opponent", "Opponent Difficulty Slider", "Move History", "Playing as Black", "Game Imports", "Move Analysis"],
            img: chess,
            page: "/chess",
        },
        // {
        //     title: "ERP Lite",
        //     desc: "A lightweight version of an ERP system that handles CRUD operations for Orders, Customers, Inventories, etc. Built on top of X database and the CRUD operations are handled through API calls. The API is built with X Y Z, and the frontend is built with React.",
        //     toDoList: ["Model Database Schema", "Implement & Deploy Database", "Setup API endpoints for CRUD Ops", "Build Dynamic React UI Frontend", "Implement User Auth"],
        // },
        // {
        //     title: "Project 3",
        //     desc: "Description of project 3 in detail",
        //     toDoList: [],
        // }
    ]

    return (
        <div>
            {projs.map((p, i) => (
                <Project key={i} title={p.title} desc={p.desc} list ={p.toDoList} img={p.img} align={p.align} page={p.page}/>
            ))}
        </div>
    );
}