export interface IUserRol {
  id?: number;
  userName?: string;
  userLogin?: string;
  accountNumber?: string;
  grabar?: string;
  rolAssigned?: string;
  userStatus?: string;
}

export type UserRolResponse = Array<IUserRol>;
