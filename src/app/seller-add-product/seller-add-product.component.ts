import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { products } from 'src/data.type';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent {

  showSuccesMessage: String = ""

  constructor(
    private productService: ProductService
  ) {

  }

  addProductHandle(data: products) {
    // console.log("data:",data);
    this.productService.postProduct(data).subscribe((result) => {
      console.warn(result);
      if (result) {
        this.showSuccesMessage = 'Product is added successfully';
      }
    });

    setTimeout(() => {
      this.showSuccesMessage = ""
    }, 3000);
  }
}
