import React, { useState } from 'react';

import "../Style/TodosList.css";

const TodosList = ({ todos, user, onCompleteTodo, addTodo }) => {
    const userTodos = todos.filter(todo => todo.userId === user.id);
    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState('');

    const handleAddTodo = () => {
        addTodo(title);
        setTitle('');
        setShowForm(false);
    };

    const handleCancel = () => {
        setTitle('');
        setShowForm(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>

                <h2>Todos - User {user.id} </h2>
                <button className="add-todo-button" onClick={() => setShowForm(true)}>Add New Todo</button>
            </div>

            {showForm && (
                <div className='add-todo'>
                    <input
                        type="text"
                        value={title}
                        placeholder="Enter title"
                        onChange={(e) => setTitle(e.target.value)}
                        style={{marginBottom:10}}
                        />
                                            <div className="addTodo-buttons">

                    <button onClick={handleAddTodo}>Add</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
                </div>
            )}
            {!showForm &&
                <>
                    {
                        userTodos.map(todo => (
                            <div key={todo.id} className="todos-list" >
                                <div>Title: {todo.title}</div>
                                <div>Completed: {todo.completed.toString()}
                                    {!todo.completed && <button style={{ margin: 5 }} onClick={() => onCompleteTodo(todo.id)}>Mark Completed</button>
                                    }</div>
                            </div>
                        ))
                    }
                </>
            }
        </div>
    );
};

export default TodosList;