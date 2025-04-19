export interface IUser {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    age: number;
    createdAt: Date;
    updatedAt: Date;
  };
  authToken: string;
  refreshToken: string;
}
