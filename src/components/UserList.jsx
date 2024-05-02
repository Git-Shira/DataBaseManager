import axios from 'axios';
import React, { useState, useEffect } from 'react';

import TodosList from './TodosList';
import PostsList from './PostsList';
import AddUser from './AddUser';

import "../Style/UserList.css";

function App() {
    const [usersWithCompletedField, setUsersWithCompletedField] = useState([]);
    const [todosData, setTodosData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [postsData, setPostsData] = useState([]);

    const [filteredUsers, setFilteredUsers] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [userDataToShow, setUserDataToShow] = useState(null);

    const [showForm, setShowForm] = useState(false);


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [zipcode, setZipcode] = useState('');

    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
                const usersData = await usersResponse.data;

                const todosResponse = await axios.get('https://jsonplaceholder.typicode.com/todos');
                const todosData = await todosResponse.data;

                const postsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts');
                const postsData = await postsResponse.data;

                const usersWithCompletedField = usersData.map(user => {
                    const userTodos = todosData.filter(todo => todo.userId === user.id);
                    const uncompletedTodosCount = userTodos.filter(todo => todo.completed === false).length;

                    return {
                        ...user,
                        completed: uncompletedTodosCount
                    };
                });

                setUsersWithCompletedField(usersWithCompletedField);

                setUsersData(usersData);
                setTodosData(todosData);
                setPostsData(postsData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        const filteredUsers = usersWithCompletedField.filter(user =>
            user.name.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredUsers(filteredUsers);
    }, [usersWithCompletedField, searchText]);


    const handleShowMoreData = (user) => {
        if (userDataToShow && user.id !== userDataToShow.id) {
            setName("");
            setEmail("");
            setCity("");
            setStreet("");
            setZipcode("");
        }

        setUserDataToShow(user);
    };

    const handleHideMoreData = () => {
        setUserDataToShow(null);
    };

    const handleEditUser = (user) => {
        setUsersWithCompletedField(prevUsers => {
            return prevUsers.map(prevUser => {
                if (prevUser.id === user.id) {
                    return {
                        ...prevUser,
                        name: name ? name : prevUser.name,
                        email: email ? email : prevUser.email,
                        address: {
                            city: city ? city : prevUser.address.street,
                            street: street ? street : prevUser.address.city,
                            zipcode: zipcode ? zipcode : prevUser.address.zipcode
                        }
                    };
                }
                return prevUser;
            });
        });
        setName("");
        setEmail("");
        setCity("");
        setStreet("");
        setZipcode("");
    };

    const handleDeleteUser = (user) => {
        const updatedUsers = usersWithCompletedField.filter(u => u.id !== user.id);
        setUsersWithCompletedField(updatedUsers);
    };

    const handleSelectID = (user) => {
        setSelectedUser(user);
        setShowForm(false);
    }


    const handleAddUser = () => {
        setSelectedUser(null);
        setShowForm(!showForm);
    };

    const handleShowForm = () => {
        setShowForm(!showForm);
    }

    const addUser = (newName, newEmail) => {
        const newUser = {
            id: usersWithCompletedField.length + 1, 
            name: newName || "",
            email: newEmail || "",
            address: {
                city: "",
                street: "",
                zipcode: ""
            },
            completed: "true" 
        };

        setUsersWithCompletedField([...usersWithCompletedField, newUser]);
    }

    const addTodo = (title) => {
        const newTodo = {
            userId: selectedUser.id,
            id: todosData.length + 1,
            title: title || "",
            completed: false
        };

        setTodosData([...todosData, newTodo]);

        const selectedUserIndex = usersWithCompletedField.findIndex(user => user.id === selectedUser.id);

        if (selectedUserIndex !== -1) {
            usersWithCompletedField[selectedUserIndex].completed++;
        }

    }

    const addPost = (title, body) => {
        const newPost = {
            userId: selectedUser.id,
            id: postsData.length + 1,
            title: title || "",
            body: body || ""
        };

        setPostsData([...postsData, newPost]);
    }

    const completeTodoHandler = (todoId) => {
        const updatedTodos = todosData.map(todo => {
            if (todo.id === todoId) {
                return { ...todo, completed: true };
            }
            return todo;
        });
        setTodosData(updatedTodos);

        const selectedUserIndex = usersWithCompletedField.findIndex(user => user.id === selectedUser.id);

        if (selectedUserIndex !== -1) {
            usersWithCompletedField[selectedUserIndex].completed--;
        }

    };

    return (
        <div className='all-page' style={{ display: "flex", marginTop: 100, marginLeft: 15 , 
    }}>
            <div > <input
                type="text"
                placeholder="Search by name or email"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 30, marginRight: 130 }}
            />


                <button onClick={handleAddUser}>Add New User</button>

                {filteredUsers.map(user => (
                    <div key={user.id} className="usersList" style={{ border: user.completed === 0 ? '2px solid green' : '2px solid red', backgroundColor: selectedUser && selectedUser.id === user.id ? "orange" : "transparent" }}>
                        <div onClick={() => handleSelectID(user)} style={{ cursor: 'pointer' }}>ID: {user.id}</div>
                        Name:<input
                            type='text'
                            value={user.id === userDataToShow?.id ? name : user.name}
                            onChange={(e) => {
                                if (user.id === userDataToShow?.id) {
                                    setName(e.target.value);
                                }
                            }}
                            placeholder={user.name}
                        />
                        <br />
                        Email:<input
                            type='text'
                            value={user.id === userDataToShow?.id ? email : user.email}
                            onChange={(e) => {
                                if (user.id === userDataToShow?.id) {
                                    setEmail(e.target.value);
                                }
                            }}
                            placeholder={user.email}
                            style={{ width: 168 }}
                        />
                        <div
                            onMouseOver={() => handleShowMoreData(user)}
                            style={{
                                cursor: 'pointer', marginTop: 8
                            }}
                        >
                            <span className='other-data-title'> other data</span>
                            {userDataToShow === user && (
                                <div onClick={handleHideMoreData} className='other-data'>
                                    <div>City: <input
                                        type='text'
                                        value={user.id === userDataToShow?.id ? city : user.address.city}
                                        onChange={(e) => {
                                            if (user.id === userDataToShow?.id) {
                                                setCity(e.target.value);
                                            }
                                        }}
                                        placeholder={user.address.city}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ width: 180 }}
                                    />
                                    </div>
                                    <div>Street: <input
                                        type='text'
                                        value={user.id === userDataToShow?.id ? street : user.address.street}
                                        onChange={(e) => {
                                            if (user.id === userDataToShow?.id) {
                                                setStreet(e.target.value);
                                            }
                                        }}
                                        placeholder={user.address.street}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ width: 167 }}
                                    /></div>
                                    <div>Zip: <input
                                        type='text'
                                        value={user.id === userDataToShow?.id ? zipcode : user.address.zipcode}
                                        onChange={(e) => {
                                            if (user.id === userDataToShow?.id) {
                                                setZipcode(e.target.value);
                                            }
                                        }}
                                        placeholder={user.address.zipcode}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ width: 185 }}
                                    /></div>
                                </div>
                            )}
                        </div>
                        <div className='User-buttons'>
                            <button onClick={() => handleEditUser(user)}>Update</button>
                            <button onClick={() => handleDeleteUser(user)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedUser && <div><div className='half-screen'>
                <TodosList todos={todosData} user={selectedUser} onCompleteTodo={completeTodoHandler} addTodo={addTodo} /></div>
                <div style={{marginLeft:80}}>  
                 <PostsList posts={postsData} user={selectedUser} addPost={addPost} />
                 </div>
            </div>}

            {showForm && <AddUser addUser={addUser} showForm={handleShowForm} />}

        </div>
    );
}

export default App;
