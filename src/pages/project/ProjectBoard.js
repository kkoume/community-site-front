import { useEffect, useState } from "react";
import "../../styles/projectList.scss";
import Navbar from "../../components/project/kanban/Navbar";
import Board from "../../components/project/kanban/Board";
// import data from '../data'
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Editable from "../../components/project/kanban/Editable";
import useLocalStorage from "use-local-storage";

import DefaultLayout from '../../layouts/DefaultLayout'
import axios from "axios";
import { useSelector } from "react-redux";
import url from "../../config/url";


function ProjectBoard() {

  const authSlice = useSelector((state) => state.authSlice);
  const urlParams = new URLSearchParams(window.location.search);
  const projectNo = urlParams.get('projectNo');

  useEffect(() => {
    axios
      .get(`${url.backendUrl}/project/projectboard?projectNo=${projectNo}`, {
        headers: { Authorization: `Bearer ${authSlice.accessToken}` },
      })
      .then((resp) => {
        console.log(resp.data);  // 성공 시 데이터 처리
      })
      .catch((error) => {
        console.error('There was an error!', error);  // 오류 처리
      });
  }, [url.backendUrl, projectNo, authSlice.accessToken]);  // 종속성 배열 추가

  // 보드 추가하기
  const addBoard = (title) => {
    const tempData = [...data];
    console.log("대머리밀어라~" +tempData);
    const newBoard = {
      projectNo: projectNo,
      boardName: title,
      createUserId: authSlice.username,
      card: [],
    }
    tempData.push(newBoard);
    setData(tempData);
    console.log(tempData)

    // Board 추가시 DB 저장
    axios.post(`${url.backendUrl}/project/boardinsert`, newBoard)
      .then(res => {
        console.log("프로젝트 등록");
        
        setData(prevData => [...prevData, res.data]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };



  const [data, setData] = useState(
    localStorage.getItem("kanban-board")
      ? JSON.parse(localStorage.getItem("kanban-board"))
      : []
  );

  const defaultDark = window.matchMedia(
    "(prefers-colors-scheme: dark)"
  ).matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );

  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const setName = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].boardName = title;
    setData(tempData);
  };

  const dragCardInBoard = (source, destination) => {
    let tempData = [...data];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    tempData[destinationBoardIdx].card.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].card[source.index]
    );
    tempData[sourceBoardIdx].card.splice(source.index, 1);

    return tempData;
  };


  //카드 추가하기
  const addCard = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].card.push({
      id: uuidv4(),
      title: title,
      tags: [],
      task: [],
    });
    setData(tempData);

     // Board 추가시 DB 저장
     /*
     axios.post(`${url.backendUrl}/project/cardinsert?boardNo=${projectNo}`, tempData)
     .then(res => {
       console.log("프로젝트 등록");
       
       setData(prevData => [...prevData, res.data]);
     })
     .catch(function (error) {
       console.log(error);
     });
     */
  };

  const removeCard = (boardId, cardId) => {
    const index = data.findIndex((item) => item.id === boardId);
    const tempData = [...data];
    const cardIndex = data[index].card.findIndex((item) => item.id === cardId);

    tempData[index].card.splice(cardIndex, 1);
    setData(tempData);
  };

  
  const removeBoard = (bid) => {
    const tempData = [...data];
    const index = data.findIndex((item) => item.id === bid);
    tempData.splice(index, 1);
    setData(tempData);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    setData(dragCardInBoard(source, destination));
  };

  const updateCard = (bid, cid, card) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].card;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].card[cardIndex] = card;
    console.log(tempBoards);
    setData(tempBoards);
  };

  useEffect(() => {
    localStorage.setItem("kanban-board", JSON.stringify(data));
  }, [data]);

  return (
    <div>
      <DefaultLayout>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="KanBanBoard" data-theme={theme}>
            <Navbar switchTheme={switchTheme} />
            <div className="app_outer">
              <div className="app_boards">
                {data.map((item) => (
                  <Board
                    key={item.id}
                    id={item.id}
                    name={item.boardName}
                    card={item.card}
                    setName={setName}
                    addCard={addCard}
                    removeCard={removeCard}
                    removeBoard={removeBoard}
                    updateCard={updateCard}
                  />
                ))}
                <Editable
                  class={"add__board"}
                  name={"Add Board"}
                  btnName={"Add Board"}
                  onSubmit={addBoard}
                  placeholder={"Enter Board  Title"}
                />
              </div>
            </div>
          </div>
        </DragDropContext>
      </DefaultLayout>
    </div>
  );
}

export default ProjectBoard;