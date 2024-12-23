import { Component, OnInit } from '@angular/core';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductItemComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: any = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchCards();
  }


  fetchCards(){
    this.apiService.getProducts().subscribe({
      next: (products) => {
        console.log(products.data);
        this.products = products.data.products;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  handleDeleteProduct(id: number) {
    this.apiService.deleteProduct(id).subscribe({
      next: (response) => {
        alert('Card deleted successfully!');
        this.fetchCards(); // Refresh the list
      },
      error: (error) => {
        console.log(error);
      },
    });

  }




}
