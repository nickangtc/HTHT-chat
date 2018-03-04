const db = require('../models');

function getActiveConnections(roomId, done) {
  db.connections.findAll({
    where: { chatroomID: roomId },
  }).then((connections) => {
    const activeConnections = connections.map(conn => conn.dataValues);
    done(activeConnections);
  });
}

module.exports = {
  getActiveConnections,
};
