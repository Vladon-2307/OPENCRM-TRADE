import {IResponse} from "./response";

export interface IAuthData {
  login: string,
  password: string
}

export interface IAuthResponse{
  token: string
}


