import React, { useState } from 'react';
import { DnDCharacterStatsSheet } from 'dnd-character-sheets';
import 'dnd-character-sheets/dist/index.css';
import { Container, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getToken } from "../utils/auth";
import '../index.scss';

const CreateCharacter = () => {

  const token = getToken();

  const [character, setCharacter] = useState({ })

  const navigate = useNavigate();

  const handleImageUrlChange = (e) => {
    setCharacter({ ...character, image: e.target.value });
  };

  const updateCharacter = (updatedCharacter) => {
    // Function to flatten the updatedCharacter object
    const flattenObject = (obj, result = {}) => {
      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            flattenObject(obj[key], result);
          } else {
            result[key] = obj[key];
          }
        }
      }
      return result;
    };

    const flattedUpdatedCharacter = flattenObject(updatedCharacter);
    setCharacter(flattedUpdatedCharacter);
  };

  const saveCharacter = async () => {
    try {
      const response = await fetch('https://ncsu-milestone-project-3-i5wf.onrender.com/characters/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(character),
      });

      if (response.ok) {
        navigate('/characters');
      } else {
        console.log('Failed to save character');
      }
    } catch (error) {
      console.log('Error saving character:', error);
    }
  };

  return (
    <Container className="create-character-page">
      <h2>Create New Character</h2>
      <DnDCharacterStatsSheet character={character} onCharacterChanged={updateCharacter} />

      <Form.Group controlId="image">
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter character image URL"
          value={character.image}
          onChange={handleImageUrlChange}
        />
      </Form.Group>

      <div className="button-container">
        <Button variant="primary" onClick={saveCharacter}>Save Character</Button>
      </div>
    </Container>
  );
};

export default CreateCharacter;
