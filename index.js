const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const isValid = require('./router/auth_users.js').isValid;


const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){

// Check if there is a JWT token in the request header
const token = req.headers['authorization'];

if (token) {
  // Verify the token
  jwt.verify(token, 'your_secret_key', function(err, decoded) {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      // Token is valid, set the decoded user information to request object
      req.user = decoded;
      next();
    }
  });
} else {
  return res.status(401).json({ message: 'Token not provided' });
}
});

// Login route
app.post("/customer/login", (req, res) => {
const { username, password } = req.body;
// Check if username and password are valid
if (isValid(username, password)) {
  // If valid, create JWT token
  const token = jwt.sign({ username: username }, 'your_secret_key', { expiresIn: '1h' });
  res.json({ token: token });
} else {
  res.status(401).json({ message: 'Invalid username or password' });
}
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

