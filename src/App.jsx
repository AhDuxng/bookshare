import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import BookDetail from "./components/BookDetail";
import AddBook from "./components/AddBook";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book/:id" element={<BookDetail/>} />

      <Route path="/add-book" element={<AddBook />} />
    </Routes>
  );
}

export default App;