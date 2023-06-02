import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { products } from 'src/data.type';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  // baseUrl = "http://localhost:8080/api/angularProduct"
  baseUrl = "https://prickly-earrings-cow.cyclic.app/api/angularProduct"


  // post product 👍👍👍
  postProduct(data: products) {
    return this.http.post(`${this.baseUrl}/add`, data)
  }

  // get product 👍👍👍

  getProductList() {
    return this.http.get<products[]>(`${this.baseUrl}/get`)
  }


  // get Single product

  getSingleProduct(id: String) {
    // console.log("id",id);

    return this.http.get<products>(`${this.baseUrl}/get/${id}`)
  }

  // updated product

  updateProduct(data: products) {
    const productId = data._id;
    const { _id, ...updatedDataWithoutId } = data;
    return this.http.patch(`${this.baseUrl}/update`, { productId: productId, updatedData: updatedDataWithoutId });
  }


  // delete product seller

  deleteProduct(id: String) {
    const options = {
      body: { productId: id }
    };
    return this.http.delete(`${this.baseUrl}/delete`, options);
  }


  // search products

  searchProducts(query: String) {
    // console.log("${this.baseUrl}?q=${query}", `${this.baseUrl}?q=${query}`);
    return this.http.get<products[]>(`${this.baseUrl}/search/angular?q=${query}`)

  }
}
