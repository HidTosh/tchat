import {Component, OnInit} from '@angular/core';
import {RoleUser} from "./interfaces/roleUser.interface";
import {SessionService} from "./service/session.service";
import {AuthService} from "./auth/services/auth.service";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'front';

  constructor() { }

  ngOnInit(): void {
  }
}
