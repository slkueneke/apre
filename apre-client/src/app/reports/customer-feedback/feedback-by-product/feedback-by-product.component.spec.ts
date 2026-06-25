/**
 * Author: Shannon Kueneke
 * Date: 6/22/2026
 * File: feedback-by-product.component.spec.ts
 * Description: Week 4 Major Change M-108: Create an API to fetch customer feedback data by product and build an Angular component to display customer feedback by product using ChartComponent or TableComponent with 3 unit tests each.
 */

// Import Angular testing utilities for creating and interacting with the component
import { ComponentFixture, TestBed } from '@angular/core/testing';
// HttpClientTestingModule intercepts HTTP calls so no real requests hit the server
import { HttpClientTestingModule } from '@angular/common/http/testing';
// Import the component under test
import { FeedbackByProductComponent } from './feedback-by-product.component';

describe('FeedbackByProductComponent', () => {
  let component: FeedbackByProductComponent;
  let fixture: ComponentFixture<FeedbackByProductComponent>;

  // Configure the testing module before each test, using HttpClientTestingModule
  // to prevent real HTTP calls from the constructor
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Import the standalone component itself so its dependencies are resolved
      imports: [HttpClientTestingModule, FeedbackByProductComponent]
    }).compileComponents();

    // Create the component fixture and obtain the component instance
    fixture = TestBed.createComponent(FeedbackByProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verify the component initializes without errors
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify the page heading renders the expected report title
  it('should display the title "Customer Feedback by Product"', () => {
    const compiled = fixture.nativeElement;
    // Query for the h1 element that holds the report title
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Customer Feedback by Product');
  });

  // Verify both data arrays start empty before an HTTP response arrives
  it('should initialize products and ratingAvg as empty arrays', () => {
    // products and ratingAvg are set only after the HTTP subscription resolves,
    // so they must be empty arrays immediately after construction
    expect(component.products).toEqual([]);
    expect(component.ratingAvg).toEqual([]);
  });
});
