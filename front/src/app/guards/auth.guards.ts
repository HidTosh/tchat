import { Injectable } from '@angular/core';
import { CanActivate, Router } from "@angular/router";
import { catchError, map, Observable, throwError } from "rxjs";
import { AuthService } from "../auth/services/auth.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  public canActivate(): Observable<boolean>{
    return this.checkUserAccess();
  }

  checkUserAccess(): Observable<boolean> {
    return this.authService.me().pipe(
      map((data) => {
        if (data.id) {
          return true;
        } else {
          this.router.navigate(['login']);
          return false;
        }
      }),
      catchError(err => {
        if (err.status == 401) {
          this.router.navigate(['login']);
          return throwError(err);
        } else {
          return throwError(err);
        }
      })
    );
  }
}
