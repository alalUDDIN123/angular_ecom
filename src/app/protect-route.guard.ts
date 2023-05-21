
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate,  RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';



@Injectable({
  providedIn: 'root'
})
export class protectRouteGuard implements CanActivate{
  constructor(private sellerService:AuthenticationService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(localStorage.getItem('sellerLoggedIn')){
       return true;
      }
      return this.sellerService.isSellerLoggedIn;
  }
  
} 