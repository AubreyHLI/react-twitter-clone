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
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";


const App = () => {
  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default App;
