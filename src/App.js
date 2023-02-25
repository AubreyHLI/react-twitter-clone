import React from 'react';
import './App.css';
import ScrollToTop from './utils/scrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SinglePost from './pages/SinglePost';
import ProtectedRoutes from './pages/ProtectedRoutes';
import SharedMainLayout from './pages/SharedMainLayout';
import NotFound from './pages/NotFound';
import { BrowserRouter, Routes, Route } from "react-router-dom";


const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <Routes>
          <Route element={<ProtectedRoutes ><SharedMainLayout /></ProtectedRoutes>}>
              <Route path='/' exact element={<Home />} />
              <Route path=":IdOfPost" element={<SinglePost />}/> 
          </Route>

          <Route path="/Login" element={<Login />}/>
          <Route path="/Signup" element={<Signup />}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;
