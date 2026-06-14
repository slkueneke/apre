import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ChartComponent } from '../../../shared/chart/chart.component';

@Component({
  selector: 'app-sales-by-salesperson',
  standalone: true,
  imports: [ChartComponent],
  template: `
    <h1>Sales by Salesperson</h1>
    <div class="salesperson-container">
      @if (totalSales.length && salespersons.length) {
        <div class="card chart-card">
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
  totalSales: number[] = [];
  salespersons: string[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.http.get(`${environment.apiBaseUrl}/reports/sales/salespersons`).subscribe({
      next: (data: any) => {
        this.totalSales = data.map((s: any) => s.totalSales);
        this.salespersons = data.map((s: any) => s.salesperson);

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
