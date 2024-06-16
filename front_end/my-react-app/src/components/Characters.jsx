import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../index.scss';
import { getToken } from "../utils/auth";
import { Button } from 'react-bootstrap';

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const navigate = useNavigate();
  // const characterId = useParams();
  const [error, setError] = useState(null);
  const token = getToken();

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      try {
        const response = await fetch('https://ncsu-milestone-project-3-i5wf.onrender.com/characters/', {
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
        setCharacters(result);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  const handleCharacterClick = (characterId) => {
    navigate(`/character/${characterId}`)
  };

  const handleDelete = async (characterId) => {
    try {
      const response = await fetch(`https://ncsu-milestone-project-3-i5wf.onrender.com/characters/${characterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      // Optionally handle success, e.g., show a message or redirect
      navigate('/characters');
      console.log('Character deleted successfully');
    } catch (error) {
      console.log('Error:', error.message);
    }
  };


  return (
    <div className="characters-page">
      <h2>Your Characters</h2>
      <div className="button-container">
        <Button variant="primary" onClick={() => navigate('/create-character')}>
          Create New Character
        </Button>
      </div>
      <div className="character-list">
        {characters.map((character) => (
          <div
            key={character.id}
            className="character-card"
            onClick={() => handleCharacterClick(character.id)}
            style={{ backgroundImage: character.image ? `url(${character.image})` : 'url(https://images.pexels.com/photos/3359734/pexels-photo-3359734.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
          >
            {!character.image && (
              <div className="placeholder">
                <h4>{character.name}</h4>
                <p>{character.race} - {character.class} - Level {character.level}</p>
              </div>
            )}
            {character.image && (
              <div className="card-body">
                <h4>{character.name}</h4>
                <p>{character.race} - {character.class} - Level {character.level}</p>
              </div>
            )}
            <div className="button-group">
              <Button variant="danger" onClick={() => handleDelete(character.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

}

export default Characters;
