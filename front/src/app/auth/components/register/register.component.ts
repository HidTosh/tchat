import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { RegisterRequest } from "../../interfaces/registerRequest.interface";
import { AuthSuccess } from "../../interfaces/authSuccess.interface";
import { SessionService } from "../../../service/session.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  public onError: boolean = false;
  public validNameError: boolean = false;
  public validPasswordError: boolean = false;
  public registerSubscription$!: Subscription;

  public registerForm = this.formBuilder.group({
    name: [
      '',
      [Validators.required, Validators.minLength(5)]
    ],
    email: [
      '',
      [Validators.required, Validators.email]
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(8)]
    ]
  });

  constructor(
    private sessionService: SessionService,
    private matSnackBar: MatSnackBar,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.sessionService.isLogged) {
      this.router.navigateByUrl('topics');
    }
  }

  ngOnDestroy(): void {
    this.registerSubscription$?.unsubscribe();
  }

  public isValidName(): void {
    let length: number | undefined = this.registerForm.value.name?.length;
    this.validNameError = (length != undefined) &&(length <= 5);
  }

  public isValidPassword(password: string | null | undefined): boolean {
    const pattern: RegExp = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
    );
    return (password != null) && pattern.test(password) && (password.length >= 8);
  }

  public submit(): void {
    let password: string | null | undefined = this.registerForm.value.password
    if (this.isValidPassword(password)) {
      const registerRequest: RegisterRequest = this.registerForm.value as RegisterRequest;
      this.registerSubscription$ = this.authService.register(registerRequest).subscribe(
        {
          next: (res: AuthSuccess): void => {
            if (res.response == "success") {
              this.router.navigate(['/login']);
              this.matSnackBar.open('Compte créé', 'Close', { duration: 3000 })
            } else {
              this.onError = true;
            }
          },
          error: error => this.onError = true,
        }
      );
    } else {
      this.validPasswordError = true;
    }
  }
}
