// export function
module.exports = function(io) {
  //Emit socket.io Event
  io.on('connection', socket => {
    socket.on('refresh', data => {
      // this event is received by all client connected.
      //we will use it to refresh post component after posting something.
      io.emit('refreshPage', {});
    });
  });
};
