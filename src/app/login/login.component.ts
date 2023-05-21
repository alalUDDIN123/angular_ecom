import { Component } from '@angular/core';
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
    private cartService:CartServiceService
  ) { }
  loginFailed: String = "";

  ngOnInit(): void {
    this.authService.notAllowedAuth()
  }

  loginFormhandle(loginData: NgForm): void {
    //  console.log("login data:",loginData.value);
    this.authService.loginUser(loginData.value)
      .subscribe(
        (result: any) => {
          if (result[0] && result[0].role_type === "seller") {
            alert("Login Successful")
            localStorage.setItem("sellerLoggedIn", JSON.stringify(result[0].name))
            this.navigate.navigate(['seller-home'])

          } else if (result[0] && result[0].role_type === "user") {
            alert("Login Successful")

            // for saving only name and id
            const user = {
              name: result[0].name,
              id: result[0].id
            };
            localStorage.setItem("userLoggedIn", JSON.stringify(user));
            this.localCartToRemoteCart()
            this.navigate.navigate([''])

          }
          else if (result.length === 0) {
            this.loginFailed = "Credentials not found"
          } else {
            this.loginFailed = "Something went wrong"
          }
        },
        (error: any) => {
          this.loginFailed = "Network or server error"
          // console.error(error)
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
