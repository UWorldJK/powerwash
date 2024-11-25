//---------------------Dependencies----------------------------\\

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
//--------------------------------------------------------------\\




//------------------------App Settings---------------------------\\
app.use('/images', express.static(__dirname + 'src/views/images')); // change the path here

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

app.use('/assets', express.static(path.join(__dirname, 'src/views/assets')));
app.use('/images', express.static(path.join(__dirname, 'src/views/images')));

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

app.post("/post-pairs", (req, res) => {
  pairsData = req.body.pairs; // Save pairs for use on the result page
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

app.post('/forgot', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Generate a reset token
    const token = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Set the token and expiration time in the database
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    // Send the email
    const resetLink = `http://localhost:3000/reset/${token}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: 'Password Reset',
      text: `You are receiving this email because you requested a password reset.\n\n
        Please click the link below to reset your password:\n\n
        ${resetLink}\n\n
        If you did not request this, please ignore this email.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Password reset email sent');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending email');
  }
});

app.get('/logout', (req, res) => {
  res.render('pages/logout');
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

//--------------------------------------------------------------\\
//----------------------Starting Server--------- ----------------\\

// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');

//--------------------------------------------------------------\\
