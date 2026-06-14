import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SalesBySalespersonComponent } from './sales-by-salesperson.component';

describe('SalesBySalespersonComponent', () => {
  let component: SalesBySalespersonComponent;
  let fixture: ComponentFixture<SalesBySalespersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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

  it('should display the title "Sales by Salesperson"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Sales by Salesperson');
  });

  it('should initialize totalSales and salespersons as empty arrays', () => {
    expect(component.totalSales).toEqual([]);
    expect(component.salespersons).toEqual([]);
  });

  it('should not render the chart when there is no sales data', () => {
    component.totalSales = [];
    component.salespersons = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const chartCard = compiled.querySelector('.chart-card');
    expect(chartCard).toBeFalsy();
  });
});
