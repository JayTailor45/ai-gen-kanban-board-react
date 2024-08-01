import React, {useState} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import './KanbanBoard.css';

const KanbanBoard = () => {
    const [newTask, setNewTask] = useState('');
    const [editingTask, setEditingTask] = useState(null); // Track the task being edited
    const [selectedColumn, setSelectedColumn] = useState('column-1');
    const [columns, setColumns] = useState({
        'column-1': {id: 'column-1', title: 'To Do', tasks: []},
        'column-2': {id: 'column-2', title: 'In Progress', tasks: []},
        'column-3': {id: 'column-3', title: 'Done', tasks: []},
    });

    const [columnOrder, setColumnOrder] = useState(['column-1', 'column-2', 'column-3']);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const newColumns = {...columns};
        const [removed] = newColumns[result.source.droppableId].tasks.splice(result.source.index, 1);
        newColumns[result.destination.droppableId].tasks.splice(result.destination.index, 0, removed);

        setColumns(newColumns);
    };

    const addColumn = () => {
        const newColumnId = `column-${Object.keys(columns).length + 1}`;
        setColumns({
            ...columns,
            [newColumnId]: {id: newColumnId, title: `Column ${Object.keys(columns).length + 1}`, tasks: []},
        });
        setColumnOrder([...columnOrder, newColumnId]);
    };

    return (
        <div>
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter new task"
            />
            <select onChange={(e) => setSelectedColumn(e.target.value)} value={selectedColumn}>
                {Object.keys(columns).map((columnId) => (
                    <option key={columnId} value={columnId}>
                        {columns[columnId].title}
                    </option>
                ))}
            </select>
            <button onClick={() => {
                if (editingTask !== null) {
                    const updatedColumns = {...columns};
                    updatedColumns[selectedColumn].tasks[editingTask] = newTask; // Update the task
                    setColumns(updatedColumns);
                    setEditingTask(null); // Reset editing task
                } else {
                    if (newTask) {
                        const updatedColumns = {...columns};
                        updatedColumns[selectedColumn].tasks.push(newTask); // Add new task
                        setColumns(updatedColumns);
                    }
                }
                setNewTask(''); // Clear input
            }}>
                {editingTask !== null ? 'Update Task' : 'Add Task'}
            </button>
            <button onClick={addColumn}>Add Column</button>
            <DragDropContext onDragEnd={onDragEnd}>
                {columnOrder.map((columnId) => {
                    const column = columns[columnId];
                    return (
                        <Droppable key={column.id} droppableId={column.id}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    <h2>
                                        <input
                                            type="text"
                                            value={column.title}
                                            onChange={(e) => {
                                                const updatedColumns = {...columns};
                                                updatedColumns[column.id].title = e.target.value;
                                                setColumns(updatedColumns);
                                            }}
                                            style={{
                                                width: '100%',
                                                textAlign: 'center',
                                                border: 'none',
                                                outline: 'none',
                                                fontSize: '1.2em'
                                            }}
                                        />
                                    </h2>
                                    {column.tasks.map((task, index) => (
                                        <Draggable key={task} draggableId={task} index={index}>
                                            {(provided) => (
                                                <div className={"task"}
                                                     ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    {task}
                                                    <button onClick={() => {
                                                        setNewTask(task); // Set the task to be edited
                                                        setEditingTask(index); // Track the index of the task being edited
                                                    }} style={{
                                                        marginLeft: '10px',
                                                        backgroundColor: 'blue',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer'
                                                    }}>
                                                        Edit
                                                    </button>
                                                    <button onClick={() => {
                                                        const updatedColumns = {...columns};
                                                        updatedColumns[column.id].tasks.splice(index, 1);
                                                        setColumns(updatedColumns);
                                                    }} style={{
                                                        marginLeft: '10px',
                                                        backgroundColor: 'red',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer'
                                                    }}>
                                                        Delete
                                                    </button>
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
