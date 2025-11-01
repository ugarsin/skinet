import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { inject } from '@angular/core';
import { map, of, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  console.log('AuthGuard triggered. currentUser =', accountService.currentUser());

  // if (accountService.currentUser()) {
  //   return of(true);
  // } else {
  //   return accountService.getAuthState().pipe(
  //     map(auth => {
  //       if (auth.isAuthenticated) {
  //         return true;
  //       } else {
  //         router.navigate(["/account/login"], {queryParams: {returnUrl: state.url}});
  //         return false;
  //       }
  //     })
  //   )
  // }

  // Convert the signal to an observable
  return toObservable(accountService.currentUser).pipe(
    take(1), // only take the current value
    map(user => {
      if (user) return true;

      router.navigate(['/account/login']);
      return false;
    })
  );
};
