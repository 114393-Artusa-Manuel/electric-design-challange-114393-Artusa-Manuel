import { Routes } from '@angular/router';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { BudgetViewComponent } from './budget-view/budget-view.component';
import { BudgetFormComponent } from './budget-form/budget-form.component';

export const routes: Routes = [
    { path: '', redirectTo: '/budgets', pathMatch: 'full' },
    { path: 'budgets', component: BudgetListComponent },
    { path: 'budgets/:id', component: BudgetViewComponent },
    {path: 'formBudget', component: BudgetFormComponent}
];
