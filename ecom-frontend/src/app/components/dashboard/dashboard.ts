import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  isCategoryView = false;
  private routeSub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateViewState(this.router.url);
    this.routeSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const navEnd = event as NavigationEnd;
        this.updateViewState(navEnd.urlAfterRedirects);
      });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  private updateViewState(url: string) {
    this.isCategoryView = url.includes('/home/category/');
  }
}
