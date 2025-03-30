import { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    try {
      const response = await axios.post("https://crsh-epic-disaster-resiliency-hub-server.vercel.app/mailgun/reset-password", { token, newPassword: password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error resetting password");
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" />
      <button onClick={handleResetPassword}>Reset Password</button>
      <p>{message}</p>
    </div>
  );
};

export default ResetPassword;

