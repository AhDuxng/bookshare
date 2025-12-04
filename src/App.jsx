import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import BookDetail from "./components/BookDetail";
import AddBook from "./components/AddBook";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book/:id" element={<BookDetail/>} />
      <Route path="/add-book" element={<AddBook />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;