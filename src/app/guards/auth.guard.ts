import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../components/login/login.service';
import {map, take} from 'rxjs/operators';

export const authGuard = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  return loginService.isAuthenticated().pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        return router.createUrlTree(['/sign-in']);
      }
    })
  );
};
