import React, { Component, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { getToken } from "../utils/auth";
import { DnDCharacterStatsSheet, DnDCharacter } from 'dnd-character-sheets';
import 'dnd-character-sheets/dist/index.css';
import Gideon from "../testCharacters/gideon.json";

// class CharacterSheet extends Component {
//   render() {
//     return <DnDCharacterStatsSheet character={Gideon}/>
//   }
// }
// testing merge conflicts 
const CharacterSheetApp = ({characterData}) => {

  const token = getToken();
  const navigate = useNavigate();
  const location = useLocation();

  // const characterIdObject = useParams();
  // const characterId = characterIdObject.id;
  const {characterId} = useParams()
  const [character, setCharacter] = useState({});
  const [eligibleCampaigns, setEligibleCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  // const [password, setPassword] = useState('');

  useEffect(() => {
    fetchCharacterData();
    fetchEligibleCampaigns();
  }, []);

  // fetch single character
  const fetchCharacterData = async () => {
    try {
      const response = await fetch(`https://ncsu-milestone-project-3-i5wf.onrender.com/characters/${characterId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const returnedCharacter = await response.json();
      setCharacter(returnedCharacter);
    } catch (error) {
      console.log('Error:',error.message);
    }
  };

  const fetchEligibleCampaigns = async () => {
    
    const response = await fetch('https://ncsu-milestone-project-3-i5wf.onrender.com/campaigns/eligible', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (response.ok) {
      setEligibleCampaigns(data);
  } else {
      console.error('Error fetching campaigns:', data);
  }};

  function updateCharacter (updatedCharacter) {
    setCharacter(updatedCharacter)
    // localStorage.setItem('dnd-character-data', JSON.stringify(character))
  }

  const handleImageUrlChange = (e) => {
    setCharacter({ ...character, image: e.target.value });
  };

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

  const handleUpdateButton = async () => {
    try {

      const flattedCharacter = flattenObject(character);
      console.log('flattedCharacter',flattedCharacter);

      const response = await fetch(`https://ncsu-milestone-project-3-i5wf.onrender.com/characters/${characterId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(flattedCharacter)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Character updated successfully:', data);
      navigate('/characters');
    } catch (error) {
      console.log('Error:', error);
    }
  };
  

// adds character to selected campaign
const handleAddCharacterToCampaign = async () => {
    
    const response = await fetch(`https://ncsu-milestone-project-3-i5wf.onrender.com/characters/addToCampaign`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ character_id: characterId, campaign_id: selectedCampaignId })
    });
    const data = await response.json();
    console.log(data);//debug
    // setMessage(data.message || data.error);
    if (response.ok) {
        navigate('/characters');
    }
};

const deleteCharacter = async () => {
  try {
    const token = getToken();
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
    console.log('Character deleted');
    navigate('/characters'); // Redirect to characters list after deletion
  } catch (error) {
    console.error('Error deleting character:', error);
  }
};
  // const [character, setCharacter] = useState<DnDCharacter>(loadDefaultCharacter())

  const statsSheet = characterData ? (
      <DnDCharacterStatsSheet
        character={characterData}
        onCharacterChanged={updateCharacter}
      />
   ) : (
      <DnDCharacterStatsSheet
      character={character}
      onCharacterChanged={updateCharacter}
    />
  );
  
  const addToCampaign = (
    <div>
      <label htmlFor="campaign">Add Character to Campaign:</label>
      <select
        id="campaign"
        value={selectedCampaignId}
        onChange={(e) => setSelectedCampaignId(e.target.value)}
      >
        <option value="">-- Select --</option>
        {eligibleCampaigns.map((campaign) => (
          <option key={campaign.id} value={campaign.id}>
            {campaign.name}
          </option>
        ))}
      </select>
      <button onClick={handleAddCharacterToCampaign}>Add to Campaign</button>
    </div>
  )
  

  // function loadDefaultCharacter () {
  //   let character = {}
  //   const lsData = localStorage.getItem('dnd-character-data')
  //   if (lsData) {
  //     try {
  //       character = JSON.parse(lsData)
  //     } catch {}
  //   }
  //   return character
  // }

  // function exportCharacter () {
  //   const json = JSON.stringify(character, null, 2)
    //push to database here
  // }
  //The GET method should be assigned to a variable at some point, which is then when we'll call this function
  // function loadCharacter(json) {
  //   try {
  //     var result = JSON.parse(typeof json === 'string' ? json : '{}');
  //     if (!Array.isArray(result) && typeof result === 'object') {
  //       updateCharacter(result)
  //     } else {
  //       window.alert('Json file does not contain a DnD character.')
  //     }
  //   }
  //   catch {
  //     window.alert('Json file does not contain a DnD character.')
  //   }
  // }
  return (
    <div className="character-sheet-page">
      {location.pathname.includes('/campaigns') ? (
        <>
          {statsSheet}
        </>
      ): (
        <>
        {addToCampaign}
        
        {statsSheet}
        </>
      )}

      <Form.Group controlId="image">
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter character image URL"
          value={character.image || ''}
          onChange={handleImageUrlChange}
        />
      </Form.Group>
      {/* <Button onClick={handleUpdateButton} style={{ marginTop: '20px', marginBottom: '20px'}}> Update </Button> */}
      <div className="button-container">
            <Button variant="primary" className="custom-button" onClick={handleUpdateButton}>Update Character</Button>
            <Button variant="danger" className="custom-button" onClick={deleteCharacter}>Delete Character</Button>
          </div>
      
    </div>
    
  );
}

export default CharacterSheetApp;