const net = require("net");

const host = "mailout.hostnet.nl";
const port = 587;

const socket = net.connect(port, host, () => {
  console.log(`✅ Conectado a ${host}:${port}`);
  socket.end();
});

socket.on("error", (err) => {
  console.error("❌ Error al conectar:", err.message);
});
