import React, {useState} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import './KanbanBoard.css';

const KanbanBoard = () => {
    const [newTask, setNewTask] = useState('');
    const [taskId, setTaskId] = useState(null);
    const [editingTask, setEditingTask] = useState(null); // Track the task being edited
    const [selectedColumn, setSelectedColumn] = useState('column-1');
    const [taskPriority, setTaskPriority] = useState('Low'); // Track the priority of the new task
    const [columns, setColumns] = useState({
        'column-1': {id: 'column-1', title: 'To Do', tasks: [{id: 'task-123-123-123', name: 'A task', priority: 'low'}]},
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

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'red';
            case 'medium':
                return 'orange';
            case 'low':
                return 'green';
            default:
                return 'gray';
        }
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
            <select onChange={(e) => setTaskPriority(e.target.value)} value={taskPriority}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <button onClick={() => {
                if (editingTask !== null) {
                    const updatedColumns = {...columns};
                    if (!updatedColumns[selectedColumn].tasks[editingTask]) {
                        for (let col in updatedColumns) {
                            updatedColumns[col].tasks = updatedColumns[col].tasks.filter(task => task.id !== taskId)
                        }
                    }
                    const task = {name: newTask, id: taskId, priority: taskPriority};
                    updatedColumns[selectedColumn].tasks[editingTask] = task; // Update the task
                    setColumns(updatedColumns);
                    setEditingTask(null); // Reset editing task
                } else {
                    if (newTask) {
                        const getRandomNumber = () => Math.floor(Math.random() * 100000);
                        const updatedColumns = {...columns};
                        const newTaskId = `task-${getRandomNumber()}-${getRandomNumber()}-${getRandomNumber()}`; // Generate a unique ID for the new task
                        updatedColumns[selectedColumn].tasks.push({name: newTask, id: newTaskId, priority: taskPriority}); // Add new task
                        setColumns(updatedColumns);
                    }
                }
                setNewTask(''); // Clear input
                setTaskId(null); // Clear taskId
                setSelectedColumn(Object.keys(columns)[0]); // rest default column
                setTaskPriority('low'); // Reset priority
            }}>
                {editingTask !== null ? 'Update Task' : 'Add Task'}
            </button>
            {editingTask !== null && (
                <button onClick={() => {
                    setEditingTask(null); // Cancel editing
                    setNewTask(''); // Clear input
                    setTaskId(null); // Clear taskId
                    setSelectedColumn(Object.keys(columns)[0]); // rest default column
                    setTaskPriority('low'); // Reset priority
                }} style={{
                    marginLeft: '10px',
                    backgroundColor: 'gray',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}>
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
                                                        <div className={"task-name-wrapper"}>
                                                            <div title={task.priority} style={{
                                                                width: '15px',
                                                                height: '15px',
                                                                borderRadius: '50%',
                                                                backgroundColor: getPriorityColor(task.priority),
                                                                display: 'inline-block',
                                                                marginRight: '10px'
                                                            }}></div>
                                                            {task.name}
                                                        </div>
                                                        <div style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: 'space-between'
                                                        }}>
                                                            <button onClick={() => {
                                                                setNewTask(task.name); // Set the task to be edited
                                                                setEditingTask(index); // Track the index of the task being edited
                                                                setTaskId(task.id); // Track the taskId of the task being edited
                                                                setSelectedColumn(column.id);
                                                                setTaskPriority(task.priority); // Set the priority for editing
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
