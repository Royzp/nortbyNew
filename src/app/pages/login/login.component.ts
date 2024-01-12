import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {  catchError, finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user = new FormControl();
  password = new FormControl();
  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit() {}

  onClickLogin(): void {
    this.spinner.show();
    if ((this.user.value || '') === '' || (this.password.value || '') === '') {
      this.snackBar.open('Ingrese usuario y password', 'x', { duration: 15000, panelClass: ['info-snackbar'] });
      return;
    }
    const errorGetToken = (e) => { 
      return this.snackBar.open(e.message, 'x', { duration: 15000, panelClass: ['error-snackbar'] }) };
    const body = { user: this.user.value, password: this.password.value };
    this.authService
      .getTokenJlr(body)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        }),
      )
      .subscribe({
        next: (response) => {
          console.log(response)
          if (response.status === 200) {
            this.authService.setTokenJrl(response?.json);
            
            this.router.navigate(['/']);
          } else {
            errorGetToken(response);
          }
        },
        error: errorGetToken
      });
  }
}
