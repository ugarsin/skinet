import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({  
  selector: 'app-header',
  imports: [
    MatIcon,
    MatButton,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
