import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CATEGORIES } from '../../constants/categories';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent {
  categories = CATEGORIES;

  constructor(private router: Router) {}

  goToCategory(slug: string) {
    this.router.navigate([`/dashboard/category/${slug}`]);
  }
}
