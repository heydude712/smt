const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const port = 1247;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// Database (temporary storage)
const users = [];


// Routes

app.get('/', (req, res) => {
  res.render('index', {
    registerMessage: '',
    loginMessage: '',
    forgotPasswordMessage: '',
    resetPasswordMessage: '',
    users: users
  });
});


app.get('/register', (req, res) => {
  res.render('register', { message: '' });
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const userExists = users.find(user => user.email === email);

  if (userExists) {
    res.render('register', { message: 'Email already registered.' });
  } else {
    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ email, password: hashedPassword });
    res.render('register', { message: 'Registration successful.' });
  }
});

app.get('/login', (req, res) => {
  res.render('login', { message: '' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email);

  if (user && bcrypt.compareSync(password, user.password)) {
    res.render('login', { message: 'Login successful.' });
  } else {
    res.render('login', { message: 'Invalid email or password.' });
  }
});

app.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { message: '' });
});

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find(user => user.email === email);

  if (user) {
    // Redirect to reset password page
    res.redirect('/reset-password?email=' + email);
  } else {
    res.render('forgot-password', { message: 'Email not found.' });
  }
});

app.get('/reset-password', (req, res) => {
  res.render('reset-password', { message: '' });
});

app.post('/reset-password', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email);

  if (user) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    user.password = hashedPassword;
    res.render('reset-password', { message: 'Password reset successful.' });
  } else {
    res.render('reset-password', { message: 'Email not found.' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

