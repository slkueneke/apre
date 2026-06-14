// Import necessary Angular core and HTTP modules
import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../environments/environment';
// Import the shared chart component for rendering the bar chart
import { ChartComponent } from '../../../shared/chart/chart.component';

@Component({
  selector: 'app-sales-by-salesperson',
  standalone: true,
  imports: [ChartComponent],
  template: `
    <h1>Sales by Salesperson</h1>
    <div class="salesperson-container">
      <!-- Only render the chart once data has been loaded -->
      @if (totalSales.length && salespersons.length) {
        <div class="card chart-card">
          <!-- Bar chart showing each salesperson's total sales -->
          <app-chart
            [type]="'bar'"
            [label]="'Sales by Salesperson'"
            [data]="totalSales"
            [labels]="salespersons">
          </app-chart>
        </div>
      }
    </div>
  `,
  styles: [`
    .salesperson-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .chart-card {
      width: 50%;
      margin: 20px 0;
    }
  `]
})
export class SalesBySalespersonComponent implements AfterViewInit {
  // Holds the total sales amounts corresponding to each salesperson
  totalSales: number[] = [];
  // Holds the salesperson names used as chart labels
  salespersons: string[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    // Fetch all salesperson sales totals on component initialization
    this.http.get(`${environment.apiBaseUrl}/reports/sales/salespersons`).subscribe({
      next: (data: any) => {
        // Map the response into separate arrays for chart data and labels
        this.totalSales = data.map((s: any) => s.totalSales);
        this.salespersons = data.map((s: any) => s.salesperson);

        // Trigger change detection so the chart renders with the new data
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching sales by salesperson:', err);
      }
    });
  }

  ngAfterViewInit(): void {}
}
