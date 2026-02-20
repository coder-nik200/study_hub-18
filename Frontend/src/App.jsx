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
import { motion, useScroll } from "framer-motion";
import ExpertDashboard from "./components/Expert/ExpertDashboard";
import ExpertAnalysis from "./components/Expert/ExpertAnalysis";
import StudentTasks from "./components/Student/StudentTasks";
import Profile from "./pages/Profile";

const App = () => {
  const { user } = useContext(UserContext);
  const { scrollYProgress } = useScroll();

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
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="fixed top-0 left-0 h-2 w-full bg-indigo-500 origin-left z-50"
        />
      </div>

      {user ? <AiChatBot /> : null}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/tips" element={<Tips />} />

        <Route
          path="/expert"
          element={
            user ? (
              <ExpertDashboard />
            ) : (
              <Navigate to="/" state={{ openLogin: true }} replace />
            )
          }
        />

        <Route path="/analysis" element={<ExpertAnalysis />} />

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

        <Route
          path="/student/tasks"
          element={
            user ? (
              <StudentTasks />
            ) : (
              <Navigate to="/" state={{ openLogin: true }} replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              <Profile />
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
