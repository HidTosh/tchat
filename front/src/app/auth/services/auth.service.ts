import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { AuthSuccess } from '../interfaces/authSuccess.interface';
import { User } from "../../interfaces/user.interface";
import { RoleUser } from "../../interfaces/roleUser.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private pathService: string = 'api/auth';

  constructor(private httpClient: HttpClient) { }

  public register(registerRequest: RegisterRequest): Observable<AuthSuccess> {
    return this.httpClient.post<AuthSuccess>(`${this.pathService}/register`, registerRequest);
  }

  public login(loginRequest: LoginRequest): Observable<AuthSuccess> {
    return this.httpClient.post<AuthSuccess>(`${this.pathService}/login`, loginRequest);
  }

  public me(): Observable<User> {
    return this.httpClient.get<User>(`${this.pathService}/me`);
  }

  public userInfos(): Observable<RoleUser> {
    return this.httpClient.get<RoleUser>(`${this.pathService}/role-user`);
  }

}
