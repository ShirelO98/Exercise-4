require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

const createConnection = require("./dbConnection").createConnection;

// Import routes
const { usersRouter } = require("./routers/users-router");
const { preferencesRouter } = require("./routers/preferences-router");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.set("Content-Type", "application/json");
  next();
});

// Routes
app.use("/users", usersRouter);
app.use("/preferences", preferencesRouter);

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    const connection = await createConnection();
    console.log("Connected to the database");
    connection.end();
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
});
