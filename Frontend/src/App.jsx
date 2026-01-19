import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import { Route, Routes } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import Home from "./pages/Home";
import Contact from "./components/Contact";
import About from "./components/About/About";
import Tips from "./components/Tips/Tips";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./components/Dashboard/Dashboard";

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="toast-responsive"
        bodyClassName="toast-body-responsive"
      />

      <div className="pt-10">
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
