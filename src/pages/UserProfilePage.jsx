import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { FiUser, FiMapPin, FiPhone, FiMail, FiSave } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const UserProfilePage = () => {
  const { user, profile, loading, updateUserProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Sync profile data into form state when loaded
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || user?.name || "",
        phone: profile.phone || "",
        street: profile.address?.street || "",
        city: profile.address?.city || "",
        state: profile.address?.state || "",
        zipCode: profile.address?.zipCode || "",
      });
    }
  }, [profile, user]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-14 space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 rounded"></div>
        <div className="h-64 w-full bg-oya-paper rounded-2xl border border-slate-100"></div>
        <div className="h-96 w-full bg-oya-paper rounded-2xl border border-slate-100"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateUserProfile({
        name: form.name,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
        }
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 py-14">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-oya-teal">Your Profile</h1>
          <p className="mt-2 text-sm text-oya-teal/70">
            Manage your personal information and default delivery details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Account Details Section */}
          <div className="bg-white rounded-2xl border border-oya-teal/10 p-6 sm:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-oya-teal mb-6">
              <FiUser className="text-oya-green" /> Account Information
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <label className="block text-sm font-semibold text-oya-teal">
                Full Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                  placeholder="e.g., Jane Doe"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-oya-teal">
                Email Address
                <div className="relative mt-2">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400 font-normal">Email cannot be changed.</p>
              </label>
            </div>
          </div>

          {/* Delivery Details Section */}
          <div className="bg-white rounded-2xl border border-oya-teal/10 p-6 sm:p-8 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-oya-teal mb-6">
              <FiMapPin className="text-oya-green" /> Default Delivery Details
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <label className="block text-sm font-semibold text-oya-teal sm:col-span-2">
                Phone Number
                <div className="relative mt-2">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                    placeholder="0801 234 5678"
                  />
                </div>
              </label>

              <label className="block text-sm font-semibold text-oya-teal sm:col-span-2">
                Street Address
                <input
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                  placeholder="123 Market Street"
                />
              </label>

              <label className="block text-sm font-semibold text-oya-teal">
                City
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                  placeholder="Lagos"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block text-sm font-semibold text-oya-teal">
                  State
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                    placeholder="Lagos"
                  />
                </label>
                
                <label className="block text-sm font-semibold text-oya-teal">
                  Zip Code
                  <input
                    name="zipCode"
                    value={form.zipCode}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                    placeholder="100001"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className={`inline-flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold text-white transition-all ${
                isSaving
                  ? "bg-oya-green/70 cursor-not-allowed"
                  : "bg-oya-green hover:bg-oya-teal"
              }`}
            >
              <FiSave className={isSaving ? "animate-pulse" : ""} />
              {isSaving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserProfilePage;
