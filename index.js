const express = require("express");
const bodyParser = require("body-parser");
// const cors = require("cors");
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "database-1.ccygem20qzjo.us-east-2.rds.amazonaws.com",
  database: "universitydb",
  password: "postgres",
  port: 5432
});

const app = express();

// app.use(cors());
app.use(bodyParser.json());

// Register staff member
app.post("/api/v1/createStuff", (req, res) => {
  const { StaffNo, StuffName, Region } = req.body;
  pool.query(
    "INSERT INTO stafftbl (staffno, staffname, region) VALUES ($1, $2, $3)",
    [StaffNo, StuffName, Region],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.sendStatus(201);
    }
  );
});

// Register student
app.post("/api/v1/createStudent", (req, res) => {
  const { studentid, stdname, registered, region, staffno } = req.body;
  pool.query(
    "INSERT INTO studentstbl (studentid, stdname, registered, region, staffno) VALUES ($1, $2, $3, $4, $5)",
    [studentid, stdname, registered, region, staffno],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.sendStatus(201);
    }
  );
});

// Get all students
app.get("/api/v1/students", (req, res) => {
  pool.query(
    "SELECT * FROM studentstbl",
    [],
    (error, results) => {
      if (error) {
        throw error;
      }

      res.status(200).json(results.rows);
    }
  );
});

// Get all staff
app.get("/api/v1/staff", (req, res) => {
  pool.query(
    "SELECT * FROM stafftbl",
    [],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
});

app.get("/api/v1/issues/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT id, label, status, priority FROM issues WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }

      res.status(200).json(results.rows);
    }
  );
});

app.put("/api/v1/issues/:id", (req, res) => {
  const { id } = req.params;
  const { label, status, priority } = req.body;

  pool.query(
    "UPDATE issues SET label = $1, status = $2, priority = $3 WHERE id = $4",
    [label, status, priority, id],
    (error, results) => {
      if (error) {
        throw error;
      }

      res.sendStatus(200);
    }
  );
});

app.delete("/api/v1/issues/:id", (req, res) => {
  const { id } = req.params;

  pool.query("DELETE FROM issues WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }

    res.sendStatus(200);
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`app started on port ${PORT}`)
});