import { RouterModule, Routes } from '@angular/router';

// import { DashboardComponent } from '../../dashboard/dashboard.component';
// import { UserProfileComponent } from '../../user-profile/user-profile.component';
// import { TableListComponent } from '../../table-list/table-list.component';
// import { TypographyComponent } from '../../typography/typography.component';
// import { IconsComponent } from '../../icons/icons.component';
// import { MapsComponent } from '../../maps/maps.component';
// import { NotificationsComponent } from '../../notifications/notifications.component';
// import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { ProfileComponent } from 'app/pages/profile/profile.component';
import { HomeComponent } from 'app/pages/home/home.component';
import { UpLoadComponent } from 'app/pages/upload/upload.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from 'app/providers/guards/auth.guard';
import { UsersComponent } from 'app/pages/users/users.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'upload', component: UpLoadComponent, canActivate: [AuthGuard] },
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  // { path: 'table-list', component: TableListComponent, canActivate: [AuthGuard] },
  // { path: 'typography', component: TypographyComponent, canActivate: [AuthGuard] },
  // { path: 'icons', component: IconsComponent, canActivate: [AuthGuard] },
  // { path: 'maps', component: MapsComponent, canActivate: [AuthGuard] },
  // { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  // { path: 'upgrade', component: UpgradeComponent, canActivate: [AuthGuard] },
];

const isIframe = window !== window.parent && !window.opener;
const _hash = true; // anteriormente ha estado en true
@NgModule({
  imports: [
    RouterModule.forRoot(AdminLayoutRoutes, {
      useHash: _hash,
      initialNavigation: !isIframe ? 'enabled' : 'disabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
