const chai = require('chai');
const chaiHTTP = require('chai-http');
const mongoose = require('mongoose');
// const faker = require('faker');

// Access to start and stop the server as well as connect to the DB
const {DATABASE_URL, PORT} = require('../config/config');
const {app, runServer, closeServer} = require('../server');

// Access to models for recipes, users, and votes
const Recipe = require('../models/recipe');
const User = require('../models/user');
const Vote = require('../models/vote');

// Zombie rquirements (Headless DOM)
const Browser = require('zombie'),
assert = require('assert');

const should = chai.should();
const expect = chai.expect;
chai.use(chaiHTTP);






// Allows the middleware to think we're already authenticated.
// app.request.isAuthenticated = function() {
//   return true
// };


// function seedRecipeData() {
//   console.log('seeding Recipe data');
//   const seedData = [];
//
//   for (let i = 0; i <= 10; i++) {
//     seedData.push(generateRecipeData());
//   }
//   return TestRecipe.insertMany(seedData);
// }
//
//
// function generateRecipeOrientation() {
//   const orientations = ['Standard', 'Inverted'];
//   return orientations[Math.floor(Math.random() * orientations.length)];
// }
//
// function generateRecipeGrind() {
//   const grinds = ['Extra Coarse', 'Coarse', 'Medium-Coarse', 'Medium', 'Medium-Fine', 'Fine', 'Extra Fine'];
//   return grinds[Math.floor(Math.random() * grinds.length)];
// }
//
// function generateRecipeData() {
//   return {
//     title: faker.lorem.words(),
//     author: `${faker.name.firstName()} ${faker.name.lastName()}`,
//     orientation: generateRecipeOrientation(),
//     massWater: faker.random.number(),
//     massCoffee: faker.random.number(),
//     waterTemp: faker.random.number(),
//     grind: generateRecipeGrind(),
//     instructions: faker.lorem.paragraph(),
//     ownerID: 'test-user'
//   }
// }
//
// function tearDownDb() {
//   console.warn('Deleting DB');
//   return mongoose.connection.dropDatabase();
// }


  // beforeEach(function() {
  //   return seedRecipeData();
  // });
  //
  // afterEach(function() {
  //   return tearDownDb();
  // });




describe('Render Pages', function() {


  before(function() {
    return runServer().then((port) => {
      this.browser = new Browser({ site: `http://localhost:${port}` });
    });
  });

  after(function() {
    return closeServer();
  });


  describe('Landing Page', () => {

    it('should show HTML', () => {
      const resolvingPromise = new Promise((resolve, reject) => {
        chai.request(app)
          .get('/')
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.html;
            resolve('it resolved');
          });
      });
      return resolvingPromise.then( (result) => {
        expect(result).to.equal('it resolved');
      });
    });
  });

  describe('Login Page', () => {
    // load the login page
    before(function(done) {
      this.browser.visit('/login', done);
    });

    it('should show HTML', () => {
      const resolvingPromise = new Promise((resolve, reject) => {
        chai.request(app)
          .get('/login')
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.html;
            resolve('it resolved');
          });
      });
      return resolvingPromise.then( (result) => {
        expect(result).to.equal('it resolved');
      });
    });

    it('should show a login form', function() {
      assert.ok(this.browser.success);
      assert.equal(this.browser.text('form legend'), 'Login');

    });

    it('should have email input and password input with a method of post for login form', function() {
      this.browser.assert.element('#user-email');
      this.browser.assert.element('#password');
      this.browser.assert.attribute('form', 'method', 'post');
    });

    it('should show fail message for incorrect username', function(done) {
      this.browser.fill('#user-email', 'notauser@mail.com');
      this.browser.fill('#password', 'incorrectpassword');
      this.browser.pressButton('button').then(() => {
        assert.ok(this.browser.success);
        assert.equal(this.browser.text('section.flash-alert'), 'No user found.');
      }).then(done, done);
    });

    it('should show fail message for incorrect password', function(done) {
      this.browser.fill('#user-email', 'testuser@aeropressme.com');
      this.browser.fill('#password', 'incorrectpassword');
      this.browser.pressButton('button').then(() => {
        assert.ok(this.browser.success);
        assert.equal(this.browser.text('section.flash-alert'), 'Oops! Password is incorrect.');
      }).then(done, done);
    });
  })


  describe('Registration Page', () => {
    // load the Registration page
    before(function(done) {
      this.browser.visit('/registration', done);
    });

    it('should show HTML', () => {
      const resolvingPromise = new Promise((resolve, reject) => {
        chai.request(app)
          .get('/registration')
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.html;
            resolve('it resolved');
          });
      });
      return resolvingPromise.then( (result) => {
        expect(result).to.equal('it resolved');
      });
    });

    it('should show a registration form', function() {
      assert.ok(this.browser.success);
      assert.equal(this.browser.text('form legend'), 'Registration Information');

    });

    it('should have first name, last name, email, password, and confirm password inputs with a method of post', function() {
      this.browser.assert.element('#reg-author-first');
      this.browser.assert.element('#reg-author-last');
      this.browser.assert.element('#reg-email');
      this.browser.assert.element('#reg-password');
      this.browser.assert.element('#reg-confirm-password');
      this.browser.assert.attribute('form', 'method', 'post');
    });

    it('should show fail message for email already in use', function(done) {
      this.browser.fill('#reg-author-first', 'Test');
      this.browser.fill('#reg-author-last', 'User');
      this.browser.fill('#reg-email', 'testuser@aeropressme.com');
      this.browser.fill('#reg-password', 'password');
      this.browser.fill('#reg-confirm-password', 'password');
      this.browser.pressButton('button').then(() => {
        assert.ok(this.browser.success);
        assert.equal(this.browser.text('section.flash-alert'), 'That email is already taken.');
      }).then(done, done);
    });

    it('should show fail message for non-matching password and confirm password fields', function(done) {
      this.browser.fill('#reg-author-first', 'Test');
      this.browser.fill('#reg-author-last', 'User');
      this.browser.fill('#reg-email', 'newuser@aeropressme.com');
      this.browser.fill('#reg-password', 'password');
      this.browser.fill('#reg-confirm-password', 'NOTpassword');
      this.browser.pressButton('button').then(() => {
        assert.ok(this.browser.success);
        assert.equal(this.browser.text('section.flash-alert'), 'Passwords do not match.');
      }).then(done, done);
    });
  })

  describe('My Recipes Page', () => {
    // load the login page
    before(function(done) {
      this.browser.visit('/login');
      this.browser.fill('#user-email', 'testuser@aeropressme.com');
      this.browser.fill('#password', 'password');
      this.browser.pressButton('button', done);
    });


    it('should show My Recipes Page', function() {
      assert.ok(this.browser.success);
      assert.equal(this.browser.text('.your-recipes-page h2'), 'My Recipes');
    });

    // it('should have email input and password input with a method of post for login form', function() {
    //   this.browser.assert.element('#user-email');
    //   this.browser.assert.element('#password');
    //   this.browser.assert.attribute('form', 'method', 'post');
    // });
    //
    // it('should show fail message for incorrect username', function(done) {
    //   this.browser.fill('#user-email', 'notauser@mail.com');
    //   this.browser.fill('#password', 'incorrectpassword');
    //   this.browser.pressButton('button').then(() => {
    //     assert.ok(this.browser.success);
    //     assert.equal(this.browser.text('section.flash-alert'), 'No user found.');
    //   }).then(done, done);
    // });
    //
    // it('should show fail message for incorrect password', function(done) {
    //   this.browser.fill('#user-email', 'testuser@aeropressme.com');
    //   this.browser.fill('#password', 'incorrectpassword');
    //   this.browser.pressButton('button').then(() => {
    //     assert.ok(this.browser.success);
    //     assert.equal(this.browser.text('section.flash-alert'), 'Oops! Password is incorrect.');
    //   }).then(done, done);
    // });
  })


});
