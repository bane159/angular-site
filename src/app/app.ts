import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { FlashMessageComponent } from "./shared/components/flash-message/flash-message";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, FlashMessageComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-site');
}
