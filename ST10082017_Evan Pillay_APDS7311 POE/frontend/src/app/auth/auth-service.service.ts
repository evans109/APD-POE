import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private readonly BASE_URL = 'https://localhost:3000';

  constructor(private http: HttpClient) { }

  get isLoggedIn(): boolean {
    const token = localStorage.getItem('x-auth-token');
    return token ? true : false;
  }

  get token() {
    return localStorage.getItem('x-auth-token');
  }

  Login(username: string, password: string) {
    return this.http.post(`${this.BASE_URL}/api/users/login`, { username, password })
  }

  logout(): void {
    localStorage.removeItem('x-auth-token');
  }

  Signup(
    username: string,
    firstname: string,
    lastname: string,
    password: string
  ) {
    return this.http.post(`${this.BASE_URL}/api/users/signup`, { 
      username,
      firstname,
      lastname,
      password
    });
  }

  getToken() {
    return this.token;
  }
}
