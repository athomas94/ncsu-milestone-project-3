import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getToken } from "../utils/auth"
import { jwtDecode } from "jwt-decode"
import CharacterSheet from "./CharacterSheet.jsx"
import CharacterSheetApp from "./CharacterSheet.jsx"
import '../index.scss'

// Steps to implement dm/player view:
// - add states to manage campaign data, user role, and character sheets
// - Fetch the necessary data based on the campaign and user role
// - Render the views conditionally based on the isDungeonMaster user role.
// Heavy leaning on chatGPT for this feature.

const CampaignDetails = () => {
  const { id } = useParams();
  const token = getToken();
  const decodedToken = jwtDecode(token);
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [isDungeonMaster, setIsDungeonMaster] = useState(false);
  const [playerCharacterSheet, setPlayerCharacterSheet] = useState(null);
  const [noCharacterInCampaign, setNoCharacterInCampaign] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [notes, setNotes] = useState([]);
  const  [fetchedNotes, setFetchedNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editedNoteText, setEditedNoteText] = useState('');

  useEffect(() => {
    const fetchCampaignData = async () => {
       // Function to fetch characters based on character_ids
      async function fetchCharactersByIds(charIds) {
        // Array to store fetch promises
        const fetchPromises = charIds.map(charId => {
          return fetch(`http://127.0.0.1:5000/characters/${charId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = response.json();
            return data;
          })
          .catch(error => {
            console.error('Error fetching character 2:', error);
            throw error;
          });
        });

        try {
          // Wait for all fetch operations to complete
          const characters = await Promise.all(fetchPromises);
          console.log('characters:', characters);//debug
          return characters;
          // return characters.filter(character => character !== null); // Filter out any null values
        } catch (error) {
          console.error('Error fetching characters 1:', error.message);
          return [];
        }
      }
      //function ends here//

      try {
        const response = await fetch(`http://127.0.0.1:5000/campaigns/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const campaignData = await response.json();
        console.log('campaign', campaignData)//debug
        setCampaign(campaignData);

        if (campaignData.dm === decodedToken.sub.userId) {
          setIsDungeonMaster(true);
          try {
            const response = await fetch(`http://127.0.0.1:5000/campaigns/${id}/characters`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            if (!response.ok) {
              throw new Error(`HTTP Error: ${response.status}`);
            }
            const fetchedCharacterCampaignTable = await response.json();
            if (fetchedCharacterCampaignTable.length === 0) {
              console.log('No player character found in DM view');
              setNoCharacterInCampaign(true);
              return;
            }
            const charactersIds =  fetchedCharacterCampaignTable.map(table => table.character_id);
            console.log('charactersIds:',charactersIds)//debug



           const fetchedCharacters = await fetchCharactersByIds(charactersIds);
           
           

           setCharacters(fetchedCharacters);
           console.log('fetchedCharacters:',fetchedCharacters)//debug

           console.log('dm1:',campaignData.dm)//debug
          } catch (error) {
            console.log('Error:', error.message);
          }
          
        } else {
          setIsDungeonMaster(false);

          try {
            const response = await fetch(`http://127.0.0.1:5000/campaigns/${id}/characters`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            if (!response.ok) {
              throw new Error(`HTTP Error: ${response.status}`);
            }
            const fetchedCharacterCampaignTable = await response.json();
            console.log('fetchedCharacterCampaignTable',fetchedCharacterCampaignTable)//debug
            if (fetchedCharacterCampaignTable.length === 0 || fetchedCharacterCampaignTable[0].character_id === null) {
              console.log('No player character found in player view');
              setNoCharacterInCampaign(true);
              return;
            } 
            const playerCharacterId = fetchedCharacterCampaignTable[0].character_id;
            
            

            const fetchPlayerCharacter = async () => {
              try {
                const response = await fetch(`http://127.0.0.1:5000/characters/${playerCharacterId}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                });

                if (!response.ok) {
                  throw new Error(`HTTP Error: ${response.status}`);
                }

                const playerCharacter = await response.json();
                delete playerCharacter.campaigns;
                console.log('playerCharacter',playerCharacter);//debug

                return playerCharacter;

              } catch (error) {
                  console.log('Error:', error.message);
              }
            } 

            const playerCharacterSheetData1 = await fetchPlayerCharacter();
            setPlayerCharacterSheet(playerCharacterSheetData1);
            
            console.log('playerCharacterSheetData',playerCharacterSheet)// debug
            console.log('dm2:',campaignData.dm)//debug


            // const playerCharacter = await fetchPlayerCharacterForCampaign(id); // Replace with actual API call
            // setPlayerCharacterSheet(playerCharacter);
            // setNotes(playerCharacter.notes || []);
          } catch (error) {
            console.log('Error1:', error);
          }
        }
      } catch (error) {
        console.log('Error2:', error.message);
      }
    };

    fetchCampaignData();
  }, []);

    const fetchNotes = async () => {
      try {
        const response =  await fetch(`http://127.0.0.1:5000/notes/${id}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data =  await response.json();
        setFetchedNotes(data);
        console.log('Notes data:',data);//debug
      } catch (error) {
        console.log('Error:', error.message);
      }
    };

  useEffect(() => {
    fetchNotes();
  }, []);

  // const fetchCampaign = async (campaignId) => {
  //   return {
  //     id: campaignId,
  //     name: `Campaign ${campaignId}`,
  //     description: `Description for Campaign ${campaignId}`,
  //     isDungeonMaster: true // Replace with actual role check
  //   };
  // };

  // const fetchAllCharactersForCampaign = async (campaignId) => {
  //   return [
  //     {
  //       id: 1,
  //       name: 'Player 1',
  //       class: 'Wizard',
  //       level: 5,
  //       health: 30,
  //       armorClass: 15,
  //       speed: 30,
  //       passivePerception: 12,
  //       image: 'path/to/image1.jpg' // Replace with actual image URL from the database. A default background color renders if no image is provided.
  //     },
  //     {
  //       id: 2,
  //       name: 'Player 2',
  //       class: 'Rogue',
  //       level: 3,
  //       health: 25,
  //       armorClass: 14,
  //       speed: 35,
  //       passivePerception: 15,
  //       image: 'path/to/image2.jpg' // Need to replace this image url as well.
  //     }
  //   ];
  // };

  // const fetchPlayerCharacterForCampaign = async (campaignId) => {
  //   return {
  //     name: 'Your Character',
  //     class: 'Bard',
  //     level: 4,
  //     health: 28,
  //     armorClass: 13,
  //     speed: 30,
  //     passivePerception: 14,
  //     image: null, // No image available
  //     notes: [
  //       'Note 1: Do NOT trust the innkeeper.',
  //       'Note 2: The bed was lumpy, -1 to saving throws.',
  //       'Note 3: Small hands, good for thieving.'
  //     ]
  //   };
  // };

  const handleAddNote = () => {
    if (newNote.trim()) {
        const postNote = () => {
          try {
            const response = fetch('http://127.0.0.1:5000/notes/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                'title': '',
                'text': newNote.trim(),
                'user_id': decodedToken.sub.userId,
                'campaign_id': id
              })
            });

            if (!response.ok) {
              throw new Error(`HTTP Error: ${response.status}`);
            }
            console.log('Note added successfully');
          } catch (error) {
            console.log('Error:', error.message);
          }
        }

        postNote();
        setNewNote('');
        fetchNotes();
      }else {
        console.log('Note cannot be empty');
      }
    }

  const handleEditNote = (noteId) => {
    const noteToEdit = fetchedNotes.find(note => note.id === noteId);
    
    if (noteToEdit) {
      setEditingNote(noteId);
      setEditedNoteText(noteToEdit.text);
    } else {
      console.log('Note not found');
    }
    
  };

  const handleSaveEditedNote = (noteId) => {

    const putNote = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/notes/${noteId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            'title': '',
            'text': editedNoteText.trim(),
            'user_id': decodedToken.sub.userId,
            'campaign_id': id
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        console.log('Note updated successfully');
        fetchNotes();
      } catch (error) {
        console.log('Error:', error.message);
    }
  };

  putNote();

  setEditingNote(null);
  setEditedNoteText('');
}

  const handleDeleteNote = (noteId) => {
    const deleteNote = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/notes/${noteId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        console.log('Note deleted successfully');
        fetchNotes();
      } catch (error) {
        console.log('Error:', error.message);
      }
    }
    deleteNote();
  };

  const handleCharacterClick = (characterId) => {
    navigate(`/character/${characterId}`); // Navigate to the character sheet view
  };

  if (!campaign) {
    return <p>Loading...</p>;
  }

  return (
    <div className="campaign-details">
      <h2>{campaign.name}</h2>
      <p>{campaign.description}</p>
      <div className="details-container">
        {isDungeonMaster ? (
          <>
            {noCharacterInCampaign ? (
              <p>There are no characters in this campaign yet. Please wait for players to join.</p>
            ) : (
              <>
              <h3>Character Sheets</h3>
              <div className="character-snapshots">
                {characters.map((character) => (
                  <div
                    key={character.id}
                    className="character-snapshot card"
                    onClick={() => handleCharacterClick(character.id)}
                    style={{ backgroundImage: character.image ? `url(${character.image})` : 'url(https://images.pexels.com/photos/3359734/pexels-photo-3359734.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
                  >
                    {!character.image && (
                      <div className="">
                        <h4 className="card-title">{character.name}</h4>
                        <p className="card-text">Health: {character.hp}</p>
                        <p className="card-text">Armor Class: {character.armorClass}</p>
                        <p className="card-text">Speed: {character.speed}</p>
                        <p className="card-text">Passive Perception: {character.passivePerception}</p>
                      </div>
                    )}
                    {character.image && (
                      <div className="card-body">
                        <h4 className="card-title">{character.name}</h4>
                        <p className="card-text">Health: {character.hp}</p>
                        <p className="card-text">Armor Class: {character.ac}</p>
                        <p className="card-text">Speed: {character.speed}</p>
                        <p className="card-text">Passive Perception: {character.passivePerception}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              </>
            )}
          </>
        ): (
          <>
            {noCharacterInCampaign ? (
              <p>There are no characters in this campaign yet. Please wait for players to join.</p>
            ) : (
              <CharacterSheetApp characterData={playerCharacterSheet} />
            )}
          </>
        )}

        {/* following is the notes section */}
        <div className="notes-section">
          <h3>Notes</h3>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your notes here..."
          />
          <button onClick={handleAddNote}>Add Note</button>
          <div className="saved-notes">
            <h4>Saved Notes</h4>
            <ul>
              {fetchedNotes.map((note) => (
                <li key={note.id}>
                  {editingNote === note.id ? (
                    <>
                      <textarea
                        value={editedNoteText}
                        onChange={(e) => setEditedNoteText(e.target.value)}
                      />
                      <button onClick={() => handleSaveEditedNote(note.id)}>Save</button>
                    </>
                  ) : (
                    <>
                      <p>{note.text}</p>
                      <button onClick={() => handleEditNote(note.id)}>Edit</button>
                      <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails;


// Placeholder character sheet data:
// characterSheet: {
//                     basicInfo: {
//                         name: 'Tav',
//                         class: 'Bard',
//                         level: 5,
//                         race: 'Human',
//                         alignment: 'Neutral Good'
//                     },
//                     attributes: {
//                         strength: 8,
//                         dexterity: 14,
//                         constitution: 12,
//                         intelligence: 10,
//                         wisdom: 10,
//                         charisma: 16
//                     },
//                     skills: {
//                         acrobatics: 5,
//                         animalHandling: 0,
//                         arcana: 0,
//                         athletics: 4,
//                         deception: -1,
//                         history: 0,
//                         insight: 0,
//                         intimidation: 5,
//                         investigation: 0,
//                         medicine: -10,
//                         nature: 0,
//                         perception: 2,
//                         performance: 10,
//                         persuasion: 4,
//                         religion: 0,
//                         sleightOfHand: 5,
//                         stealth: 0,
//                         survival: 4,
//                     },
//                     equipment: [
//                         'Lute',
//                         'Dagger',
//                         'Explorer Pack',
//                     ],
//                 }