export type TLoginUser = {
  id: string;
  password: string;
};

export type TJwtPayload = {
  userId: string;
  role: string;
};
