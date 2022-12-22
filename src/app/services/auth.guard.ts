import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {AuthService} from "./auth.service";


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot
    ):
| boolean
| UrlTree
| Promise<boolean | UrlTree>
| Observable<boolean | UrlTree> {
    return this.authenticationService.userSubject.pipe(
    take(1),
    map(customer => {
    const expectedRole = route.data.expectedRole;
    const isAuth = !!customer;
    if (!isAuth  || !expectedRole.includes(customer.accessRole)) {
    return this.router.createUrlTree(['/']);
}
return true;
})
);
}
}