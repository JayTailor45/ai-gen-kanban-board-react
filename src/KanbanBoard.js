import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const KanbanBoard = () => {
    const [columns, setColumns] = useState({
        'column-1': { id: 'column-1', title: 'To Do', tasks: [] },
        'column-2': { id: 'column-2', title: 'In Progress', tasks: [] },
        'column-3': { id: 'column-3', title: 'Done', tasks: [] },
    });

    const [columnOrder, setColumnOrder] = useState(['column-1', 'column-2', 'column-3']);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const newColumns = { ...columns };
        const [removed] = newColumns[result.source.droppableId].tasks.splice(result.source.index, 1);
        newColumns[result.destination.droppableId].tasks.splice(result.destination.index, 0, removed);

        setColumns(newColumns);
    };

    const addColumn = () => {
        const newColumnId = `column-${Object.keys(columns).length + 1}`;
        setColumns({
            ...columns,
            [newColumnId]: { id: newColumnId, title: `Column ${Object.keys(columns).length + 1}`, tasks: [] },
        });
        setColumnOrder([...columnOrder, newColumnId]);
    };

    return (
        <div>
            <button onClick={addColumn}>Add Column</button>
            <DragDropContext onDragEnd={onDragEnd}>
                {columnOrder.map((columnId) => {
                    const column = columns[columnId];
                    return (
                        <Droppable key={column.id} droppableId={column.id}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    <h2>{column.title}</h2>
                                    {column.tasks.map((task, index) => (
                                        <Draggable key={task} draggableId={task} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    {task}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    );
                })}
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
