import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { products } from 'src/data.type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})


export class SearchComponent implements OnInit {
  paramsQue: String = ""
  productData: undefined | products[]
  noDataFoundMessage: String = ""

  constructor(
    private activeRoute: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      const paramsQuery = params['query'];


      if (paramsQuery !== null && paramsQuery !== undefined) {
        this.paramsQue = paramsQuery;
        this.productService.searchProducts(paramsQuery).subscribe((data: null | products[]) => {

          if (data && data.length > 0) {
            this.productData = data;
            this.noDataFoundMessage = ''
          } else {
            this.noDataFoundMessage = `Data not found with search term`;
            this.productData = []
          }
        });
      }
    });
  }

}

