import React, { useState } from 'react';

import "../Style/PostsList.css";

const PostsList = ({ posts, user, addPost }) => {
    const userPosts = posts.filter(post => post.userId === user.id);
    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const handleAddPost = () => {
        addPost(title, body);
        setTitle('');
        setBody('');
        setShowForm(false);
    };

    const handleCancel = () => {
        setTitle('');
        setBody('');
        setShowForm(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h2 style={{marginLeft:30}}>Posts - User {user.id}</h2>
                <button className="add-post-button" onClick={() => setShowForm(true)}>Add New Post</button>
            </div>

            {showForm && (
                <div className='add-post'>
                    <input
                        type="text"
                        value={title}
                        placeholder="Enter title"
                        onChange={(e) => setTitle(e.target.value)}
                        style={{marginBottom:10}}
                        />
                    <input
                        type="text"
                        value={body}
                        placeholder="Enter body"
                        onChange={(e) => setBody(e.target.value)}
                    />
                                        <div className="addPost-buttons">

                    <button onClick={handleAddPost}>Add</button>
                    <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )}

            {!showForm &&
                <>
                    {userPosts.map(post => (
                        <div key={post.id} className="posts-list" >
                            <div>Title: {post.title}</div>
                            <div>Body: {post.body}</div>
                        </div>
                    ))}
                </>
            }
        </div>
    );
};

export default PostsList;