import { useState } from "react";
import axios from "axios";

const RequestReset = () => {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	const handleRequestReset = async () => {
		try {
			const response = await axios.post(
				"http://localhost:3000/mailgun/request-password-reset",
				{ email }
			);
			setMessage(response.data.message);
		} catch (error) {
			setMessage("Error sending reset email");
		}
	};

	return (
		<div>
			<h2>Forgot Password?</h2>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Enter your email"
			/>
			<button onClick={handleRequestReset}>Send Reset Email</button>
			<p>{message}</p>
		</div>
	);
};

export default RequestReset;
