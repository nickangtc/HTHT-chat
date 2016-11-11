'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'connections',
      'chatroomID',
      {
        type: Sequelize.STRING
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'connections',
      'chatroomID',
      {
        type: Sequelize.INTEGER
      }
    )
  }
};
