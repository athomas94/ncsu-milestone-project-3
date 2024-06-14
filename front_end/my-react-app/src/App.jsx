// Dependencies import
import React from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'


// Components import
import './App.css'
import SplashPage from './components/SplashPage.jsx'
import DmCard from './components/DmCard.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import ConditionalNavigation from './components/ConditionalNavigation.jsx'
import Characters from './components/Characters.jsx'
import DmDashboard from './components/DmDashboard.jsx'
import DiceDrawer from './components/DiceDrawer.jsx'
import CampaignDetails from './components/CampaignDetails.jsx'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute.jsx'
import CharacterSheet from './components/CharacterSheet.jsx'
import NewCampaign from './components/NewCampaign.jsx'

function App() {
    return (
    <Router>
      <ConditionalNavigation />
      <Routes>
        <Route path="/" element={<PublicRoute> <SplashPage /> </PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/campaigns/new" element={<NewCampaign />} />
        <Route path="/dmdashboard" element={<ProtectedRoute><DmDashboard /></ProtectedRoute>} />
        <Route path="/characters" element={<ProtectedRoute><Characters /></ProtectedRoute>} />
        <Route path="/campaigns/:id" element={<ProtectedRoute> <CampaignDetails /> </ProtectedRoute>} />
        <Route path="/character/:id" element={<CharacterSheet />} />
        <Route path="/logout" element={() => {
          // Handle logout logic here
          // Task completed:Logout logic was handled in the Navigation component.
        }} />
      </Routes>
      {location.pathname !=='/' && <DiceDrawer />}
    </Router>
  )
}

export default App