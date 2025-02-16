import './App.css';
import Header from './components/Header';
import AddPet from './components/addPet';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";  // Correct import from react-router-dom

function App() {
  return (
    <Router>  {/* BrowserRouter wraps your app */}
      <Header />
      <Routes>  {/* Routes is used for routing */}
        <Route path="/pet/add" element={<AddPet />} />  {/* Route definition */}
      </Routes>
    </Router>
  );
}

export default App;
