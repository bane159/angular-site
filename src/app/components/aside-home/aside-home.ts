import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-aside-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './aside-home.html',
  styleUrl: './aside-home.scss'
})
export class AsideHome {

}
