import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { RequestMethod } from '../common/enums/method.enum';
import { getEndpoint } from '../common/helpers/get-endpoint';
import { Users } from './users';
import { ContentType } from '../common/enums/content-type.enum';

export class HandlerRequest {
  usersRepository: Users;

  constructor(private req: IncomingMessage, private res: ServerResponse) {
    this.req = req;
    this.res = res;
    this.usersRepository = new Users();
  };

  handleRequest() {
    const { path, id } = getEndpoint(this.req.url);
    const method = this.req.method;

    if (path !== 'users') {
      this.sendResponse(404, ContentType.Text, 'Path not allowed.');
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
        break;
      case RequestMethod.Delete:
        break;
      default:
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

      console.log(user);
    });
  
  
    console.log(requestBody);
  };

  sendResponse(statusCode: number, contentType: ContentType, body: any) {
    this.res.writeHead(statusCode, { 'Content-Type': contentType });
    this.res.end(JSON.stringify(body));
  };
};
