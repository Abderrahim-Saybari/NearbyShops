import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  registerUser(user: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.post('http://localhost:3000/users/register', user, { headers });
  }

  authenticateUser(user) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.post('http://localhost:3000/users/authenticate', user, { headers });
  }

  storeUserData(token: any, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
  updateUserData(user){
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
  }

  loggedIn() {
    return this.tokenNotExpired();
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authToken = null;
    this.user = null;
  }

  tokenNotExpired() {
    // get the token from the global variable
    let token: string = this.authToken;
    // in case if the user reload the page he gonna lose the variable content so we check the localStorage of the browser
    if (token == null) {
         token = localStorage.getItem('token');
    }

    return token != null && !this.jwtHelper.isTokenExpired(token);
  }
  getToken() {
    return localStorage.getItem('token');
  }
  getCurrentUser(){
    this.user = JSON.parse(localStorage.getItem('user'));
    return this.user;
  }
}
