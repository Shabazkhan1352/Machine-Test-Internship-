import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard'
import UploadList from './components/UploadList'
import AgentListView from './components/AgentListView'
import AgentForm from './components/AgentForm'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-agent" element={<AgentForm />} />
          <Route path="/upload" element={<UploadList />} />
          <Route path="/view" element={<AgentListView />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
