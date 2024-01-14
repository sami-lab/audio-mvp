const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  }
);

//here we store all our schemas in variable
//we are doing this beacuse we wanna set relationship between schemas
const db = {};
db.User = require("./user.model")(sequelize, Sequelize);
db.Roles = require("./roles.model")(sequelize, Sequelize);

//aftter defining all schemas finally impplmenting all relationship
//The problem is we must define schemas before setting up association between these models
//so we define schemas now setting up relationships
Object.keys(db).forEach(function (modelName) {
  //In all of our schemas if we have associate method here gonna execute it
  //syntax of sequelize
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  console.log(
    "-------------------------",
    db[modelName],
    "------------------------------"
  );
  //https://sequelize.org/master/manual/model-basics.html#synchronization-in-production
  //db[modelName].sync({ alter: true }); //here we check if there is any change in schemas code then we also run alter commands
});

db.Sequelize = Sequelize;
db.sequelize = sequelize; //Instance of sequelize contain various method  of sequelize like authenticate to connect with database

module.exports = db; //exporting all our models which is in db field
