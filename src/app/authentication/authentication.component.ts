import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser'
import { AuthenticationService } from '../services/authentication.service';
import { NgForm } from '@angular/forms';
import { cartType, products } from 'src/data.type';
import { CartServiceService } from '../services/cart-service.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  @ViewChild('registerForm') registerForm?: NgForm;
  @ViewChild('loginForm') loginFormRef?: NgForm;



  constructor(
    private authService: AuthenticationService,
    private navigate: Router,
    private cartService: CartServiceService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.authService.notAllowedAuth();
    this.titleService.setTitle("E-Comm | Registration | Authentication")
  }

  showLogin = false;
  loginFailed: String = "";
  isLoading: boolean = false


  // registration form handle

  registerFormhandle(registerForm: NgForm): void {
    const userSignupData = Object.assign({}, registerForm.value, { role_type: 'user' });
    this.isLoading = true;
  
    this.authService.userSignup(userSignupData)
      .subscribe(
        (result) => {
          if (result.hasOwnProperty('email')) {
            // Successful registration
            alert('Registration successful!');
            this.isLoading = false;
            this.registerForm?.reset();
            this.navigate.navigate(['/']);
          } else {
            // Registration failed
            alert('Registration failed.');
          }
        },
        (error) => {
          // Error occurred during registration
          alert('Error occurred during registration');
        }
      );
  }
  

  // login form handle
  loginFormhandle(loginData: NgForm): void {
    this.isLoading = true;
    this.authService.loginUser(loginData.value)
      .subscribe(
        (result: any) => {
          this.loginFormRef?.reset();
          if (result[0] && result[0].role_type === "seller") {
            alert("Login Successful");
            this.isLoading = false;
            localStorage.setItem("sellerLoggedIn", JSON.stringify(result[0].name));
            this.loginFormRef?.reset();
            this.navigate.navigate(['seller-home']);
  
          } else if (result[0] && result[0].role_type === "user") {
            alert("Login Successful");
            this.isLoading = false;
            this.loginFormRef?.reset();
            const user = {
              name: result[0].name,
              id: result[0].id
            };
  
            localStorage.setItem("userLoggedIn", JSON.stringify(user));
            this.localCartToRemoteCart();
            this.navigate.navigate(['']);
  
          } else if (result.length === 0) {
            this.loginFailed = "Credentials not found";
            this.isLoading = false;
            this.loginFormRef?.reset();
  
            // Empty the loginFailed variable after a delay
            setTimeout(() => {
              this.loginFailed = "";
            }, 2000); 
          } else {
            this.loginFailed = "Something went wrong";
            this.isLoading = false;
            this.loginFormRef?.reset();
  
            // Empty the loginFailed variable after a delay
            setTimeout(() => {
              this.loginFailed = "";
            }, 2000); 
          }
        },
        (error: any) => {
          this.loginFailed = "Network or server error";
          this.loginFormRef?.reset();
  
          // Empty the loginFailed variable after a delay
          setTimeout(() => {
            this.loginFailed = "";
          }, 2000); 
        }
      );
  }
  

  openLogin() {
    this.showLogin = true
  }
  openSignUp() {
    this.showLogin = false
  }

  localCartToRemoteCart() {
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('userLoggedIn');
    let userId = user && JSON.parse(user).id;
    if (data) {
      let cartDataList: products[] = JSON.parse(data);

      cartDataList.forEach((product: products, index) => {
        let cartData: cartType = {
          ...product,
          productId: product.id,
          userId
        }
        delete cartData.id;
        setTimeout(() => {
          this.cartService.addToCartService(cartData).subscribe((result) => {
            if (result) {
              console.warn("data is stored in DB");
            }
          })
        }, 500);
        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart')
        }
      })
    }

    // load cart items when user logged in
    setTimeout(() => {
      this.cartService.getCartItems(userId)
    }, 500);

  }

}
