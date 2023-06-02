import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser'
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CartServiceService } from '../services/cart-service.service';
import { cartType, products } from 'src/data.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private authService: AuthenticationService,
    private navigate: Router,
    private cartService: CartServiceService,
    private titleService: Title
  ) { }
  loginFailed: String = "";
  isLoading: boolean = false
  @ViewChild('loginForm') loginFormRef?: NgForm;

  ngOnInit(): void {
    this.titleService.setTitle("E-Comm | Login")
    this.authService.notAllowedAuth();

  }

  // login form handle
  loginFormhandle(loginData: NgForm): void {
    this.isLoading = true;
    this.authService.loginUser(loginData.value)
      .subscribe(
        (result: any) => {
          this.loginFormRef?.resetForm();
          if (result.loggedUser && result.loggedUser.role_type === "seller") {
            alert("Login Successful");
            localStorage.setItem("sellerLoggedIn", JSON.stringify(result.loggedUser.name));
            this.navigate.navigate(['seller-home']);
          } else if (result.loggedUser && result.loggedUser.role_type === "user") {
            alert("Login Successful");
            const user = {
              name: result.loggedUser.name,
              id: result.loggedUser._id
            };
            localStorage.setItem("userLoggedIn", JSON.stringify(user));
            this.localCartToRemoteCart();
            this.navigate.navigate(['']);
          } else {
            this.loginFailed = "Credentials not found";
            setTimeout(() => {
              this.loginFailed = "";
            }, 2000);
          }
        },
        (error: any) => {
          if (error.status === 400 && error.error.message === "Password does not match with used email") {

            alert('Password does not match with used email.');
            this.loginFormRef?.resetForm();
            this.isLoading = false;
          } else if (error.status === 404 && error.error.message === `This email : ${loginData.value.email} is not found in our database`) {
            alert(error.error.message);
            this.loginFormRef?.resetForm();
            this.isLoading = false;
          }
          else {
            alert('Error occurred while fetching credentials');
          }
        },
        () => {
          this.isLoading = false;
        }
      );
  }


  redirectToSignup() {
    this.navigate.navigate(['auth'])
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
          productId: product._id,
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
