import http from 'http';
import { getServerConfig } from './configs/server.config';
import { HandlerRequest } from './modules/handle-request';
import { Users } from './modules/users';

const serverConfig = getServerConfig();
const usersRepository = new Users();

export const server = http.createServer((req, res) => {
  const handler = new HandlerRequest(req, res, usersRepository);
  handler.handleRequest();
});

server.listen(serverConfig.port, () => {
  console.log(`Server running on http://localhost:${serverConfig.port}`);
});
