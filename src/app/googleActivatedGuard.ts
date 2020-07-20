import { select } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Profile } from './models';

@Injectable({
  providedIn: 'root'
})
export class GoogleActivatedGuard implements CanActivate {
    @select(['profile'])
    readonly profile$: Observable<Profile>;

    destroy$ = new Subject<void>();
  constructor(
      private router: Router
  ) { }

  canActivate(): Observable<boolean> {
    console.log('can activate');
   return this.profile$
    .pipe(
       map((profile) => {
           console.log('auth hallooo', profile);
           if (profile.googleAuth === null) {
               return true;
           } else {
                this.router.navigateByUrl('tabs');
                return false;
           }
       })
    );
  }
}
