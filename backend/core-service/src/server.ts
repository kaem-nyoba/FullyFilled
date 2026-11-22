import { App } from "./interfaces/http/app";
import { config } from "./config";

const app = App();
const server = app.listen(config.port, () => {
  console.log(`core-service berjalan di port ${config.port}`);
});

function stop() {
  server.close(() => process.exit(0));
}
process.on("SIGTERM", stop);
process.on("SIGINT", stop);