import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BudgetFormComponent } from "./budget-form/budget-form.component";
import { HttpClientModule } from '@angular/common/http';
import { BudgetListComponent } from "./budget-list/budget-list.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BudgetFormComponent, HttpClientModule, BudgetListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'electric-design-challange';
}
