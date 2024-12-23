import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent {
  thumbnail: File | null = null;
  thumbnailUrl: string | null = null; // Store the object URL for the image
  images: File[] = [];
  imagesPreviews: string[] = [];
  thumbnailTouched = false;
  imagesTouched = false;

  constructor(private apiService: ApiService) {}

  onFileSelect(event: any, type: string): void {
    if (type === 'thumbnail') {
      this.thumbnail = event.target.files[0]; // Single file for thumbnail
      this.thumbnailTouched = true;

      this.thumbnail != null ? this.thumbnailUrl = URL.createObjectURL(this.thumbnail): null;
      console.log(this.thumbnailUrl);
    } else if (type === 'images') {
      this.images = Array.from(event.target.files); // Multiple files for images
      this.imagesTouched = true;

      this.imagesPreviews = this.images.map((image) => URL.createObjectURL(image));
    }
  }

  handleSubmit(productData: NgForm) {
    const formData = new FormData();

    // Append text fields
    formData.append('name', productData.value.name);
    formData.append('price', productData.value.price);
    formData.append('sku', productData.value.sku);

    // Append file fields
    if (this.thumbnail) {
      formData.append('thumbnail', this.thumbnail);
    }

    if (this.images.length > 0) {
      for (const image of this.images) {
        formData.append('images', image);
      }
    }

    this.apiService.createProduct(formData).subscribe({
      next: (result) => {
        console.log(result);
        alert('Product created successfully');
      },
      error: (error) => {},
    });
  }

  handleDeleteThumbnail() {
    this.thumbnail = null;
    this.thumbnailUrl = null;
    this.thumbnailTouched = true;

    console.log(this.thumbnail, this.thumbnailUrl, this.images, this.imagesPreviews);
  }

  handleDeleteImages(index:number){
    console.log(index);
    this.images.splice(index, 1);
    this.imagesPreviews.splice(index, 1);

    if(this.images.length === 0){
      this.imagesTouched = false;
      this.images = [];
      this.imagesPreviews = [];
    }
  }

}
