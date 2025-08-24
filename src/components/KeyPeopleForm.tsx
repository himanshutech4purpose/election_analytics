import React, { useState } from 'react';

const KeyPeopleForm = () => {
    console.log('KeyPeopleForm: Component rendered');
    
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [contact, setContact] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('KeyPeopleForm: handleSubmit called');
        e.preventDefault();
        setError('');
        setSuccess('');

        console.log('KeyPeopleForm: Validating form inputs:', { name, role, contact });
        if (!name || !role || !contact) {
            console.error('KeyPeopleForm: Validation failed - missing required fields');
            setError('All fields are required.');
            return;
        }

        try {
            console.log('KeyPeopleForm: Making API call to /api/key-people');
            // Call the API to add the key person
            const response = await fetch('/api/key-people', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, role, contact }),
            });

            console.log('KeyPeopleForm: API response status:', response.status);
            if (!response.ok) {
                console.error('KeyPeopleForm: API call failed with status:', response.status);
                throw new Error('Failed to add key person');
            }

            console.log('KeyPeopleForm: Key person added successfully');
            setSuccess('Key person added successfully!');
            setName('');
            setRole('');
            setContact('');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            console.error('KeyPeopleForm: Error occurred:', err);
            setError(errorMessage);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('KeyPeopleForm: name changed to:', e.target.value);
        setName(e.target.value);
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('KeyPeopleForm: role changed to:', e.target.value);
        setRole(e.target.value);
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('KeyPeopleForm: contact changed to:', e.target.value);
        setContact(e.target.value);
    };

    console.log('KeyPeopleForm: Rendering form with state:', { name, role, contact, error, success });
    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Key Person</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    required
                />
            </div>
            <div>
                <label>Role:</label>
                <input
                    type="text"
                    value={role}
                    onChange={handleRoleChange}
                    required
                />
            </div>
            <div>
                <label>Contact:</label>
                <input
                    type="text"
                    value={contact}
                    onChange={handleContactChange}
                    required
                />
            </div>
            <button type="submit">Add Key Person</button>
        </form>
    );
};

export default KeyPeopleForm;