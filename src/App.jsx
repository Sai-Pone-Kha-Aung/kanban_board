import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/dashboard/Dashboard";
import Board from "./components/pages/board/Board";
import Sidebar from "./components/ui/sidebar/Sidebar";

function App() {
  return (
    <div className="container">
      <Sidebar />
      <main className="main_content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/board" element={<Board />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
