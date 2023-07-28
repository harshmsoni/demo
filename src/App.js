import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RandomDate from './RandomDate';
import AdminPage from './administrator/AdminPage';
import LoginPage from './LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RandomDate />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/admin' element={<AdminPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
