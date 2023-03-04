
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from "./components/Register";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/login" element={
          <Login/>
        }/>
        <Route path="/register" element={
          <Register/>
        }/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
