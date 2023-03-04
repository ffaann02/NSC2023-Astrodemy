import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Login from './components/Login';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <Login/>
        }/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
