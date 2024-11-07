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

//--------------------------------------------------------------\\

//------------------------Api Routes-----------------------------\\

app.get('/', (req, res) => {
  res.render("pages/home");
});


app.get('/login', (req, res) => {
  res.render('pages/login');
});
app.post('/login', async (req, res) => {
  try {
    const user = await db.one('SELECT users.password FROM users WHERE users.username = $1', [req.body.username]);
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) 
    {
      req.session.user = user;
      req.session.save();
      res.redirect('/discover');
    } 
    else 
    {
      res.render('pages/login', { message: 'Incorrect username/password.' });
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
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    const values = [req.body.username, hash];
    
    await db.none(query, values); 

    res.redirect('/login');
  } catch (err) {
    console.error(err);
   
    res.render('pages/register', { message: 'error with registration, try again' });
  }
});

//--------------------------------------------------------------\\
//----------------------Starting Server--------- ----------------\\

// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');

//--------------------------------------------------------------\\
