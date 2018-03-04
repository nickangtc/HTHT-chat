'use strict';
module.exports = function(sequelize, DataTypes) {
  var chatroom_topic = sequelize.define('chatroom_topic', {
    title: DataTypes.STRING,
    active_users: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return chatroom_topic;
};