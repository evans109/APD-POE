import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  hasError: boolean = false;
  errorMessage: string = '';

  constructor(public authservice: AuthServiceService, private router: Router) { }

  ngOnInit(): void { }

  onSubmit() {
    this.hasError = false;

    if (this.username && this.password) {
      this.authservice.Login(this.username, this.password).subscribe(
        (response: any) => {
          const { token } = response as any;
          localStorage.setItem('x-auth-token', token);
          this.router.navigate(['view']);
        },
        (error) => {
          this.hasError = true;
          this.errorMessage = 'Error logging in';
        }
      );
    } else {
      this.hasError = true;
      this.errorMessage = 'Fill all fields';
    }
  }
}
