import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RoleUser} from "../../interfaces/roleUser.interface";
import {Router} from "@angular/router";
import {AuthService} from "../../auth/services/auth.service";
import {SessionService} from "../../service/session.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public name: String = "";
  public email: String = "";
  public role: String = "";
  public userForm: FormGroup = this.formBuilder.group({name: [], email: [], authority: []});
  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.userInfos().subscribe({
      next: (userData: RoleUser): void => {
        this.name = userData.user.name;
        this.email = userData.user.email;
        this.role = userData.authority;
      },
      error: (): void => {
        console.warn("Error service auth")
      },
    });
  }

  public logout(): void {
    this.sessionService.logOut();
    this.router.navigate(['/login'])
    location.reload();
  }
}
