const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get("/", rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

//Handles POST to the student table to add a new student
//The password is encrypted before being inserted into the database
router.post("/addstudent", (req, res, next) => {
  console.log("this is the new student we are about to register", req.body);

  // pull out the incoming object data
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const school_id = req.body.school_id || 0;
  const grade = req.body.grade;
  const grad_year = req.body.grad_year;
  const school_attend = req.body.school_attend;
  const lcf_id = req.body.lcf_id;
  const lcf_start_date = req.body.lcf_start_date;
  const student_email = req.body.student_email;
  const password = req.body.password;
  const pif_amount = Number(req.body.pif_amount);
  const created_at = req.body.created_at;
  const role = "student";
  admin_id = null;

  //initialize the id you will get from the student
  let student_id = "";

  const queryText = `INSERT INTO "student" 
                (first_name, last_name, school_id, grade, grad_year, school_attend, lcf_id, lcf_start_date, student_email, password, pif_amount, role, created_at)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id `;
  pool
    .query(queryText, [
      first_name,
      last_name,
      school_id,
      grade,
      grad_year,
      school_attend,
      lcf_id,
      lcf_start_date,
      student_email,
      password,
      pif_amount,
      role,
      created_at,
    ])
    .then((result) => {
      console.log("this is the response", result.rows[0].id);
      student_id = result.rows[0].id;
      //now lets add student information to the user table
      const query2Text =
        'INSERT INTO "user" (student_id, admin_id, email, password, role, last_login) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
      pool
        .query(query2Text, [
          student_id,
          admin_id,
          student_email,
          password,
          'student',
          new Date(),
        ])
        .then(() => res.sendStatus(201))
        .catch(function (error) {
          console.log("Sorry, there was an error with your query: ", error);
          res.sendStatus(500); // HTTP SERVER ERROR
        });
    })
    .catch(function (error) {
      console.log("Sorry, there is an error", error);
      res.sendStatus(500);
    });
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post("/register", (req, res, next) => {
  const email = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText =
    'INSERT INTO "user" (email, password) VALUES ($1, $2) RETURNING id';
  pool
    .query(queryText, [email, password])
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(500));
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post("/login", userStrategy.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post("/logout", (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
