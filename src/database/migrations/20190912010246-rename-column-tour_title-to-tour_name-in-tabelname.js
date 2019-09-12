"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn("users", "nome", "name");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn("users", "nome", "name");
  }
};
