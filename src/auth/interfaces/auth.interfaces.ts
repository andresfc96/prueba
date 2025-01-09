export interface JwtPayload {
  sub: string;
  username: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  statusCode: number;
}
