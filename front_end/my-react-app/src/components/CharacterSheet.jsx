import React, { useState, useEffect } from 'react';
import { DnDCharacterStatsSheet } from 'dnd-character-sheets';
import 'dnd-character-sheets/dist/index.css';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from "../utils/auth";
import { Button, Container } from 'react-bootstrap';
import '../index.scss';

const CharacterSheet = () => {
  const navigate = useNavigate();
  const { characterId } = useParams();

  const loadDefaultCharacter = () => {
    let character = {};
    const lsData = localStorage.getItem('dnd-character-data');
    if (lsData) {
      try {
        character = JSON.parse(lsData);
      } catch (error) {
        console.error('Error loading character from localStorage:', error);
      }
    }
    return character;
  };

  const [character, setCharacter] = useState(loadDefaultCharacter());

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const token = getToken();
        const response = await fetch(`http://127.0.0.1:5000/characters/${characterId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const result = await response.json();
        setCharacter(result);
      } catch (error) {
        console.error('Error fetching character:', error);
      }
    };
    fetchCharacter();
  }, [characterId]);

  const handleCharacterChange = (updatedCharacter) => {
    setCharacter(updatedCharacter);
  };

  const updateCharacter = async () => {
    try {
      const token = getToken();
      const response = await fetch(`http://127.0.0.1:5000/characters/${characterId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(character)
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const result = await response.json();
      console.log('Character updated:', result);
      navigate('/characters'); // Redirect to characters list after update
    } catch (error) {
      console.error('Error updating character:', error);
    }
  };

  const deleteCharacter = async () => {
    try {
      const token = getToken();
      const response = await fetch(`http://127.0.0.1:5000/characters/${characterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      console.log('Character deleted');
      navigate('/characters'); // Redirect to characters list after deletion
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  return (
    <Container className="character-sheet-page">
      {character ? (
        <>
          <DnDCharacterStatsSheet
            character={character}
            onCharacterChanged={handleCharacterChange}
          />
          <div className="button-container">
            <Button variant="primary" className="custom-button" onClick={updateCharacter}>Update Character</Button>
            <Button variant="danger" className="custom-button" onClick={deleteCharacter}>Delete Character</Button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};

export default CharacterSheet;
