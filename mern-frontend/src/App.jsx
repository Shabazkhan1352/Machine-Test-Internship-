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
import Signup from './components/Signup'
import AgentLogin from './components/Agent/AgentLogin'
import SubAgentForm from './components/Agent/SubAgentForm'
import AgentDashboard from './Agentdashboard'
import AgentUploadList from './components/Agent/AgentUplaodList'
import SubAgentListView from './components/Agent/subAgentListView'
import AllAgents from './components/AllAgents'
import AllSubAgents from './components/AllSubAgents'
import Tasks from './components/Tasks'
import AgentsTasks from './components/AgentsTasks'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/agentlogin" element={<AgentLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Agentdashboard" element={<AgentDashboard />} />
          <Route path="/add-agent" element={<AgentForm />} />
          <Route path="/add-subagent" element={<SubAgentForm />} />
          <Route path="/upload" element={<UploadList />} />
          <Route path="/agentupload" element={<AgentUploadList />} />
          <Route path="/view" element={<AgentListView />} />
          <Route path="/agentview" element={<SubAgentListView />} />
          <Route path="/allagents" element={<AllAgents />} />
          <Route path="/allsubagents" element={<AllSubAgents />} />
          <Route path="/agent/:agentId" element={<AgentsTasks />} />
          <Route path="/subagent/:agentId" element={<Tasks />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
