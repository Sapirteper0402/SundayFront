// import routes from '../routes'
import { NavLink, useParams } from "react-router-dom";
import { svgService } from "../svg.service";
import { useState } from "react";

export function SideNav({ boards, onRemoveBoard, onAddBoard, onUpdateBoard }) {
  const [isShowTextBox, setIsShowTextBox] = useState(false);
  const [boardTitleToChang, setBoardTitleToChang] = useState("")
  const [inputFocused, setInputFocused] = useState(null)

  const [ filterText, setFilterText ] = useState ('')

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = (board) => {
    setInputFocused(false);
    onUpdateBoard(board);
  };
  const homeIcon = svgService.getSvg("home");
  const homeIconUrl = `data:image/svg+xml,${encodeURIComponent(homeIcon)}`;

  const boardIcon = svgService.getSvg("clipboard");
  const boardIconUrl = `data:image/svg+xml,${encodeURIComponent(boardIcon)}`;

  const searchIcon = svgService.getSvg("search");
  const searchIconUrl = `data:image/svg+xml,${encodeURIComponent(searchIcon)}`;

  const filteredBoards = boards.filter ( board => board.title.includes(filterText))
 
  function onChangeBoardTitle(boardId) {
    setBoardTitleToChang(board);
    setIsShowTextBox(true);
  }

  function handleChange(ev) {
    const val = ev.target.value;
    setBoardTitleToChang((prevBoard) => ({ ...prevBoard, title: val }));
  }

  // const params = useParams()
  return (
    <nav className="side-navigation">
      <section className="sidenav-header">
        <div className="sidnav-home">
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true" class="icon_df339fdbe4 noFocusStyle_f92aa008bb" data-testid="icon"><path d="M9.56992 2.1408C9.82591 1.95307 10.1741 1.95307 10.4301 2.1408L17.7028 7.47413C17.8896 7.61113 18 7.82894 18 8.06061V16.7879C18 17.1895 17.6744 17.5152 17.2727 17.5152H11.9394C11.5377 17.5152 11.2121 17.1895 11.2121 16.7879V13.1515H8.78788V16.7879C8.78788 17.1895 8.46227 17.5152 8.06061 17.5152H2.72727C2.32561 17.5152 2 17.1895 2 16.7879V8.06061C2 7.82894 2.11037 7.61113 2.29719 7.47413L9.56992 2.1408ZM3.45455 8.42914V16.0606H7.33333V12.4242C7.33333 12.0226 7.65894 11.697 8.06061 11.697H11.9394C12.3411 11.697 12.6667 12.0226 12.6667 12.4242V16.0606H16.5455V8.42914L10 3.62914L3.45455 8.42914Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
          <NavLink to={`/boards`}>Home</NavLink>
        </div>
      </section>

      <section className="sidenav-main">
      <section className="main-header">
        <section className="main-title">
          <div className="workspace-name"><span>S</span></div>
          <h2>Main workspace</h2>
        </section>

        <section className="sidenav-search">
          <section className="search-input">
            <label htmlFor="searchGroup" hidden>search group</label>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text"
                   id="searchGroup"
                   name="searchGroup"
                   placeholder="Search"
                   value = {filterText}
                   onChange= { (e) => setFilterText (e.target.value) } />
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" role="img" aria-hidden="true"><path d="M17.8571 2.87669C18.107 3.41157 18.0246 4.04275 17.6457 4.49555L12.4892 10.6589V15.3856C12.4892 16.0185 12.097 16.5852 11.5048 16.8082L9.56669 17.5381C9.09976 17.7139 8.57627 17.6494 8.16598 17.3655C7.75569 17.0816 7.51084 16.6144 7.51084 16.1155V10.6589L2.35425 4.49555C1.97542 4.04275 1.89302 3.41157 2.14291 2.87669C2.39279 2.34182 2.92977 2 3.52013 2H16.4799C17.0702 2 17.6072 2.34182 17.8571 2.87669ZM16.4799 3.52012H3.52013L8.91611 9.96964C8.99036 10.0584 9.03096 10.1698 9.03096 10.2848V16.1155L10.969 15.3856V10.2848C10.969 10.1698 11.0096 10.0584 11.0839 9.96964L16.4799 3.52012Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>            
          </section>
          <button className="add-group-btn" onClick={() => onAddBoard()}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true" class="icon_d24b689566 noFocusStyle_07ecef1878" data-testid="icon"><path d="M10.75 6C10.75 5.58579 10.4142 5.25 10 5.25C9.58579 5.25 9.25 5.58579 9.25 6V9.25H6C5.58579 9.25 5.25 9.58579 5.25 10C5.25 10.4142 5.58579 10.75 6 10.75H9.25V14C9.25 14.4142 9.58579 14.75 10 14.75C10.4142 14.75 10.75 14.4142 10.75 14V10.75H14C14.4142 10.75 14.75 10.4142 14.75 10C14.75 9.58579 14.4142 9.25 14 9.25H10.75V6Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
          </button>
        </section>

        <section className="sidenav-boards">
          {filteredBoards.map((board) => (
            <div key={board._id} className="sidenav-board">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                width="19"
                height="19"
                aria-hidden="true"
                aria-label="Public board"
                class="icon_component"
              >
                <path
                  d="M7.5 4.5H16C16.2761 4.5 16.5 4.72386 16.5 5V15C16.5 15.2761 16.2761 15.5 16 15.5H7.5L7.5 4.5ZM6 4.5H4C3.72386 4.5 3.5 4.72386 3.5 5V15C3.5 15.2761 3.72386 15.5 4 15.5H6L6 4.5ZM2 5C2 3.89543 2.89543 3 4 3H16C17.1046 3 18 3.89543 18 5V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V5Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <NavLink key={board._id} to={`/boards/${board._id}`}>
                {board.title}
              </NavLink>
              {
                // <button onClick={() => onChangeBoardTitle(board)}>E</button>
              }
              {isShowTextBox && (
                <input
                  onFocus={handleInputFocus}
                  onBlur={() => handleInputBlur(board)}
                  onChange={() => handleChange(board)}
                />
              )}

              <button className="more-btn-show" onClick={() => onRemoveBoard(board._id)}>
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true" class="icon_d24b689566 noFocusStyle_07ecef1878" data-testid="icon"><path d="M6 10.5C6 11.3284 5.32843 12 4.5 12 3.67157 12 3 11.3284 3 10.5 3 9.67157 3.67157 9 4.5 9 5.32843 9 6 9.67157 6 10.5zM11.8333 10.5C11.8333 11.3284 11.1618 12 10.3333 12 9.50492 12 8.83334 11.3284 8.83334 10.5 8.83334 9.67157 9.50492 9 10.3333 9 11.1618 9 11.8333 9.67157 11.8333 10.5zM17.6667 10.5C17.6667 11.3284 16.9951 12 16.1667 12 15.3383 12 14.6667 11.3284 14.6667 10.5 14.6667 9.67157 15.3383 9 16.1667 9 16.9951 9 17.6667 9.67157 17.6667 10.5z" fill="currentColor"></path></svg>
              </button>
            </div>
          ))}

        </section>
      </section>
    </nav>
  );
}
