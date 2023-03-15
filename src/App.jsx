
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import Login from './components/Login';
import Register from "./components/Register";
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import About from "./components/About";
import Account from "./components/Account";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import DrawingGame from "./components/DrawingGame/DrawingGame";
import Simulator from "./components/Simulator";

import Earth from "./components/PlanetSimulator/Earth";
import Jupiter from "./components/PlanetSimulator/Jupiter";
import Mars from "./components/PlanetSimulator/Mars";
import Mercury from "./components/PlanetSimulator/Mercury";
import Neptune from "./components/PlanetSimulator/Neptune";
import Saturn from "./components/PlanetSimulator/Saturn";
import Sun from "./components/PlanetSimulator/Sun";
import Uranus from "./components/PlanetSimulator/Uranus";
import Venus from "./components/PlanetSimulator/Venus";
import Game from "./components/Game";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Post from "./components/Post/Post";
import Article from "./components/Post/Article";
import ArticleCreate from "./components/Post/ArticleCreate";
export const UserContext = createContext();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};
firebase.initializeApp(firebaseConfig);

function App() {
  const [logged, setLogged] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState("");
  // Get userData from local storage on mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const storedUserId = localStorage.getItem('userId');
    if (logged && storedUserData) {
      setLogged(true);
      setUserId(storedUserId);
      setUserData(JSON.parse(storedUserData));
    }
    else {
      setLogged(false);
    }
  }, [logged]);


  // Save userData to local storage before unmount
  // Save userData to local storage before unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (userData && logged) {
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        localStorage.removeItem('userData');
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userData, logged]);


  // Fetch userData from database if not in local storage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId && !userData) {
      const firestore = firebase.firestore();
      firestore.collection('users').doc(storedUserId).get()
        .then(doc => {
          if (doc.exists) {
            const userDataFetched = {
              userId: storedUserId,
              username: doc.data().username,
              userProfile: doc.data().profileImage
            };
            setUserData(userDataFetched);
            localStorage.setItem('userData', JSON.stringify(userDataFetched));
          } else {
            console.log('No user data found');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [userData]);
  useEffect(() => {
    AOS.init();
  }, [])
  return (
    <UserContext.Provider value={{ logged, setLogged, userData, setUserData, userId }}>
      <Router>
        <Navbar />
        <div className="w-full min-h-screen">
        <Routes>
          <Route path="/" element={
            <About />
          } />
          <Route path="/game" element={
            <Game/>
          } />
          <Route path="/login" element={
            <Login />
          } />
          <Route path="/register" element={
            <Register />
          } />
          <Route path="/game/drawing" element={
            <DrawingGame />
          } />
          <Route path="/account" element={
            <Account />
          } />
          <Route path="/post" element={
            <Post/>
          } />
          <Route path="/post/:title" element={
            <Article/>
          } />
          <Route path="/post/create" element={
            <ArticleCreate/>
          } />
          <Route path="/simulate" element={
            <Simulator />
          } />
          <Route path="/simulate/earth" element={
            <Earth />
          } />
          <Route path="/simulate/jupiter" element={
            <Jupiter />
          } />
          <Route path="/simulate/mars" element={
            <Mars />
          } />
          <Route path="/simulate/mercury" element={
            <Mercury />
          } />
          <Route path="/simulate/neptune" element={
            <Neptune />
          } />
          <Route path="/simulate/saturn" element={
            <Saturn />
          } />
          <Route path="/simulate/sun" element={
            <Sun />
          } />
          <Route path="/simulate/uranus" element={
            <Uranus />
          } />
          <Route path="/simulate/venus" element={
            <Venus />
          } />
        </Routes>
        </div>
        <Footer />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
