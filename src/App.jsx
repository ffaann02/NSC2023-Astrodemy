
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Login from './components/Login';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import About from "./components/About";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
      <Route path="/" element={
          <About/>
        }/>
        <Route path="/login" element={
          <Login/>
        }/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
