import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleEmailCheck = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/forgot-password", { email });
      setStep(2);
    } catch (error) {
      alert("No account found with this email!");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/reset-password", {
        email,
        password: newPass,
      });

      alert("Password updated successfully!");
      navigate("/");
    } catch (error) {
      alert("Error updating password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-white text-black p-8 rounded-xl w-96">
        {step === 1 && (
          <form onSubmit={handleEmailCheck}>
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              required
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded">
              Next
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePasswordReset}>
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <input
              type="password"
              placeholder="New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              required
            />
            <button className="w-full bg-green-500 text-white py-2 rounded">
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
