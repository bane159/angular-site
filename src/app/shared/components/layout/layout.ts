import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidenav } from '../../../components/sidenav/sidenav';
import { AsideHome } from '../../../components/aside-home/aside-home';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Sidenav,
    AsideHome
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  // This component will serve as a layout wrapper
  // It projects content into the main area via ng-content
}
