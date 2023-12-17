import {User} from "./user.interface";

export interface RoleUser {
  authority: string,
  enabled: number,
  user: User
}
