import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import api from "../api/axios";
import { toast } from "react-toastify";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data.user);
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null);
          toast.error("Session expired. Please login again ❌", {
            toastId: "auth-expired",
          });
        } else {
          toast.error("Something went wrong ⚠️");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
