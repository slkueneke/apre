/**
 * Author: Professor Krasso
 * Date: 6/21/2025
 * File: agent-performance-by-month.component.ts
 * Description: Agent performance by month component
 */

import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableComponent } from '../../../shared/table/table.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-agent-performance-by-month',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TableComponent],
  template: `
    <h1>Agent Performance by Month</h1>
    <div class="region-container">
      <form class="form" [formGroup]="monthForm" (ngSubmit)="onSubmit()">

        @if (errorMessage) {
          <div class="message message--error">{{ errorMessage }}</div>
        }

        <div class="form__group">
          <label class="label" for="month">Month</label>
          <select class="select" formControlName="month" id="month" name="month">
            @for(month of months; track month.value) {
              <option value="{{ month.value }}">{{ month.name }}</option>
            }
          </select>
        </div>
        <div class="form__actions">
          <button class="button button--primary" type="submit">Submit</button>
        </div>
      </form>

      @if (tableData.length) {
        <div class="card chart-card">
          <app-table
            [title]="'Agent Performance for ' + selectedMonthName"
            [data]="tableData"
            [headers]="tableHeaders"
            [sortableColumns]="tableHeaders"
            [headerBackground]="'default'">
          </app-table>
        </div>
      }
    </div>
  `,
  styles: `
    .region-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .form, .chart-card {
      width: 50%;
      margin: 20px 0;
      padding: 10px;
    }

    app-table {
      padding: 50px;
    }
  `
})
export class AgentPerformanceByMonthComponent {
  // Rows returned from the API, bound to the TableComponent's [data] input
  tableData: any[] = [];

  // Column headers passed to the TableComponent; must match the mapped property names set in onSubmit()
  tableHeaders: string[] = ['Agent', 'Total Call Duration', 'Total Calls'];

  // List of months displayed in the dropdown, populated by loadMonths()
  months: { value: number; name: string }[] = [];

  // Validation or no-data message shown above the form
  errorMessage: string = '';

  // Human-readable name of the selected month, used in the table title
  selectedMonthName: string = '';

  // Reactive form with a required month control
  monthForm = this.fb.group({
    month: [null, Validators.compose([Validators.required])]
  });

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    // Populate the month dropdown on construction
    this.months = this.loadMonths();
  }

  // Returns the full list of calendar months with numeric values for the API and display names for the UI
  loadMonths() {
    return [
      { value: 1, name: 'January' },
      { value: 2, name: 'February' },
      { value: 3, name: 'March' },
      { value: 4, name: 'April' },
      { value: 5, name: 'May' },
      { value: 6, name: 'June' },
      { value: 7, name: 'July' },
      { value: 8, name: 'August' },
      { value: 9, name: 'September' },
      { value: 10, name: 'October' },
      { value: 11, name: 'November' },
      { value: 12, name: 'December' }
    ];
  }

  // Called when the form is submitted; validates the selection then fetches data from the API
  onSubmit() {
    // Guard: show an error and exit early if no month has been chosen
    if (this.monthForm.invalid) {
      this.errorMessage = 'Please select a month';
      return;
    }

    const month = this.monthForm.controls['month'].value;

    // Resolve the selected month's display name for use in the table title and error messages
    const selectedMonth = this.months.find(m => m.value === Number(month));
    this.selectedMonthName = selectedMonth ? selectedMonth.name : '';

    // Call the agent-performance-by-month API with the chosen month number
    this.http.get(`${environment.apiBaseUrl}/reports/agent-performance/agent-performance-by-month?month=${month}`).subscribe({
      next: (data: any) => {
        // If the API returns no records, show a message instead of an empty table
        if (data.length === 0) {
          this.errorMessage = `No data found for ${this.selectedMonthName}`;
          this.tableData = [];
          return;
        }

        // Map API property names to display-friendly header names so the TableComponent can match them
        for (let row of data) {
          row['Agent'] = row['agent'];
          row['Total Call Duration'] = row['totalCallDuration'];
          row['Total Calls'] = row['totalCalls'];
        }

        this.tableData = data;
        this.errorMessage = '';

        // Manually trigger change detection so the table re-renders with the new data
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching agent performance by month data:', err);
        this.errorMessage = 'An error occurred while fetching data.';
      }
    });
  }
}
