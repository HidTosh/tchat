import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { LoginRequest } from '../../interfaces/loginRequest.interface';
import { AuthSuccess } from "../../interfaces/authSuccess.interface";
import { User } from "../../../interfaces/user.interface";
import { SessionService } from "../../../service/session.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public hide: boolean = true;
  public onError: boolean = false;
  public backToHome: string = '/';
  public loginSubscription$!: Subscription;
  public meSubscription$!: Subscription;

  public form = this.formBuilder.group({
    email: [
      '', [ Validators.required ]
    ],
    password: [
      '', [ Validators.required ]
    ]
  });

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.sessionService.isLogged) {
      this.router.navigateByUrl('topics');
    }
  }

  ngOnDestroy(): void {
    this.loginSubscription$?.unsubscribe();
    this.meSubscription$?.unsubscribe();
  }

  public submit(): void {
    const loginRequest: LoginRequest = this.form.value as LoginRequest;
    this.loginSubscription$ = this.authService.login(loginRequest).subscribe({
      next: (response: AuthSuccess): void => {
        localStorage.setItem('token', response.response);
        this.getUserInformations();
      },
      error: error => this.onError = true,
    });
  }

  public getUserInformations(): void {
    this.meSubscription$ = this.authService.me().subscribe({
      next: (user: User): void => {
        this.sessionService.logIn(user);
        this.router.navigate(['profil']).then(() => {
          location.reload();
        });
      }
    });
  }
}
