import React, { useState } from 'react';

import "../Style/AddUser.css";

function AddUser({ addUser ,showForm}) {
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const handleAddUser = () => {
        addUser(newName, newEmail);
        setNewName('');
        setNewEmail('');
        showForm();
    };

    const handleCancel = () => {
        setNewName('');
        setNewEmail('');
        showForm();
    };

    return (
        <div>
            {showForm && (
                <div className='addUser'>
                    <input
                        type="text"
                        value={newName}
                        placeholder="Enter name"
                        onChange={(e) => setNewName(e.target.value)}
                        style={{marginBottom:10}}
                        />
                    <br/>
                    <input
                        type="text"
                        value={newEmail}
                        placeholder="Enter email"
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <div className="addUser-buttons">
                    <button onClick={handleAddUser} >Add</button>
                    <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddUser;
