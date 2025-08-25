import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from './pages/HomePage';
import Timer from './pages/Timer';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<HomePage />} />
      <Route path = "/timer" element = {<Timer />}  />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
