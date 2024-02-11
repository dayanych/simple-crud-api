import http from 'http';
import { getServerConfig } from './configs/server.config';
import { HandlerRequest } from './modules/handle-request';

const serverConfig = getServerConfig();
const PORT = serverConfig.port;

const server = http.createServer((req, res) => {
  const handler = new HandlerRequest(req, res);
  handler.handleRequest();
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
