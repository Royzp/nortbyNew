import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-page-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UpLoadComponent implements OnInit {
  selectedTab = 'venta';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    localStorage.setItem('type','VE');
  }

  onClickSelectedTab(tab: string): void {
    localStorage.setItem('type',tab);
    this.selectedTab = tab;
  }

  isCuenta(): boolean {
    return this.authService.isCuenta();
  }

}
