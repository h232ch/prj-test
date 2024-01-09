import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject, throwError} from "rxjs";
import {User} from "./user.model";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {catchError, take, tap} from "rxjs/operators";
import {AuthComponent} from "./auth.component";
import {Board} from "../board/board-models/board.model";


@Injectable()
export class AuthService {
  user = new BehaviorSubject(null);
  error: Subject<string> = new Subject<string>();
  isLoading: Subject<boolean> = new Subject<boolean>();

  registerUrl = "http://54.180.86.155:8000/api/register/";
  // registerUrl = "http://localhost:8000/api/register/";
  loginUrl = "http://54.180.86.155:8000/api/token/";
  // loginUrl = "http://localhost:8000/api/token/";

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
  }

  login(user: User) {
    this.isLoading.next(true);
    return this.httpClient.post<User>(this.loginUrl, user)
      .pipe(catchError(this.handlerError))
      .subscribe(res => {
          this.handleAuthentication(
            res.email,
            res.id,
            res.access,
            res.refresh);
          this.isLoading.next(false);
        }, errorMessage => {
          this.isLoading.next(false);
          this.error.next(errorMessage.detail);
        }
      )
  }

  join(user: User) {
    this.isLoading.next(true);
    return this.httpClient.post<User>(this.registerUrl, user)
      .pipe(catchError(this.handlerError))
      .subscribe(res => {
        this.login(user);
        this.isLoading.next(false);
      }, errorMessage => {
        this.isLoading.next(false);
        this.error.next(errorMessage.detail);

      })
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/']);
  }

  private handlerError(errorRes: HttpErrorResponse) {
    let errorMessage = errorRes.error;
    if (!errorRes.error) {
      return throwError(errorMessage);
    }
    return throwError(errorMessage);
  }

  private handleAuthentication(email: string, id: string, access: string, refresh: string) {
    const user = {
      id: id,
      email: email,
      access: access,
      refresh: refresh,
    }
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    this.router.navigate(['/']);
  }

  autoLogin() {
    const userData: User = JSON.parse(localStorage.getItem('userData'))
    if (!userData) {
      return;
    }

    const loadedUser: User = {
      id: userData.id,
      email: userData.email,
      access: userData.access,
      refresh: userData.refresh,
    }

    if (loadedUser.access) {
      this.user.next(loadedUser);
    }
  }
}
