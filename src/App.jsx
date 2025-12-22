import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import BookDetail from "./components/BookDetail";
import AddBook from "./components/AddBook";
import Login from "./components/Login";
import Register from "./components/Register";
import About from "./components/About";
import Contact from "./components/Contact";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Profile from "./components/Profile.jsx";
import BrowseBooks from "./components/BrowseBooks";
import ProfileDetail from "./components/ProfileDetail";
import OrderHistory from "./components/OrderHistory";
import MyBooks from "./components/MyBooks";
import PreviewPage from "./components/PreviewPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book/:id" element={<BookDetail/>} />
      <Route path="/add-book" element={<AddBook />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/detail" element={<ProfileDetail />} />
      <Route path="/profile/orders" element={<OrderHistory />} />
      <Route path="/profile/my-books" element={<MyBooks />} />
      <Route path="/browse" element={<BrowseBooks />} />
      <Route path="/preview" element={<PreviewPage />} />
    </Routes>
  );
}

export default App;