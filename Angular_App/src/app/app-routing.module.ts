import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuards } from './guards/auth.guards';
import { NearbyShopsComponent } from './components/nearby-shops/nearby-shops.component';
import { PreferredShopsComponent } from './components/preferred-shops/preferred-shops.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'nearbyShops', component: NearbyShopsComponent, canActivate: [AuthGuards] },
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent },
  { path: 'Prefered-Shops', component: PreferredShopsComponent, canActivate: [AuthGuards]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
