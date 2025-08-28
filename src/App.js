import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import NavBar from './components/NavBar/NavBar'; // Kendi kendine kapanan etiket kullanmak daha temizdir.
import Home from './components/Home/Home';
import User from './components/User/User';
  
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users/:userId" element={<User />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;