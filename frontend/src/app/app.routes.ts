import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CreateProductComponent } from './components/create-product/create-product.component';

export const routes: Routes = [
    {path: '',redirectTo: '/products',  pathMatch: 'full'},
    {path: 'products', component: ProductsComponent,  pathMatch: 'full'},
    {path: 'product/create', component: CreateProductComponent, pathMatch: 'full'},
    {path: 'product/:id', component: ProductDetailsComponent,  pathMatch: 'full'},
    {path: '**',redirectTo: '/products',  pathMatch: 'full'}
];
