const express = require("express");
require("dotenv").config();

//Here we load all of our models
const models = require("./models/");

const { createDefaultRoles } = require("./controllers/userController");
const port = process.env.APP_PORT || 5000;
const app = express();

const cors = require("cors");

var corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
};

//app.use(cors(corsOptions));
app.use(
  cors({
    origin: "*",
  })
);
models.sequelize
  .sync({ force: false })
  .then(async () => {
    console.log("Database and tables synced");

    await createDefaultRoles(["Creator", "Admin"]);
    //await createAdmin();
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
    process.exit(1);
  });
require("./startup/routes")(app);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
