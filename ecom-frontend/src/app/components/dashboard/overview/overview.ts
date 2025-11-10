import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CATEGORIES } from '../../../constants/categories';
import { ProductListComponent } from '../../products/products-list/products-list';

@Component({
  selector: 'app-category-overview',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class CategoryOverviewComponent {
  categories = CATEGORIES;

  constructor(private router: Router) {}

  goToCategory(slug: string) {
    this.router.navigate([`/home/category/${slug}`]);
  }
}
