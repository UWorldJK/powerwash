// ********************** Initialize server **********************************


const server = require('../../index'); //TODO: Make sure the path to your index.js is correctly added



// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();  
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

// describe('Server!', () => {
//   // Sample test case given to test / endpoint.
//   it('Returns the default welcome message', done => {
//     chai
//       .request(server)
//       .get('/home')
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.status).to.equals('success');
//         assert.strictEqual(res.body.message, 'Welcome!');
//         done();
//       });
//   });
// });

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

//test to see if we require a username.

describe('Testing Add User with all Fields', () => {
  // Example Negative Testcase :
  // API: /add_user
  // Input: {username: 'jacob', email: 'jacobkurry1@gmail.com'}
  // Expect: res.status == 400 and res.body.message == 'Invalid input'
  // Result: This test case should pass and return a status 400 along with a "Invalid input" message.
  // Explanation: The testcase will call the /add_user API with the following invalid inputs
  // and expects the API to return a status of 400 along with the "Invalid input" message.
  it('Positive : /register. Checking all fields', function (done) {
    this.timeout(5000);
    chai
      .request(server)
      .post('/register')
      .send({email: 'jacobkurry@gmail.com', username: 'jacob', password: '12345'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('Testing Add User w/o all fields', () => {
  it('Negative : /register. Checking invalid fields', function (done) {
    this.timeout(5000);
    chai
      .request(server)
      .post('/register')
      //try only filling in user and email
      .send({email: 'jacobkurry@gmail.com', username: 'jacob'}) 
      .end((err, res) => {
        //bc of what I added to index.js if not every field then a status of 400 is sent 
        //w the message 'Please fill out all fields'
        expect(res).to.have.status(400);
        expect(res.body.message).to.equals('Please fill out all fields'); 
        done();
      });
  });
});

describe('Testing Render', () => {
  // Sample test case given to test /test endpoint.
  it('test "/login" route should render with an html response', done => {
    chai
      .request(server)
      .get('/login') // for reference, see lab 8's login route (/login) which renders home.hbs
      .end((err, res) => {
        res.should.have.status(200); // Expecting a success status code
        res.should.be.html; // Expecting a HTML response
        done();
      });
  });
});

describe('Testing Render Negative', () => {
  // Sample test case given to test /test endpoint.
  it('test "a fake render" route should not render with an html response', done => {
    chai
      .request(server)
      .get('/import') // for reference, see lab 8's login route (/login) which renders home.hbs
      .end((err, res) => {
        res.should.have.status(404); // Expecting a success status code
        res.should.be.html; // Expecting a HTML response
        done();
      });
  });
});

// ********************************************************************************