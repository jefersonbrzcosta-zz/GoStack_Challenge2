const auth = require("./auth");

module.exports = {
  dialect: "mysql",
  host: "promebackend.mysql.dbaas.com.br",
  username: "promebackend",
  password: "goBarber3052!",
  database: "promebackend",
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};
