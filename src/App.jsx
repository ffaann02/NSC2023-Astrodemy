
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { createContext, useState ,useEffect} from "react";
import Login from './components/Login';
import Register from "./components/Register";
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import About from "./components/About";
import Account from "./components/Account";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import DrawingGame from "./components/DrawingGame/DrawingGame";

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

  const [logged,setLogged] = useState(false);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserData = localStorage.getItem('userData');
  
    if (storedUserId && storedUserData) {
      setLogged(true);
      setUserData(JSON.parse(storedUserData));
    } else {
      setLogged(false);
      setUserData(null);
      return;
    }
  
    const firestore = firebase.firestore();
    firestore.collection('users').doc(storedUserId).get()
      .then(doc => {
        if (doc.exists) {
          const userData = {
            userId: storedUserId,
            username: doc.data().username,
            userProfile: doc.data().profileImage
          };
          setUserData(userData);
          localStorage.setItem('userId', storedUserId);
          localStorage.setItem('userData', JSON.stringify(userData));
        } else {
          console.log('No user data found');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  
  return (
    <UserContext.Provider value={{logged,setLogged,userData,setUserData}}>
      <Router>
      <Navbar/>
      <Routes>
      <Route path="/" element={
          <About/>
        }/>
        <Route path="/login" element={
          <Login/>
        }/>
        <Route path="/register" element={
          <Register/>
        }/>
        <Route path="/game/drawing" element={
          <DrawingGame/>
        }/>
        <Route path="/account" element={
          <Account/>
        }/>
      </Routes>
      <Footer/>
    </Router>
    </UserContext.Provider>
  );
}

export default App;
