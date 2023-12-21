import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RoleUser} from "../../interfaces/roleUser.interface";
import {AuthService} from "../../auth/services/auth.service";
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public userAdmin: Boolean = false;
  public headerData!: any;
  public error: String = ""

  constructor(private cd: ChangeDetectorRef,
    private authService: AuthService,
  ) {
    this.headerData = this.authService.userInfos()
  }

  ngOnInit(): void {
    this.cd.detectChanges();
    this.authService.userInfos().subscribe({
      next: (userData: RoleUser): void => {
        if (userData.authority == "ROLE_ADMIN") {
          this.userAdmin = true;
        }
      },
      error: () => {
        this.error = "erreur de connexion";
      }
    }

    );
  }
}
