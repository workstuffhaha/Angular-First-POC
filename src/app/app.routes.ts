import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { XoGameComponent } from './xo-game/xo-game.component';
import { CalendarSchedulerComponent } from './calendar-scheduler/calendar-scheduler.component';
import { ExcuseGeneratorComponent } from './excuse-generator/excuse-generator.component';
import { RandomGifGeneratorComponent } from './random-gif-generator/random-gif-generator.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'todo-list', component: TodoListComponent },
  { path: 'xo-game', component: XoGameComponent },
  { path: 'calendar-scheduler', component: CalendarSchedulerComponent },
  { path: 'excuse-generator', component: ExcuseGeneratorComponent },
  { path: 'random-gif-generator', component: RandomGifGeneratorComponent },
  { path: 'profile', component: ProfileComponent },
  { 
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: '**', redirectTo: 'home' } // Wildcard route for a 404 page
];
