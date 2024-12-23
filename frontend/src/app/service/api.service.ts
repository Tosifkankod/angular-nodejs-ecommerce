import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  getProducts():Observable<any>{
    return this.http.get(`${this.apiUrl}/products`); 
  }

  createProduct(payload:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/products`, payload);
  }

  deleteProduct(payload:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/products/${payload}`);
  }

  getProductById(payload:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/products/${payload}`);
  }
}
