let express = require('express');
let app = express();
app.set('view engine', 'ejs');
path = require('path');
var async = require('async');
app.use('/public', express.static(__dirname + '/public'));
var Observable = require('rxjs');
var dynamo = require('./dynamo.js');
var temp = new dynamo('Temperatura');
var luz = new dynamo('Luz');
var humedad = new dynamo('Humedad');


const cookieParser = require('cookie-parser');
app.use(cookieParser());
const crypto = require('crypto');


const generateAuthToken = () => {
  return crypto.randomBytes(30).toString('hex');
}

const authTokens = {};

app.use((req, res, next) => {
  // Get auth token from the cookies
  const authToken = req.cookies['AuthToken'];

  // Inject the user to the request
  req.user = authTokens[authToken];

  next();
});


app.get('/home', function (req, res) {

  if (req.user) {
    res.sendFile(__dirname + '/public/views/index.html');
  } else {
    res.redirect("/login");

  }

});

global.fetch = require("node-fetch");
const bodyp = require("body-parser");
app.use(bodyp.json());
app.use(bodyp.urlencoded({ extended: true }));
const cognito = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: "us-east-1_QU7S1Wfkx",
  ClientId: "jfnrtab2a6tkqkupr0bvl47rb"
};
const userPool = new cognito.CognitoUserPool(poolData);

humedad.init(function () { })
temp.init(function () { })
luz.init(function () { })


app.get('/signup', function (req, res) {
  res.sendFile(__dirname + '/public/views/signup.html');
});

app.get('/logout', function (req, res) {
  res.clearCookie("AuthToken");
  res.redirect('/login');
});

app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/public/views/login.html');
});

app.post('/registrar', function (req, res) {
  if (req.user) {
    res.redirect('/home');
  } else {
    res.redirect("/login");

  }
});


app.post('/signup', function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const emailData = {
    Name: "email",
    Value: email
  };
  const emailAttr = new cognito.CognitoUserAttribute(emailData);
  userPool.signUp(email, password, [emailAttr], null, (err, data) => {
    if (err) {
      console.log(err);
      return res.redirect("/signup");
    }
    const user = true;
    const authToken = generateAuthToken();

    // Store authentication token
    authTokens[authToken] = user;

    // Setting the auth token in cookies
    res.cookie('AuthToken', authToken);
    return res.redirect("/registro");

  });
});

app.post('/login', function (req, res) {
  const loginDetails = {
    Username: req.body.email,
    Password: req.body.password
  };
  const autenthicationDetails = new cognito.AuthenticationDetails(loginDetails);
  const userDetails = {
    Username: req.body.email,
    Pool: userPool
  };
  const cognitoUser = new cognito.CognitoUser(userDetails);
  cognitoUser.authenticateUser(autenthicationDetails, {
    onSuccess: data => {
      const user = true;
      const authToken = generateAuthToken();

      // Store authentication token
      authTokens[authToken] = user;

      // Setting the auth token in cookies
      res.cookie('AuthToken', authToken);
      return res.redirect("/home");
    },
    onFailure: err => {
      console.log(err);
      return res.redirect("/login");
    }
  });
});

app.get('/a', function (req, res) {
  var imageurls = [];

  var processData = function (callback) {
    temp.get(function (err, data) {
      imageurls = data;
      callback(undefined, imageurls);

    });
  };

  processData(function (err, queryresults) {
    res.json(queryresults);
  });

});
app.get('/b', function (req, res) {
  var imageurls = [];

  var processData2 = function (callback) {
    luz.getL(function (err, data) {
      // imageurls = data;
      imageurls = data;
      callback(undefined, imageurls);

    });
  };

  processData2(function (err, queryresults) {
    res.json(queryresults);
  });

});
app.get('/c', function (req, res) {
  var imageurls = [];

  var processData3 = function (callback) {
    luz.getH(function (err, data) {
      // imageurls = data;
      imageurls = data;
      callback(undefined, imageurls);

    });
  };

  processData3(function (err, queryresults) {
    res.json(queryresults);
  });

});
app.get('/registro', function (req, res) {
  if (req.user) {
    res.sendFile(__dirname + '/public/views/registro.html');
  } else {
    res.redirect("/login");

  }

});
app.listen(80);


