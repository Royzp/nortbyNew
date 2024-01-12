import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import {
  MatNativeDateModule,
  MatRippleModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProfileComponent } from 'app/pages/profile/profile.component';
import { HomeComponent } from 'app/pages/home/home.component';
import { UpLoadComponent } from 'app/pages/upload/upload.component';
import { UpLoadDataComponent } from 'app/pages/upload/upload-data/upload-data.component';
import { MaintenanceComponent } from 'app/pages/upload/maintenance/maintenance.component';
import { EditAliasComponent } from 'app/pages/profile/edit-alias/edit-alias.component';
import { FilesSearchComponent } from 'app/pages/upload/files-search/files-search.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UsersComponent } from 'app/pages/users/users.component';
import { UserModalComponent } from 'app/pages/users/user-modal/user-modal.component';
import { UserDeleteModalComponent } from 'app/pages/users/user-delete-modal/user-delete-modal.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'Deshonestidad',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    NgxSpinnerModule,
    MatSnackBarModule,
    MatPaginatorModule,
  ],
  declarations: [
    DashboardComponent,
    HomeComponent,
    UpLoadComponent,
    UpLoadDataComponent,
    MaintenanceComponent,
    ProfileComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    EditAliasComponent,
    FilesSearchComponent,
    UsersComponent,
    UserModalComponent,
    UserDeleteModalComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class AdminLayoutModule {}
