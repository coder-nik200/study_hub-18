import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import Home from "./pages/Home";
import Contact from "./components/Contact";
import About from "./components/About/About";
import Tips from "./components/Tips/Tips";
import Dashboard from "./components/Dashboard/Dashboard";
import AiChatBot from "./components/ChatBot/AiChatBot";

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
      {user ? <AiChatBot /> : null}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/tips" element={<Tips />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard />
            ) : (
              <Navigate to="/" state={{ openLogin: true }} replace />
            )
          }
        />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
