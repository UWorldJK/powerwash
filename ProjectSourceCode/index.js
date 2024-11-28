//---------------------Dependencies----------------------------\\
require('dotenv').config();

const express = require('express'); //to build an application server or API
const app = express();
const handlebars = require('express-handlebars'); // templating
const Handlebars = require('handlebars');

const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server

const bodyParser = require('body-parser'); //middleware
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcryptjs'); //  To hash passwords

const multer = require('multer'); //reading files
const upload = multer({ dest: 'uploads/' }); // Files will be stored in the 'uploads' directory

const crypto = require('crypto');
const nodemailer = require('nodemailer');
app.use(express.urlencoded({ extended: true }));


//--------------------------------------------------------------\\

//-------------------Connecting to Database---------------------\\

// `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'src/views/layouts'),
    partialsDir: path.join(__dirname, 'src/views/partials'),
  });

// database configuration
const dbConfig = {
    host: 'db', //database server
    port: 5432, //database port
    database: process.env.POSTGRES_DB, //database name
    user: process.env.POSTGRES_USER, //user account to connect with
    password: process.env.POSTGRES_PASSWORD, //password of the user account
  };
  
  const db = pgp(dbConfig);

//testing database
db.connect()
.then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
})
.catch(error => {
    console.log('ERROR:', error.message || error);
});

// initialize session variables
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
    })
  );
  
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.use('/assets', express.static(path.join(__dirname, 'src/views/assets')));
  app.use('/images', express.static(path.join(__dirname, 'src/views/images')));



  // Authentication Middleware
const auth = (req, res, next) => {
  const publicPaths = ['/login', '/register']; // Paths that don't require authentication
  if (!req.session.user && !publicPaths.includes(req.path)) {
    return res.redirect('/login');
  }
  next();
};

    
// Authentication Required
app.use(auth);

//--------------------------------------------------------------\\




//------------------------App Settings---------------------------\\

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


//--------------------------------------------------------------\\

//------------------------Api Routes-----------------------------\\
app.get('/home', (req, res) => {
  res.render('pages/home')
});


app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.get('/', (req, res) => {
  res.render('pages/login');
});
app.post('/login', async (req, res) => {
  try {
    console.log("TRYING TO FIX")	  
    console.log("LOGGING IN")
    console.log(req.body.email)
    const user = await db.one('SELECT users.password FROM users WHERE users.username = $1', [req.body.username]);
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) 
    {
      req.session.user = user;
      req.session.save();
      res.redirect('/home');
    } 
    else 
    {
      res.render('pages/login', {message: 'Incorrect username/password.' });
    }
  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
});

app.get('/register', (req, res) => {
  res.render('pages/register');
});
app.post('/register', async (req, res) => {
  try {
    // Destructure the required fields from the request body
    const { email, username, password, firstname, lastname, country } = req.body;

    // Validate that all required fields are provided
    if (!email || !username || !password ) {
      return res.status(400).json({ message: 'Please fill out all fields' });
    }
    
    console.log("REGISTERING")
    const hash = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, username, password) VALUES ($1, $2, $3)';
    const values = [email, username, hash];
    await db.oneOrNone(query, values); 

    res.redirect('/home');

  } catch (err) {
    // Handle any errors during the registration process
    console.error(err);
    res.render('pages/register', { message: 'Error with registration, try again' });
  }
});

let pairsData=[];

app.post("/post-pairs", (req, res) => {
  pairsData = req.body.pairs; // Save pairs for use on the result page
  console.log(pairsData)
  
  console.log("Received pairs:", pairsData);
  res.sendStatus(200);
});

// Endpoint to get the pairs (for rendering on the result page)
app.get("/get-pairs", (req, res) => {
  res.json(pairsData);
});




app.get('/home', (req, res) => {
  res.render('pages/home');
});

app.get('/forgot', (req, res) =>{
  res.render('pages/forgot');
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
  tls: {
      rejectUnauthorized: false, 
  },
});


app.post('/forgot', async (req, res) => {
  const { email } = req.body;

  try {
      const sanitizedEmail = email.trim().toLowerCase();
      console.log('Sanitized email:', sanitizedEmail);

      const result = await db.query('SELECT * FROM users WHERE LOWER(email) = $1', [sanitizedEmail]);
      console.log('Query result:', result);

      if (!result || result.length === 0) {
          console.log('No user found with this email:', sanitizedEmail);
          return res.status(400).send('No account associated with this email');
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

      console.log('Updating user:', {
          email: sanitizedEmail,
          resetToken,
          resetTokenExpires
      });

      const updateResult = await db.query(
        'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
        [resetToken, resetTokenExpires, sanitizedEmail]
      );
      const result2 = await db.query('SELECT * FROM users WHERE LOWER(email) = $1', [sanitizedEmail]);
      console.log('Query result22:', result2);
    
      //console.log('Update result :', updateResult);
    
      if (updateResult.rowCount === 0) {
        console.error('Failed to update reset token for:', sanitizedEmail);
        return res.status(400).send('Failed to update reset token');
      }

      const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
      await transporter.sendMail({
          from: '"Your App" <no-reply@yourapp.com>',
          to: sanitizedEmail,
          subject: 'Password Reset',
          html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>`
      });

      return res.status(200).send('Password reset email sent');
  } catch (error) {
      console.error('Error occurred:', error.message);
      res.status(500).send('An error occurred');
  }
});


app.get('/logout', (req, res) => {
  res.render('pages/logout');
  req.session.destroy();
});

app.get('/setup', (req, res) => {
  res.render('pages/setup');
});

app.get('/about', (req, res) => {
  res.render('pages/about');
});

app.get('/export', (req, res) => {
  res.render('pages/export');
});

app.get('/result', (req, res) => {
  res.render('pages/result');
});


app.get('/profile', (req, res) => {
  res.render('pages/profile');
});

app.get('/choice', (req, res) => {
  res.render('pages/choice');
});

app.get('/graphSelection', (req, res) => {
  res.render('pages/graphSelection');
});


app.get('/test', (req, res) => {
  res.render('pages/test');
});

app.get('/reset-password', (req, res) => {
  res.render('pages/reset-password');
});



app.post('/reset-password', async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const token = req.query.token; 


  if (!token) {
    return res.status(400).send('Token is required');
  }

  try {

    const result = await db.query('SELECT * FROM users WHERE reset_token = $1', [token]);

    console.log('Query result33:', result);
    console.log('Rows from result:', result.rows);

    if (!result || result.length === 0) {
      return res.status(400).send('Invalid or expired token');
    }

    const user = result[0];  

  
    console.log('User from DB:', user);


    const now = new Date();
    if (new Date(user.reset_token_expires) < now) {
      return res.status(400).send('Token has expired');
    }


    if (newPassword !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE username = $2',
      [hashedPassword, user.username]
    );

    //return res.status(200).send('Password reset successful!');
    return res.redirect('/login');
  } catch (error) {
   
    console.error('Error occurred:', error.message);
    res.status(500).send('An error occurred');
  }
});





//--------------------------------------------------------------\\
//----------------------Starting Server--------- ----------------\\

// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');

//--------------------------------------------------------------\\
