import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent {
  @Input() product?: any;
  @Output() deleteProduct = new EventEmitter<number>();

  constructor(private apiService: ApiService) {} 
  
  

  handleDelete(id:number) {
    this.deleteProduct.emit(id); 
  }
}
