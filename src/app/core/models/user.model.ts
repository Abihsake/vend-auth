export interface IUserData {
  user: IUser;
  tenant: ITenant;
  accessToken: string;
  userType: string;
}

export interface ISignInResponse {
  requestToken: string;
}

export interface ITenant {
  id: string;
  createdAt: string;
  imgUrl: string;
  name: string;
  email: string;
  isHeadquarters: boolean;
  address: string;
  isOnboarded: boolean;
  updatedAt: string;
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  imgUrl: string;
  status: boolean;
  roles: IRole[];
  createdAt: string;
  updatedAt: string;
  passCode?: unknown;
}

interface IRole {
  id: string;
  createdAt: string;
  description: string;
  appDomain?: string;
  name: string;
  updatedAt: string;
  permissions: unknown[];
}
