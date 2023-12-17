import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from '@angular/common/http';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() {}

  public intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token: string | null = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request);
  }
}
