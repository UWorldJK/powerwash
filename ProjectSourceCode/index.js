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
  res.json({status: 'success', message: 'Welcome!'});
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
    console.log("REGISTERING")
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = 'INSERT INTO users (email, username, password) VALUES ($1, $2, $3)';
    const values = [req.body.email, req.body.username, hash];
    
    await db.none(query, values); 

    res.redirect('/home');
  } catch (err) {
    console.error(err);
   
    res.render('pages/register', { message: 'error with registration, try again' });
  }
});

app.get('/forgot', (req, res) => {
  res.render('pages/forgot');
});

app.get('/home', (req, res) => {
  res.render('pages/home');
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

app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
      console.log("First line of the file content:");
      const fs = require('fs');
      const readline = require('readline');

      const fileStream = fs.createReadStream(req.file.path);
      const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity
      });

      let firstLinePrinted = false; // Flag to track if the first line has been printed

      rl.on('line', (line) => {
          if (!firstLinePrinted) {
              console.log(line);
              firstLinePrinted = true;
              rl.close(); // Close the stream after the first line is printed
          }
      });

      rl.on('close', () => {
          res.render('pages/choice');
      });
  } else {
      res.status(400).send('No file uploaded.');
  }
});



// Route to handle file upload and print the first line
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(__dirname, req.file.path);

  // Read the file and print the first line
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading file.');
    }

    const firstLine = data.split('\n')[0];
    console.log('First line of the file:', firstLine);
    

    // Cleanup uploaded file
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) console.error('Error deleting file:', unlinkErr);
    });

    
  });
});

app.get('/profile', (req, res) => {
  res.render('pages/profile');
});

app.get('/choice', (req, res) => {
  res.render('pages/choice');
});

//--------------------------------------------------------------\\
//----------------------Starting Server--------- ----------------\\

// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');

//--------------------------------------------------------------\\
