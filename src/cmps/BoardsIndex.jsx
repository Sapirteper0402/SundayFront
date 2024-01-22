
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { loadBoards} from "../store/board.actions.js";
import { BoardPreview } from "./BoardPreview.jsx";

// render all boards
export function BoardsIndex({onChooseBoard}) {
  
  const boards = useSelector((storeState) => storeState.boardModule.boards)

  useEffect(() => {
    loadBoards()
  }, [])

  console.log('boards' , boards)

  return (
      <ul className="boards-list">
          {boards.map(board => ( <BoardPreview key={board._id} board={board} onChooseBoard={onChooseBoard}/>
          ))}
      </ul>
  )
}

