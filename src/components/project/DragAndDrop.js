import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const initialItems1 = [
  { id: "item-1", content: "Item 1" },
  { id: "item-2", content: "Item 2" },
];

const initialItems2 = [
  { id: "item-3", content: "Item 3" },
  { id: "item-4", content: "Item 4" },
];

const initialItems3 = [
  { id: "item-5", content: "Item 5" },
  { id: "item-6", content: "Item 6" },
];

const DragAndDrop = () => {
  const [items1, setItems1] = useState(initialItems1);
  const [items2, setItems2] = useState(initialItems2);
  const [items3, setItems3] = useState(initialItems3);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // 드래그가 Droppable 영역 외부에서 끝난 경우
    if (!destination) {
      return;
    }

    const updateItems = (items, setItems) => {
      const newItems = Array.from(items);
      const [movedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, movedItem);
      setItems(newItems);
    };

    // 동일한 Droppable 내에서의 이동
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "droppable1") {
        updateItems(items1, setItems1);
      } else if (source.droppableId === "droppable2") {
        updateItems(items2, setItems2);
      } else if (source.droppableId === "droppable3") {
        updateItems(items3, setItems3);
      }
    }
    // 다른 Droppable로의 이동
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

  return (
    <div className="ProjectList">
        <div className="DragAndDrop">
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="droppable-container">
            <Droppable droppableId="droppable1">
                {(provided) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="droppable"
                >
                    <h3>Ready</h3>

                    {items1.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`draggable ${
                            snapshot.isDragging ? "is-dragging" : ""
                            }`}
                        >
                            {item.content}
                        </div>
                        )}
                    </Draggable>
                    ))}
                    {provided.placeholder}

                    
                </div>
                )}
            </Droppable>

            <Droppable droppableId="droppable2">
                {(provided) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="droppable"
                >

                    <h3>In Progress</h3>

                    {items2.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`draggable ${
                            snapshot.isDragging ? "is-dragging" : ""
                            }`}
                        >
                            {item.content}
                        </div>
                        )}
                    </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>

            <Droppable droppableId="droppable3">
                {(provided) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="droppable"
                >

                    <h3>Complete</h3>

                    {items3.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`draggable ${
                            snapshot.isDragging ? "is-dragging" : ""
                            }`}
                        >
                            {item.content}
                        </div>
                        )}
                    </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>
            </div>
        </DragDropContext>
        </div>
    </div>
  );
};

export default DragAndDrop;
