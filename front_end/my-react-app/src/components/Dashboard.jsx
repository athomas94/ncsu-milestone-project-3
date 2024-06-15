import React , { useEffect, useState }from "react";
import { Container, Row, Col } from 'react-bootstrap';
import '../index.scss';
import Navigation from "./Navigation";
import CampaignCard from "./CampaignCard";
import { getToken } from "../utils/auth";
import { useNavigate } from 'react-router-dom';

// Import images
// import image1 from '../assets/cardimage-1.jpg'
// import image2 from '../assets/cardimage-2.jpg'
// import image3 from '../assets/cardimage-3.jpg'


const Dashboard = () => {
    /****   Testing Code for fetching userCampaigns  getting a CORS error. ****/ 
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [allCampaigns, setAllCampaigns] = useState([]);

    const navigate = useNavigate();
    const token = getToken(); 

    // fetch all campaigns associated with logged in user
    useEffect(() => {
        const fetchUserCampaigns = async () => {
          try {
            
            const response = await fetch('http://127.0.0.1:5000/usercamp/', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            console.log('Response:',response)
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setUserCampaigns(data);
          } catch (error) {
            console.error('Error fetching userCampaigns:', error);
          }
        };
    
        fetchUserCampaigns();
      }, []);

    //   fetch all campaigns but only the id and name
      useEffect(() => {
        const fetchAllCampaigns = async () => {
          try {
             
            const response = await fetch('http://127.0.0.1:5000/campaigns/', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setAllCampaigns(data);
          } catch (error) {
            console.error('Error fetching userCampaigns:', error);
          }
        };
    
        fetchAllCampaigns();
      }, []);

    // const userCampaigns = [
    //     { 
    //         id: 1,
    //         name: 'Campaign 1',
    //         description: 'This is a brief description of Campaign number 1.',
    //         image: image1
    //     },
    //     { 
    //         id: 2,
    //         name: 'Campaign 2',
    //         description: 'This is an exciting description of Campaign number 2.',
    //         image: image2
    //     },
    //     { 
    //         id: 3,
    //         name: 'Campaign 3',
    //         description: 'This is a colorful description of Campaign number 3.',
    //         image: image3
    //     },
    // ]

    const [selectedOption, setSelectedOption] = useState('');
    const [textAreaVisible, setTextAreaVisible] = useState(false);
    const [password, setPassword] = useState('');

    const handleSelectChange =  (event) => {
        
        setSelectedOption(event.target.value);
        setTextAreaVisible(true);
        console.log('selected option:', selectedOption);
    };

    const handleJoinSubmit = async (event) => {
        console.log('selected option in submit:', selectedOption);
        console.log('password in submit:', password);
        event.preventDefault();
        // Handle the form submission
        try {
            const token = getToken(); 
            const response = await fetch('http://127.0.0.1:5000/usercamp/join', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({campaign_id: selectedOption, password: password})
            });


            console.log('Response:',response)
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);

            }
            window.location.reload()
          } catch (error) {
            console.error('Error joining campaign:', error);
          }
        console.log('Selected Option after join:', selectedOption);
    };
    
    
    const handleNewCampaignClick = () => {
        navigate("/campaigns/new");
    }

    return (
        <div className="dashboard">
            <Container>
                <Row>
                    <Col>
                        <h2>Welcome to the Dashboard</h2>
                        <p>Here you can manage your Dungeons & Dragons userCampaigns.</p>
                    </Col>
                </Row>
                <Row className="cards-row">
                    {userCampaigns.map(campaign => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                </Row>
                <Row className="cards-row">
                    <Col id="btn1">
                    <button className= "btn btn-secondary" onClick={handleNewCampaignClick} >Start a new adventure!</button>
                    </Col>

                    <Col id="btn2">
                        <label>
                        Join an existing adventure!</label>
                        <select
                            value={selectedOption}
                            onChange={handleSelectChange}
                        >
                            <option value="">--Choose an option--</option>
                            {allCampaigns.map(campaign => (
                                <option key={campaign.id} value={campaign.id}>
                                    {campaign.name}
                                </option>
                            ))}
                        </select>
                        
                    </Col>

                    <Col className="btn3">
                    {textAreaVisible && (
                    <form onSubmit={handleJoinSubmit}>
                        <label>
                            Campaign Password:
                            <textarea
                            rows="1"
                            cols="25"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <button type="submit" className="btn btn-primary">
                        Submit
                        </button>
                    </form>
                    )}
                    </Col>
                </Row>           
            </Container>
        </div>
    )
}

export default Dashboard