// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Your current content moved here
import Register from './Register'; // New signup page
import Login from './login'; // New login page
import Dashboard from './Dashboard'; // New dashboard page

function App() {
  return (
    <Router basename="/InvoiceAPI_LandingPage">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Register />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
