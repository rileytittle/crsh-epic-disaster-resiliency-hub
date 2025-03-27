return (
	<>
		<div style={{ textAlign: "center" }}>
			<h1>Volunteer Login Portal</h1>
			<form>
				<input
					type="text"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					placeholder="Email"
				/>
				<input
					type="password"
					onChange={(e) => setPassword(e.target.value)}
					value={password}
					placeholder="Password"
				/>
				<button onClick={login}>GO</button>
			</form>
			<p>
				<a href="/volunteer/reset-password" style={{ textDecoration: "none", color: "blue" }}>
					Forgot Password?
				</a>
			</p>
		</div>
	</>
);

