import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  Edit2,
  Save,
  X,
  Upload,
  Loader,
} from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import api from "../api/axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/profile");
      const userData = res.data.user;
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        bio: userData.bio || "",
        avatar: userData.avatar || "",
      });
      if (userData.avatar) {
        setAvatarPreview(
          userData.avatar.startsWith("http")
            ? userData.avatar
            : `http://localhost:3000/${userData.avatar}`,
        );
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("bio", formData.bio);
      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }

      const res = await api.put("/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
    setAvatarFile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="indigo" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-indigo-100">Manage your account settings</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-indigo-600" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition shadow-lg">
                    <Upload size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                {formData.name || "User"}
              </h2>
              <p className="text-gray-500">{formData.email}</p>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User size={16} /> Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
                  />
                ) : (
                  <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800">
                    {formData.name || "Not set"}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={16} /> Email Address
                </label>
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800">
                  {formData.email}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User size={16} /> Role
                </label>
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user?.role === "expert"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user?.role === "expert" ? "👨‍🏫 Expert" : "🎓 Student"}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Edit2 size={16} /> Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
                  />
                ) : (
                  <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800 min-h-[100px]">
                    {formData.bio || "No bio added yet"}
                  </div>
                )}
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                )}
              </div>

              {/* Joined Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={16} /> Member Since
                </label>
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader className="animate-spin" size={20} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  >
                    <Edit2 size={20} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
