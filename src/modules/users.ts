import { v4 as uuidv4 } from 'uuid'; 
import { User } from "../common/types/user";

export class Users {
  private users: User[] = [];
  getUsers() {
    return this.users;
  };

  getUserById(id: string) {
    return this.users.find(user => user.id === id);
  };

  addUser(user: Omit<User, 'id'>) {
    const newUser = {...user, id: uuidv4() };
    this.users.push(newUser);

    return newUser;
  };

  updateUser(id: string, changes: Partial<User>) {
    this.users = this.users.map(user => {
      if (user.id === id) {
        return {...user,...changes };
      }
      return user;
    });
  };

  deleteUser(id: string) {
    this.users = this.users.filter(user => user.id !== id);
  };
};
