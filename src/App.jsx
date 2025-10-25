import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Board from './Board.jsx';
import ProjectsPage from "./ProjectsPage.jsx";

function App() {

  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full bg-gray-100 text-gray-900">
        <Navbar />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chess" element={<Board />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App
