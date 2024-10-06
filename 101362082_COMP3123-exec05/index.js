const express = require('express');
const fs = require('fs'); //fs module
const path = require('path'); //path module
const app = express();
const router = express.Router();


/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
// Route to serve home.html
router.get('/home', (req, res) => {
    //res.send('This is home router');
    res.sendFile(path.join(__dirname, 'home.html'));
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res) => {
    //res.send('This is profile router');
    fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read user data' });
        }
        res.json(JSON.parse(data)); //send data
    });
});


/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
app.use(express.json());
router.post('/login', (req, res) => {
  //res.send('This is login router');
  const { username, password } = req.body;

  // Read user data from user.json
  fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to read user data' });
      }

      const userData = JSON.parse(data);

      // If username is invalid then send response as below 
      if (username !== userData.username) {
          return res.json({
              status: false,
              message: "User Name is invalid"
          });
      }

      // If password is invalid then send response as below 
      if (password !== userData.password) {
          return res.json({
              status: false,
              message: "Password is invalid"
          });
      }

      // If username and  password is valid then send resonse as below 
      return res.json({
          status: true,
          message: "User Is valid"
      });
  });
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout', (req,res) => {
  //res.send('This is logout router');
  const username = req.query.username; //to get username from query parameter
  if (!username){
    return res.status(400).send('Username is required!');
  }
  else{
    res.send(`<b>${username} successfully logout.<b>`);
  }
});


/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err,req,res,next) => {
  //res.send('This is error router');
  console.error(err);
  res.status(500).send('Server Error');
});
//test the error
app.get('/error', (req, res) => {
  throw new Error('This is a test error message');
})

// Use the router
app.use('/', router);

app.listen(process.env.port || 8081);

console.log('Web Server is listening at port '+ (process.env.port || 8081));