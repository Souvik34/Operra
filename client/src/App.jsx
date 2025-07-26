// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './pages/Auth/signup'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<div className="text-3xl text-center mt-10">Welcome to Operra 🚀</div>} />
      </Routes>
    </Router>
  )
}

export default App
