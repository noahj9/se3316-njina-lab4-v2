import React, { useState } from 'react';

const CreateSuperheroList = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [superheroes, setSuperheroes] = useState([]);
    const [superheroID, setSuperheroID] = useState(0);
    const [isPublic, setIsPublic] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = { name, description, superheroes, isPublic };
        const token = localStorage.getItem('Newtoken');

        try {
            const response = await fetch(`/api/secure/createSuperheroList`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('List created successfully!');
                console.log('List created:', data);
            } else {
                setMessage('Error creating list: ' + data.message);
            }
        } catch (error) {
            setMessage('Error creating list');
            console.error('Error:', error);
        }
    };
    
    //add a superhero to the list
    const handleAddSuperhero = async () => {
        try {
            const response = await fetch(`/api/secure/addSuperhero/${superheroID}`);
            const data = await response.json();
            
            if (response.ok) {
                setSuperheroes([...superheroes, data]);
                alert('Superhero successfully added to List!');
            } else {
                setMessage('Error fetching superhero: ' + data.message);
            }
        } catch (error) {
            setMessage('Error fetching superhero');
            console.error('Fetch superhero error:', error);
        }
    };

    return (
        <div class="container">
            <h3>Create Superhero List</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>List Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Add Superhero by ID:</label>
                    <input
                        type="text"
                        value={superheroID}
                        onChange={(e) => setSuperheroID(e.target.value)}
                        required
                    />
                    <button type="button" onClick={handleAddSuperhero}>Add Superhero</button>
                </div>
                <div>
                    <label>Public:</label>
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                </div>
                <button type="submit">Create List</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateSuperheroList;

//AI PROMPT: using these the two api's for creating and adding superheros to a list create me a react component to create a superhero list.