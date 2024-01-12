import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, mergeMap, switchMap, take } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private authService: AuthService) {
    // TokenInterceptor
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    const tokenReq = this.addToken(req);
    console.log(tokenReq)
    return next.handle(tokenReq).pipe(
      catchError((err: any) => {
        if (this.isUnauthorized(err)) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            return this.authService.refreshTokenJlr().pipe(
              mergeMap((data: any) => {
                if (data && data?.status === 200 && data?.json) {
                  this.authService.setTokenJrl(data?.json);
                  this.isRefreshing = false;
                  this.refreshTokenSubject.next(this.authService.getToken());
                  return next.handle(this.addToken(req));
                } else {
                  return next.handle(req);
                }
              }),
              catchError((err: any) => {
                this.isRefreshing = false;
                return next.handle(req);
              })
            );
          } else {
            return this.refreshTokenSubject.pipe(
              filter((token) => token != null),
              take(1),
              switchMap(() => next.handle(this.addToken(req)))
            );
          }
        }

        return throwError(err);
      })
    );
  }

  addToken(req: HttpRequest<any>) {
    return req.clone({
      setHeaders: {
        'Authorization': `Bearer ${localStorage.getItem('tokenJlr')}`,
        expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
        pragma: 'no-cache',
        'Cache-Control': 'no-cache',
      },
    });
  }

  private isUnauthorized(err: any): boolean {
    return (
      err.status === 401 &&
      (err.error === 'HTTP 401 Unauthorized: Token invalid' ||
        err.error instanceof Blob)
    );
  }
}
