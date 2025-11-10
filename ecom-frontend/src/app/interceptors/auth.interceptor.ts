import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      const isAuthError = err.status === 401;
      const isRefreshRequest = req.url.includes('/refresh-token');

      if (isAuthError && !isRefreshRequest) {
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
          authService.logout();
          return throwError(() => err);
        }

        return authService.refreshAccessToken().pipe(
          switchMap((response: any) => {
            if (!response?.token) {
              authService.logout();
              return throwError(() => err);
            }

            authService.storeSession(
              response.token,
              undefined,
              response.refreshToken
            );

            const retriedRequest = req.clone({
              setHeaders: { Authorization: `Bearer ${response.token}` },
            });

            return next(retriedRequest);
          }),
          catchError(refreshError => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
