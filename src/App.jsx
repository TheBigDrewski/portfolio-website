import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Board from './Board.jsx';

function App() {

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chess" element={<Board />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App
