import { ComponentFixture, TestBed } from '@angular/core/testing';
// HttpClientTestingModule provides a mock HTTP client so no real requests are made
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SalesBySalespersonComponent } from './sales-by-salesperson.component';

describe('SalesBySalespersonComponent', () => {
  let component: SalesBySalespersonComponent;
  let fixture: ComponentFixture<SalesBySalespersonComponent>;

  // Set up the testing module before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Include HttpClientTestingModule to intercept HTTP calls in the constructor
      imports: [HttpClientTestingModule, SalesBySalespersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBySalespersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify the page heading renders correctly
  it('should display the title "Sales by Salesperson"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Sales by Salesperson');
  });

  // Verify both data arrays start empty before the HTTP response arrives
  it('should initialize totalSales and salespersons as empty arrays', () => {
    expect(component.totalSales).toEqual([]);
    expect(component.salespersons).toEqual([]);
  });

  // Verify the chart is hidden when there is no data to display
  it('should not render the chart when there is no sales data', () => {
    component.totalSales = [];
    component.salespersons = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const chartCard = compiled.querySelector('.chart-card');
    expect(chartCard).toBeFalsy();
  });
});
