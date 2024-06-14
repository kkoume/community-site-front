import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ProjectInfo from "./ProjectInfo";
import axios from 'axios';
import { useSelector } from "react-redux";
import url from "../../config/url";

// 초기 아이템을 빈 배열로 설정합니다.
const initialItems1 = [];
const initialItems2 = [];
const initialItems3 = [];

const DragAndDrop = () => {

  ///선택

  const authSlice = useSelector((state) => state.authSlice);

  if(!authSlice.username){
    if(window.confirm('로그인 후 이용가능한 페이지입니다. 로그인 페이지로 이동하시겠습니까?')){
      window.location.href='/user/login'
    }else{
      window.location.href='/main'
    }
    
  }
  // 상태로 각 섹션의 아이템을 관리합니다.
  const [items1, setItems1] = useState(initialItems1);
  const [items2, setItems2] = useState(initialItems2);
  const [items3, setItems3] = useState(initialItems3);
  const [AddItemStatus, setAddItemStatus] = useState(false);
  const [AddItemStatus1, setAddItemStatus1] = useState(false);
  const [AddItemStatus2, setAddItemStatus2] = useState(false);
  const [AddItemStatus3, setAddItemStatus3] = useState(false);

  // 새 아이템의 고유 ID를 생성하는 함수입니다.
  const ItemId = () => `item-${new Date().getTime()}`; //Date - 타임스탬프를 얻음
  const [title1, setTitle1] = useState(""); //입력한 제목 상태 저장
  const [title2, setTitle2] = useState(""); //입력한 제목 상태 저장
  const [title3, setTitle3] = useState(""); //입력한 제목 상태 저장

  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [member, setMember] = useState("");

//Get요청
  axios.get(`${url.backend}/project/select`, { params: {
      memeber : authSlice.username
    }}
    ).then((response) => {
     console.log("dd") 
    }).catch(function (error) {
      console.log(error);
    });


  
// 아이템 생성
  const addItem = (setItems) => {

    if (!title1.trim()) return;
    const newItem = {id: ItemId(), title1 : title1 , member : authSlice.username, status: 'Ready'};
    setItems((prevItems) => [...prevItems, newItem]);
    
    console.log(newItem )
  
    axios.post(`${url.backend}/project/insert`, newItem  )
    .then(response => {
      console.log("아아아나");
    })
    .catch(function (error) {
      console.log(error);
    });

    setTitle1("");
    setAddItemStatus(false);
  };

  const addItem2 = (setItems) => {
    if (!title2.trim()) return;
    const newItem = { id: ItemId(), title2, content, status, member };
    setItems((prevItems) => [...prevItems, newItem]);
    setTitle2("");
    setContent("");
    setStatus("");
    setMember("");
    setAddItemStatus(false);
  };

  const addItem3 = (setItems) => {
    if (!title3.trim()) return;
    const newItem = { id: ItemId(), title3, content, status, member };
    setItems((prevItems) => [...prevItems, newItem]);
    setTitle3("");
    setContent("");
    setStatus("");
    setMember("");
    setAddItemStatus(false);
  };


  // 드래그 종료 시 호출되는 함수입니다.
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // 드래그가 Droppable 영역 외부에서 끝난 경우
    if (!destination) return;

    // 동일한 Droppable 내에서의 이동을 처리하는 함수입니다.
    const updateItems = (items, setItems) => {
      const newItems = Array.from(items);
      const [movedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, movedItem);
      setItems(newItems);
    };

    // 동일한 Droppable 내에서 이동 시
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "droppable1") {
        updateItems(items1, setItems1);
      } else if (source.droppableId === "droppable2") {
        updateItems(items2, setItems2);
      } else if (source.droppableId === "droppable3") {
        updateItems(items3, setItems3);
      }
    }
    // 다른 Droppable로의 이동 시
    else {
      const moveItemBetweenLists = (sourceItems, setSourceItems, destItems, setDestItems) => {
        const sourceCopy = Array.from(sourceItems);
        const destCopy = Array.from(destItems);
        const [movedItem] = sourceCopy.splice(source.index, 1);
        destCopy.splice(destination.index, 0, movedItem);
        setSourceItems(sourceCopy);
        setDestItems(destCopy);
      };

      if (source.droppableId === "droppable1" && destination.droppableId === "droppable2") {
        moveItemBetweenLists(items1, setItems1, items2, setItems2);
      } else if (source.droppableId === "droppable2" && destination.droppableId === "droppable1") {
        moveItemBetweenLists(items2, setItems2, items1, setItems1);
      } else if (source.droppableId === "droppable1" && destination.droppableId === "droppable3") {
        moveItemBetweenLists(items1, setItems1, items3, setItems3);
      } else if (source.droppableId === "droppable3" && destination.droppableId === "droppable1") {
        moveItemBetweenLists(items3, setItems3, items1, setItems1);
      } else if (source.droppableId === "droppable2" && destination.droppableId === "droppable3") {
        moveItemBetweenLists(items2, setItems2, items3, setItems3);
      } else if (source.droppableId === "droppable3" && destination.droppableId === "droppable2") {
        moveItemBetweenLists(items3, setItems3, items2, setItems2);
      }
    }
  };

  ////// ProjectInfo ///////

  const [projectInfo, setProjectInfo] = useState({
    "projectName" : "오늘 할일",
    "projectContent" : "예나씨 놀리기"
  })

  const [rightSideBar, setRightSideBar] = useState(false);

  const rightProjectInfo = () => {
    return setRightSideBar(true);
  }
  const rightSideHandlerClose = (event) => {
    const testBox = document.getElementsByClassName("projectBox")[0];
    if (event.target === testBox){
        return setRightSideBar(false);

    }
  }



  return (
    <div className="ProjectList">
      <div className="DragAndDrop">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="droppable-container">

{/*////////////////////////--Ready 아이템 생성--/////////////////////////////////////////////////////////*/ }

         <Droppable droppableId="droppable1">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="droppable">
                  <h3>Ready</h3>
                  {!AddItemStatus1 && <button onClick={() => setAddItemStatus1(true)}>Add Item</button>}
                  {AddItemStatus1 && (
                    <div className="addItemBar">
                      <input
                        type="text"
                        value={title1}
                        onChange={(e) => setTitle1(e.target.value)}
                        placeholder="Enter title"
                      />
                      <button onClick={() => addItem(setItems1, title1, setTitle1, setAddItemStatus1(false))}>Add</button>
                    </div>
                  )}
                  {items1.map((item1, index) => (
                    <Draggable key={item1.id} draggableId={item1.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`draggable ${snapshot.isDragging ? "is-dragging" : ""}`}
                          onClick={rightProjectInfo}
                        >
                          <h4>{item1.title1}</h4>
                          <h4>{item1.title2}</h4>
                          <h4>{item1.title3}</h4>

                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>



{/*////////////////////////--InProgress 아이템 생성--/////////////////////////////////////////////////////////*/ }


            <Droppable droppableId="droppable2">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="droppable">
                  <h3>InProgress</h3>
                  {!AddItemStatus2 && <button onClick={() => setAddItemStatus2(true)}>Add Item</button>}
                  {AddItemStatus2 && (
                    <div>
                      <input
                        type="text"
                        value={title2}
                        onChange={(e) => setTitle2(e.target.value)}
                        placeholder="Enter title"
                      />
                      <button onClick={() => addItem2(setItems2, title2, setTitle2, setAddItemStatus2(false))}>Add</button>
                    </div>
                  )}
                  {items2.map((item2, index) => (
                    <Draggable key={item2.id} draggableId={item2.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`draggable ${snapshot.isDragging ? "is-dragging" : ""}`}
                          onClick={rightProjectInfo}
                        >
                          <h4>{item2.title1}</h4>
                          <h4>{item2.title2}</h4>
                          <h4>{item2.title3}</h4>
                          
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

{/*////////////////////////--Complete 아이템 생성--/////////////////////////////////////////////////////////*/ }


            <Droppable droppableId="droppable3">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="droppable">
                  <h3>Complete</h3>
                  {!AddItemStatus3 && <button onClick={() => setAddItemStatus3(true)}>Add Item</button>}
                  {AddItemStatus3 && (
                    <div>
                      <input
                        type="text"
                        value={title3}
                        onChange={(e) => setTitle3(e.target.value)}
                        placeholder="Enter title"
                      />
                      <button onClick={() => addItem3(setItems3, title3, setTitle3, setAddItemStatus3(false))}>Add</button>
                    </div>
                  )}
                  {items3.map((item3, index) => (
                    <Draggable key={item3.id} draggableId={item3.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`draggable ${snapshot.isDragging ? "is-dragging" : ""}`}
                          onClick={rightProjectInfo}
                        >
                          <h4>{item3.title1}</h4>
                          <h4>{item3.title2}</h4>
                          <h4>{item3.title3}</h4>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

{/*/////////////////////////////////////////////////////////////////////////////////////////*/ }


          </div>
        </DragDropContext>

      </div>
    
      {rightSideBar && <ProjectInfo rightSideHandlerClose={rightSideHandlerClose} projectInfo={projectInfo}></ProjectInfo>}

    </div>
  );
};

export default DragAndDrop;
