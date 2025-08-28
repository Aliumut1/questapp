import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import User from './components/User/User';
import Auth from './components/Auth/Auth'; 
import PostPage from './components/PostPage/PostPage';
import { CustomThemeProvider } from './Context/ThemeContext';

function App() {
  return (
    <CustomThemeProvider>
    <div className="App">
     <BrowserRouter>
       <NavBar />
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/users/:userId" element={<User />} />
         <Route path="/posts/:postId" element={<PostPage />} />
         <Route path="/auth" element={<Auth />} />

       </Routes>
     </BrowserRouter>
    </div>
   </CustomThemeProvider>
  );
}

export default App;