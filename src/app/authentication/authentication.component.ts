import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser'
import { AuthenticationService } from '../services/authentication.service';
import { NgForm } from '@angular/forms';
import { cartType, products } from 'src/data.type';
import { CartServiceService } from '../services/cart-service.service';
import { signUp } from 'src/data.type';

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
    const userSignupData: signUp = {
      name: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password,
      role_type: 'user'
    };
    this.isLoading = true;

    this.authService.userSignup(userSignupData)
      .subscribe(
        (result: any) => {
          // console.log("Response from backend:", result);

          if (result.msg === "User already exist, please login") {
            alert(result.msg);
          } else if (result.users?.role_type === "seller") {

            alert('Registration successful!');

            localStorage.setItem("sellerLoggedIn", JSON.stringify(result.users?.name));
            this.navigate.navigate(['/']);
          }
          else if (result.users?.role_type == "user") {
            alert('Registration successful!');
            const user = {
              name: result.users.name,
              id: result.users._id
            };
            localStorage.setItem("userLoggedIn", JSON.stringify(user));
            this.navigate.navigate(['/']);
          }
          else {
            alert('Registration failed.');
          }
        },
        (error) => {
          // console.log("Error during registration:", error);

          if (error.status === 400 && error.error.msg === "User already exist, please login") {
            alert('Email already exists. Please choose a different email.');
          } else {
            alert('Error occurred during registration');
          }
        }
      )
      .add(() => {
        this.isLoading = false;
        this.registerForm?.reset();
      });
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
