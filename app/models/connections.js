'use strict';
module.exports = function(sequelize, DataTypes) {
  var connections = sequelize.define('connections', {
    socketID: DataTypes.INTEGER,
    user: DataTypes.STRING,
    chatroomID: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return connections;
};