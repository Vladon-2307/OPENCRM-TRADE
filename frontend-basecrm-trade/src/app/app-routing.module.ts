import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthPageComponent} from "./pages/auth-page/auth-page.component";
import {BaseLayoutComponent} from "./layouts/base-layout/base-layout.component";
import {CounterpartyPageComponent} from "./pages/counterparty-page/counterparty-page.component";
import {UserPageComponent} from "./pages/user-page/user-page.component";

const routes: Routes = [
  {path: 'auth', component: AuthPageComponent},
  {path: '', component: BaseLayoutComponent, children: [
      {path: 'counterparty', component: CounterpartyPageComponent},
      {path: 'user', component: UserPageComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
