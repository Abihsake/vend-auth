export interface IBusiness {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  enabled: boolean;
  logoUrl: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserBusiness {
  id: string;
  imgUrl: string;
  name: string;
}
