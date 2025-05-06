import { NgModule } from '@angular/core'; // for module decorator
import { CommonModule } from '@angular/common'; //ngFor, ngIf directives.
import { ReactiveFormsModule } from '@angular/forms'; //reactive forms
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { RecoveryComponent } from './components/recovery/recovery.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recovery', component: RecoveryComponent }
];

//angular module - organizes the app into cohesive blocks of functionality which contain - components, directives, pipes and services.
// advantages of modules - encapsulation, reusability, lazy loading

// this is a feature module (organises related functionality)
//encapsulates all the auth related components and services
//can be imported into other modules - reusablity
//can be lazy loaded - only when needed, only required when the user navigates to an authentication page - /login

@NgModule({
  declarations: [ //list of classes that exclusively belong to this module
    // these are specific to authmodule, cant be used outside of it unless exported
    RegisterComponent,
    LoginComponent,
    RecoveryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [ //makes these declared components available to other modules
    RegisterComponent,
    LoginComponent,
    RecoveryComponent
  ]
})
export class AuthModule { } 