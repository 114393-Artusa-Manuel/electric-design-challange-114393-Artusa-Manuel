import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Budget } from '../models/budget';
import { Subscription } from 'rxjs';
import { BudgetService } from '../service/budget.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { routes } from '../app.routes';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.css',
})
export class BudgetListComponent implements OnInit,OnDestroy{
goForm() {
  this.routes.navigate(['formBudget'])
}
  
  budgets:Budget[] =[]
  subscription = new Subscription();
  budgetService:BudgetService = inject(BudgetService)
  private readonly routes: Router = inject(Router)

  
  onviewDetails(budget:Budget){
  this.routes.navigate(['/budgets',budget.id])
  }

  ngOnInit(): void {
    this.loadBudgets()
  }
  loadBudgets() {
    this.budgetService.getBudgets().subscribe({
      next: (budget) => {
        this.budgets = budget
      },
      error:(err) =>{
        alert("ERROR AL CARGAR LAS FACTURAS")
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  /* ADDITIONAL DOCS:
    - https://angular.dev/guide/components/lifecycle#
    - https://angular.dev/guide/http/making-requests#http-observables
    - https://angular.dev/guide/http/setup#providing-httpclient-through-dependency-injection
    - https://angular.dev/guide/http/making-requests#setting-request-headers
    - https://angular.dev/guide/http/making-requests#handling-request-failure
    - https://angular.dev/guide/http/making-requests#best-practices (async pipe)
    - https://angular.dev/guide/testing/components-scenarios#example-17 (async pipe)
  */

}
