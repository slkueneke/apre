/**
 * Author: Shannon Kueneke
 * Date: 6/22/2026
 * File: feedback-by-product.component.ts
 * Description: Week 4 Major Change M-108: Create an API to fetch customer feedback data by product and build an Angular component to display customer feedback by product using ChartComponent or TableComponent with 3 unit tests each.
 *
 */

// Import Angular core lifecycle hooks and change detection ref
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
// Import HttpClient for making API calls to the backend
import { HttpClient } from '@angular/common/http';
// Import the shared ChartComponent to render the bar chart
import { ChartComponent } from '../../../shared/chart/chart.component';
// Import environment config to resolve the API base URL at runtime
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-feedback-by-product',
  standalone: true,
  // ChartComponent is required for rendering the bar chart
  imports: [ChartComponent],
  template: `
    <h1>Customer Feedback by Product</h1>
    <div class="product-container">
      <!-- Only render the chart once both label and data arrays have been populated -->
      @if (products.length && ratingAvg.length) {
        <div class="card chart-card">
          <!-- Bar chart showing the average customer feedback rating (y axis/labels) for each product (x axis/data) -->
          <app-chart
            [type]="'bar'"
            [label]="'Average Rating by Product'"
            [data]="ratingAvg"
            [labels]="products">
          </app-chart>
        </div>
      }

      <!-- Show a message while data is loading or when no records are returned so user knows the system is working and not frozen -->
      @if (!products.length && !errorMessage) {
        <div class="message">Loading product feedback data...</div>
      }

      <!-- If no data or an error has ocurred, display any error or no-data message for context and so it does not just display a blank report -->
      @if (errorMessage) {
        <div class="message message--error">{{ errorMessage }}</div>
      }
    </div>
  `,
  styles: [`
    /* Center the chart vertically in the page to align with styling of other charts */
    .product-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Limit the chart card to half the viewport width for readability and to align with styling of other charts */
    .chart-card {
      width: 50%;
      margin: 20px 0;
    }

    /* General message styling used for both loading and error states */
    .message {
      margin-top: 20px;
    }
  `]
})
export class FeedbackByProductComponent implements AfterViewInit {
  // Holds the product names used as x-axis labels on the chart
  products: string[] = [];

  // Holds the average ratings that map to each product label
  ratingAvg: number[] = [];

  // Holds a validation or no-data message shown in the template
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    // Fetch all product ratings on construction so the chart is ready without user interaction
    this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/rating-by-product`).subscribe({
      next: (data: any) => {
        // Handle the case where the API returns no product records and surface error message in the template so user knows no prod feeback data was found and doesn't think the report is just broken
        if (!data || data.length === 0) {
          this.errorMessage = 'No product feedback data found.';
          return;
        }

        // Map the response objects into separate arrays that ChartComponent's [data] and [labels] inputs expect (products for x axis, avg rating for y axis)
        this.products = data.map((item: any) => item.product);
        this.ratingAvg = data.map((item: any) => item.ratingAvg);

        // Manually trigger change detection so the chart renders with the newly assigned data
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Log the raw error and surface a user-friendly message in the template for when report errors out
        console.error('Error fetching customer feedback by product:', err);
        this.errorMessage = 'An error occurred while fetching product feedback data.';
      }
    });
  }

  // AfterViewInit is implemented to satisfy the interface contract;
  // no additional view setup is required beyond what the constructor starts
  ngAfterViewInit(): void {}
}
