import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './Header/Header';
import Mainpage from './Mainpage/Mainpage';
import AiSearch from "./AiSearch/AiSearch";
import Weather from "./Weather/Weather";
import Explore from "./Explore/Explore"; 

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/AiSearch" element={<AiSearch />} />
        <Route path="/Explore" element={<Explore />} />
      </Routes>
    </Router>
  );
}

export default App;

