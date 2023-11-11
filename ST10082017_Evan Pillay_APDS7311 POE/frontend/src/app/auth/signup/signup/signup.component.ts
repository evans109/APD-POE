import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../auth-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  username: string = '';
  password: string = '';
  firstname: string = '';
  lastname: string = '';
  confirmPassword: string = '';
  hasError: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private auth: AuthServiceService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.hasError = false;

    if (this.username && this.password && this.confirmPassword) {
      if (this.password === this.confirmPassword) {
        this.auth.Signup(this.username, this.firstname, this.lastname, this.password).subscribe(
          (v: any) => {
            this.router.navigate(['/login']);
          },
          (err: any) => {
            this.hasError = true;
            this.errorMessage = 'Error creating account';
          }
        );
      } else {
        this.hasError = true;
        this.errorMessage = 'Passwords do not match';
      }
    } else {
      this.hasError = true;
      this.errorMessage = 'Fill all fields';
    }
  }
}
