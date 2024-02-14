import { UserType } from "../types/user.type";

export const validateUser = (body: any): body is UserType => {
  if (
    typeof body === 'object' &&
    typeof body?.username === 'string' &&
    typeof body?.age === 'number' &&
    Array.isArray(body?.hobbies) &&
    body?.hobbies.every((hobby: any) => typeof hobby === 'string')
  ) {
    return true;
  } else {
    return false;
  }
};
