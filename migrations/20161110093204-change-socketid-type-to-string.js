'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'connections',
      'socketID',
      {
        type: Sequelize.STRING
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'connections',
      'socketID',
      {
        type: Sequelize.INTEGER
      }
    )
  }
};
