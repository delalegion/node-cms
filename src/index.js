const app = require('./app.js');
const { port } = require('./config');
// const { Server } = require("socket.io");

const server = app.listen(port, () => {
    console.log(`Server urchomiony na porcie: ${port}`);
});

// const io = new Server(server);

// io.on("connection", (socket) => {
//     socket.on("hello", (arg) => {
//       console.log(arg); // world
//     });
// });

