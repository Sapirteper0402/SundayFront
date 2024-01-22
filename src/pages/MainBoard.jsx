import { useState } from "react";
import { AppHeader } from "../cmps/AppHeader";
import { BoardsIndex } from "../cmps/BoardsIndex";
import { SideNav } from "../cmps/SideNav";
import { BoardIndex } from "./BoardIndex";
import { useSelector } from "react-redux";



export function MainBoard() {
    
    // const boards = useSelector((storeState) => storeState.boardModule.boards)
    const [renderBoard, setRenderBoard] = useState(null)
    // const [currBoard, setCurrBoard] = useState(null);

    // useEffect(() => {

    // },[isBoardsList])

    function onChooseBoard(BoardId){
        setRenderBoard(BoardId)
    }
    
    return (
        <main className="main-board">
            <section className='main-board-header'>
                <AppHeader />
            </section>
            <section className='boards-index'>
            {!renderBoard ? <BoardsIndex onChooseBoard={onChooseBoard}/> : <BoardIndex/>}
            </section>
            <section className='side-nav'>
                <SideNav />
            </section>
        </main>
    )
}