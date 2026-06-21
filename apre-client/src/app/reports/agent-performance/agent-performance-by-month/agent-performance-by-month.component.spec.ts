/**
 * Author: Professor Krasso
 * Date: 6/21/2025
 * File: agent-performance-by-month.component.spec.ts
 * Description: Unit tests for AgentPerformanceByMonthComponent
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AgentPerformanceByMonthComponent } from './agent-performance-by-month.component';

describe('AgentPerformanceByMonthComponent', () => {
  let component: AgentPerformanceByMonthComponent;
  let fixture: ComponentFixture<AgentPerformanceByMonthComponent>;

  // Configure the testing module before each test, using HttpClientTestingModule
  // to intercept HTTP calls without hitting a real server
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AgentPerformanceByMonthComponent]
    }).compileComponents();

    // Create the component and trigger initial change detection
    fixture = TestBed.createComponent(AgentPerformanceByMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verify the component initializes without errors
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify the page heading renders the expected report title
  it('should display the title "Agent Performance by Month"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Agent Performance by Month');
  });

  // Verify that submitting the form without a month selection shows a validation error in the DOM
  it('should display an error message if the form is submitted without selecting a month', () => {
    // Submit while monthForm is still invalid (no month chosen)
    component.onSubmit();
    fixture.detectChanges(); // Push the errorMessage change into the view

    const compiled = fixture.nativeElement;
    const errorMessageElement = compiled.querySelector('.message--error');
    expect(errorMessageElement).toBeTruthy();
    expect(errorMessageElement.textContent).toContain('Please select a month');
  });
});
