import React, {useState} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import './KanbanBoard.css';

const KanbanBoard = () => {
    const [newTask, setNewTask] = useState('');
    const [taskId, setTaskId] = useState(null);
    const [editingTask, setEditingTask] = useState(null); // Track the task being edited
    const [selectedColumn, setSelectedColumn] = useState('column-1');
    const [columns, setColumns] = useState({
        'column-1': {id: 'column-1', title: 'To Do', tasks: [{id: 'task-123-123-123', name: 'A task'}]},
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
                    if(!updatedColumns[selectedColumn].tasks[editingTask]) {
                        for (let col in updatedColumns) {
                            updatedColumns[col].tasks = updatedColumns[col].tasks.filter(task => task.id !== taskId)
                        }
                    }
                    const task = { name: newTask, id: taskId };
                    updatedColumns[selectedColumn].tasks[editingTask] = task; // Update the task
                    setColumns(updatedColumns);
                    setEditingTask(null); // Reset editing task
                } else {
                    if (newTask) {
                        const getRandomNumber = () => Math.floor(Math.random() * 100000);
                        const updatedColumns = {...columns};
                        const newTaskId = `task-${getRandomNumber()}-${getRandomNumber()}-${getRandomNumber()}`; // Generate a unique ID for the new task
                        updatedColumns[selectedColumn].tasks.push({ name: newTask, id: newTaskId }); // Add new task
                        setColumns(updatedColumns);
                    }
                }
                setNewTask(''); // Clear input
                setTaskId(null); // Clear taskId
                setSelectedColumn(Object.keys(columns)[0]); // rest default column
            }}>
                {editingTask !== null ? 'Update Task' : 'Add Task'}
            </button>
            {editingTask !== null && (
                <button onClick={() => {
                    setEditingTask(null); // Cancel editing
                    setNewTask(''); // Clear input
                    setTaskId(null); // Clear taskId
                    setSelectedColumn(Object.keys(columns)[0]); // rest default column
                }} style={{ marginLeft: '10px', backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Cancel
                </button>
            )}
            <button onClick={addColumn}>Add Column</button>
            <div className="kanban-board">
                <DragDropContext onDragEnd={onDragEnd}>
                    {columnOrder.map((columnId) => {
                        const column = columns[columnId];
                        return (
                            <Droppable key={column.id} droppableId={column.id}>
                                {(provided) => (
                                    <div class={"column"} ref={provided.innerRef} {...provided.droppableProps}>
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
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided) => (
                                                    <div className={"task"}
                                                         ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        {task.name} - <strong>{task.priority}</strong>
                                                        <div style={{display: "flex", alignItems: "center", justifyContent: 'space-between'}}>
                                                            <button onClick={() => {
                                                                setNewTask(task.name); // Set the task to be edited
                                                                setEditingTask(index); // Track the index of the task being edited
                                                                setTaskId(task.id); // Track the taskId of the task being edited
                                                                setSelectedColumn(column.id);
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
        </div>
    );
};

export default KanbanBoard;
