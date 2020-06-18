import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { IUser } from '../shared/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    // configUrl = 'https://mrtnpie.serveo.net/user'; //RASPBERRY PI 
    configUrl = 'http://localhost:3001/user';

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  erServerOppe: boolean;

  constructor(private http: HttpClient, public router: Router) {

  }

  reset(email: string) {
    const emailObject = {
      email
    };
    return this.http.post<any>(`${this.configUrl}/forgot`, emailObject);
  }

  register(user: IUser) {
    return this.http.post<any>(`${this.configUrl}/signup`, user);
  }

  login(user: IUser) {
    return this.http.post<any>(`${this.configUrl}/login`, user);
  }

  updatePassword(token, password) {
    const passwordObject = {
      password
    };
    return this.http.post<any>(`${this.configUrl}/forgot/${token}`, passwordObject);
  }

  getAccessToken() {
    const token = localStorage.getItem('authorization');
    return token;
  }

  isLoggedIn(): boolean {
    const authToken = this.getAccessToken();
    return (authToken !== null) ? true : false;
  }

  logout() {
    if (localStorage.removeItem('authorization') === null) {
      this.router.navigate(['/login']);
    }
  }
  isTokenValid() {
    const token = this.getAccessToken();
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    // tslint:disable-next-line: new-parens
    const now = Math.floor((new Date).getTime()) / 1000;

    if (now >= expiry) {
      this.logout();
      return false;
    }
    return true;
  }

  public isAuthenticated(): boolean {
    const userData = localStorage.getItem('userInfo');
    if (userData && JSON.parse(userData)){
      return true;
    }
    return false;
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = `Client Error: ${error.error.message}`;
    } else {
      msg = `Server Error code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
