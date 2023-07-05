const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Middleware

let users = []; // In-memory storage for simplicity

// Register user API
app.post("/api/register", (req, res) => {
  const { username, email, password } = req.body;
  // Check if the user already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }
  // Create a new user object
  const newUser = { username, email, password };
  users.push(newUser);
  return res.status(201).json({ message: "User registered successfully" });
});

// Login user API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  // Find the user in the array
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  return res.json({ message: "Login successful" });
});

// Forgot password API
app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body;
  // Find the user in the array
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // Generate and send password reset token via email (not implemented in this example)
  return res.json({ message: "Password reset token sent now use reset-password api to reset password" });
});

// Reset password API
app.post("/api/reset-password", (req, res) => {
  const { email, newPassword } = req.body;
  // Find the user in the array
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // Update the user's password
  user.password = newPassword;
  return res.json({ message: "Password reset successful" });
});

// View users API
app.get("/api/users", (req, res) => {
  return res.json(users);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

