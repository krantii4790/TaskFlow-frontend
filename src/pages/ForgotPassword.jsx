import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ==========================
  // SEND OTP
  // ==========================
  const sendOtp = async () => {
    if (!email) return setError("Email is required");
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/send-otp", { email });
      setStep(2);
    } catch (err) {
  setError(
    err.response?.data?.message ||
    err.response?.data?.error ||
    "Failed to send OTP"
  );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // VERIFY OTP
  // ==========================
  const verifyOtp = async () => {
    if (!otp) return setError("OTP is required");
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/verify-otp", { email, otp });
      setStep(3);
    } catch (err) {
  setError(
    err.response?.data?.message ||
    "Invalid OTP"
  );
} finally {
      setLoading(false);
    }
  };

  // ==========================
  // RESET PASSWORD
  // ==========================
  const resetPassword = async () => {
    if (!password) return setError("Password is required");
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/reset-password", {
  email,
  password,
});

      alert("Password reset successful!");
      navigate("/");
    } catch (err) {
  setError(
    err.response?.data?.message ||
    "Failed to reset password"
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-white text-black p-8 rounded-xl w-96 shadow-lg">

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-4">Enter Email</h2>
            <input
              className="w-full p-2 border rounded mb-4"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
            <input
              className="w-full p-2 border rounded mb-4"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold mb-4">New Password</h2>
            <input
              type="password"
              className="w-full p-2 border rounded mb-4"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-purple-500 text-white py-2 rounded"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
