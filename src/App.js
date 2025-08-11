import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './Header/Header';
import Mainpage from './Mainpage/Mainpage';
import AiSearch from "./AiSearch/AiSearch";
import Explore from './Explore/Explore';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/Explore" element={<Explore/>}/>
        <Route path="/AiSearch" element={<AiSearch />} />
      </Routes>
    </Router>
  );
}

export default App;

