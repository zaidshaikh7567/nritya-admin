// src/App.js
import React,{useContext} from 'react';
import Footer from './Components/Footer';
import LandingPage from './Screens/LandingPage';
import Header from './Components/Header';
import { BrowserRouter as Router,HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Transactions from './Screens/Transactions';
import Users from './Screens/Users';
import UserKycs from './Screens/UserKycs';
import Studios from './Screens/Studios';
import Workshops from './Screens/Workshops';
import { Container } from '@mui/material';
import Bookings from './Screens/Bookings';
import Instructors from './Screens/Instructors';
import AdminMgmt from './Screens/AdminMgmt';
import { ProtectedRoutes, ProtectedRoles } from './utils/ProtectedRoutes';
import CarouselImgMgmt from './Screens/CarouselImgMgmt';
import Data from './Screens/Data';
import {AuthContext} from './context/AuthProvider';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import UserKycsNew from './Screens/UserKycsNew';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {

  const { darkMode } = useContext(AuthContext);

  return (
    <HashRouter  >
      <ThemeProvider theme={darkMode?darkTheme:''}>
      <CssBaseline />
     <div >
      <Header />
      <br></br>
      <main className='py-1'  >
        
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<ProtectedRoutes/>}>
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/users" element={<Users />} /> 
            <Route path="/user-kycs" element={<UserKycsNew />} /> 
            <Route path="/studios" element={<Studios />} /> 
            <Route path="/workshops" element={<Workshops />} />  
            <Route path="/bookings" element={<Bookings />} />
            <Route path='/instructors' element={<Instructors/>}/>
            <Route path='/carouselImgMgmt' element={<CarouselImgMgmt/>}/>
            <Route element={<ProtectedRoles roleInput = {1}/>}>
              <Route path='/adminMgmt' element={<AdminMgmt/>}/>
              <Route path='/data' element={<Data/>}/>
            </Route>
          </Route>
        </Routes>
        </main>
        </div>
        </ThemeProvider>
    
    </HashRouter>
  );
}

export default App;
