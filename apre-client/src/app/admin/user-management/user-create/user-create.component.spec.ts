import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserCreateComponent } from './user-create.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('UserCreateComponent', () => {
  let component: UserCreateComponent;
  let fixture: ComponentFixture<UserCreateComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        UserCreateComponent // Import the standalone component
      ],
      providers: [
        {
          provide: Router,
          useValue: {
            events: of({}), // Mock router events
            navigate: jasmine.createSpy('navigate'),
            createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}),
            serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue(''),
            routerState: {
              snapshot: {
                root: {}
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCreateComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.newUserForm).toBeTruthy();
    expect(component.newUserForm.controls['username']).toBeTruthy();
    expect(component.newUserForm.controls['password']).toBeTruthy();
    expect(component.newUserForm.controls['email']).toBeTruthy();
    expect(component.newUserForm.controls['role']).toBeTruthy();
  });

  it('should set errorMessage when form is invalid on addUser call', () => {
    // Set form values to invalid state
    component.newUserForm.controls['username'].setValue('');
    component.newUserForm.controls['password'].setValue('');
    component.newUserForm.controls['email'].setValue('');
    component.newUserForm.controls['role'].setValue('');

    // Call the addUser method
    component.addUser();

    // Verify that the errorMessage is set
    expect(component.errorMessage).toBe('Please fill in all fields.');
  });

  //m-036: add success message on add user - needed to wrap this test in a fake async since the redirect is now wrapped in a 2 second timeout - this test was previously run sync
  it('should navigate to /user-management/users on successful user creation', fakeAsync(() => {
    spyOn(component['http'], 'post').and.returnValue(of({}));

    component.newUserForm.controls['username'].setValue('testuser');
    component.newUserForm.controls['password'].setValue('Password123');
    component.newUserForm.controls['email'].setValue('testuser@example.com');
    component.newUserForm.controls['role'].setValue('admin');

    component.addUser();

    tick(2000); // fast-forward past the setTimeout

    expect(router.navigate).toHaveBeenCalledWith(['/user-management/users']);
  }));

  //m-036: add success message on add user - verify with test that success message is shown when successfully creating a new user
  it('should set successMessage when form is valid on addUser call', () => {
    spyOn(component['http'], 'post').and.returnValue(of({}));

    component.newUserForm.controls['username'].setValue('testuser');
    component.newUserForm.controls['password'].setValue('Password123');
    component.newUserForm.controls['email'].setValue('testuser@example.com');
    component.newUserForm.controls['role'].setValue('admin');

    component.addUser();

    // Verify that the successMessage is set
    expect(component.successMessage).toBe('User successfully created!');
  });

});