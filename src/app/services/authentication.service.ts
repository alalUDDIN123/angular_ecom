import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { login, signUp } from 'src/data.type';
import { BehaviorSubject,Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isSellerLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private navigate: Router
  ) { }

  // baseUrl="http://localhost:3000/registeredUsers"
  baseUrl="https://calm-blue-hippo-veil.cyclic.app/registeredUsers"

  checkEmailExists(email: string): Observable<boolean> {
    const url = `${this.baseUrl}?email=${email}`;
    // Make a request to the JSON server to check if the email exists
    return this.http.get<any[]>(url).pipe(
      map((users: any[]) => users.length > 0)
    );
  }

  // post request for register
  userSignup(data: signUp) {
    // console.log("user sign up getting called from service file");
    return this.http.post(this.baseUrl, data)

  }

  //get request for login

  loginUser(data: login) {
    return this.http.get(`${this.baseUrl}?email=${data.email}&password=${data.password}`)

  }

  reloadSeller() {
    if (localStorage.getItem('sellerLoggedIn')) {
      this.isSellerLoggedIn.next(true)
      this.navigate.navigate(['seller-home'])
    }
  }



  // not allowed to visit login or auth url when already logged in

  notAllowedAuth() {
    if (localStorage.getItem("userLoggedIn") || localStorage.getItem("sellerLoggedIn")) {
      this.navigate.navigate(['/'])
    }
  }
}
