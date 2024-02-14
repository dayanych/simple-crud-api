import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { RequestMethod } from '../common/enums/method.enum';
import { getEndpoint } from '../common/helpers/get-endpoint';
import { ContentType } from '../common/enums/content-type.enum';
import { validateUser } from '../common/helpers/validate-user';
import { Users } from './users';

export class HandlerRequest {
  req: IncomingMessage;
  res: ServerResponse;
  usersRepository: Users;

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    usersRepository: Users
  ) {
    this.req = req;
    this.res = res;
    this.usersRepository = usersRepository;
  };

  handleRequest() {
    const { path, id } = getEndpoint(this.req.url);
    const method = this.req.method;

    if (path !== 'users') {
      this.sendResponse(404, ContentType.Text, 'Invalid path.');
      return;
    }
  
    switch (method) {
      case RequestMethod.Get:
        this.handleGet(id);
        break;
      case RequestMethod.Post:
        this.addUser();
        break;
      case RequestMethod.Put:
        this.updateUser(id);
        break;
      case RequestMethod.Delete:
        this.deleteUser(id);
        break;
      default:
        this.sendResponse(405, ContentType.Text, 'Invalid Method.');
        break;
    }
  };

  handleGet (id: string | undefined) {
    if (id) {
      this.getUserById(id);
    } else {
      this.getAllUsers();
    };
  };

  getAllUsers() {
    const users = this.usersRepository.getUsers();
    this.sendResponse(200, ContentType.Json, users);
  };

  getUserById(id: string) {
    if (!uuidValidate(id)) {
      this.sendResponse(400, ContentType.Text, 'User id must be uuid.');
      return;
    };

    const user = this.usersRepository.getUserById(id);

    if (user) {
      this.sendResponse(200, ContentType.Json, user);
    } else {
      this.sendResponse(404, ContentType.Text, 'User not found.');
    };
  };

  addUser() {
    let requestBody = '';

    this.req.on('data', (chunk) => {
      requestBody += chunk;
    });

    this.req.on('end', () => {
      const user = JSON.parse(requestBody);
      if (!validateUser(user)) {
        this.sendResponse(400, ContentType.Text, 'Invalid user data.');
        return;
      };

      const newUser = this.usersRepository.addUser(user);
      this.sendResponse(201, ContentType.Json, newUser);
    });
  };

  updateUser(id: string | undefined) {
    if (!id || !uuidValidate(id)) {
      this.sendResponse(400, ContentType.Text, 'User id must be uuid.');
      return;
    };

    const user = this.usersRepository.getUserById(id);
    if (!user) {
      this.sendResponse(404, ContentType.Text, 'User not found.');
      return;
    };

    let requestBody = '';

    this.req.on('data', (chunk) => {
      requestBody += chunk;
    });

    this.req.on('end', () => {
      const changes = JSON.parse(requestBody);

      if (!validateUser(changes)) {
        this.sendResponse(400, ContentType.Text, 'Invalid user data.');
        return;
      };

      this.usersRepository.updateUser(id, changes);

      const updatedUser = this.usersRepository.getUserById(id);
      this.sendResponse(200, ContentType.Json, updatedUser);
    });
  };

  deleteUser(id: string | undefined) {
    if (!id ||!uuidValidate(id)) {
      this.sendResponse(400, ContentType.Text, 'User id must be uuid.');
      return;
    }

    const user = this.usersRepository.getUserById(id);
    if (!user) {
      this.sendResponse(404, ContentType.Text, 'User not found.');
      return;
    };

    this.usersRepository.deleteUser(id);
    this.sendResponse(204, ContentType.Text, '');
  };

  sendResponse(statusCode: number, contentType: ContentType, body: any) {
    this.res.writeHead(statusCode, { 'Content-Type': contentType });
    this.res.end(JSON.stringify(body));
  };
};
