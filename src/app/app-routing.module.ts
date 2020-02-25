import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { ApplicantTableComponent } from './applicant-table/applicant-table.component';
import { TestComponent } from './test/test.component';
import { ViewportfolioComponent } from './viewportfolio/viewportfolio.component';


const routes: Routes = [
  {
    path:'',component: LoginPageComponent
  },
  {
    path:'applicantForm', component: MainScreenComponent
  },
  {
    path:'applicanttable',component:ApplicantTableComponent
  },
  {
    path:"test",component:TestComponent
  },
  {
    path:"viewportfolio",component:ViewportfolioComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
