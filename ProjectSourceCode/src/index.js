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
    layoutsDir: __dirname + 'powerwash/src/views/layouts',
    partialsDir: __dirname + 'powerwash/src/views/partials',
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
app.use(express.static(path.join(__dirname, 'src/views')));


// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
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



//--------------------------------------------------------------\\
//----------------------Starting Server--------- ----------------\\

// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');

//--------------------------------------------------------------\\
