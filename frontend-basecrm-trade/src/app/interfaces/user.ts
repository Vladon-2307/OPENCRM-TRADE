

export interface IUserData {
  id: number,
  login: string,
  role: string
}

export interface IUserEdit {
  login: string,
  password?: string,
  role: string
}
