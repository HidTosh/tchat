import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserComponent} from "./pages/user/user.component";
import {AuthGuard} from "./guards/auth.guards";
import {HomeComponent} from "./pages/home/home.component";
import {AdminModule} from "./pages/admin/admin.module";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'profil',
    canActivate: [AuthGuard],
    component: UserComponent
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
