import React, {useState} from 'react';
import './App.css';
import Frontpg from './Frontpg.js'
import AdminPage from './AdminPage.js';
import UserPage from './UserPage.js';
import Signup from './Signup.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";



function App() {
  const [user, setUser] = useState(null);

  return (
    <>
     <BrowserRouter>
       
     <Routes>
            <Route path="/Signup" element={<Signup/>}/>
            <Route path="/" element={<Frontpg setUser={setUser} />} />
            <Route path="/user" element={<UserPage user={user} />} />
            <Route path="/admin" element={<AdminPage />} />
      </Routes>
        
    </BrowserRouter>
    </>
  );
}

export default App;
