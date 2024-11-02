import { Component, inject, OnInit } from '@angular/core';
import { Budget, BudgetModule, ModuleType } from '../models/budget';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetService } from '../service/budget.service';
import { CommonModule } from '@angular/common';
import { ModuleService } from '../service/module.service';

@Component({
  selector: 'app-budget-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-view.component.html',
  styleUrl: './budget-view.component.css',
})
export class BudgetViewComponent implements OnInit{
goLista() {
  this.router.navigate(['budgets'])
}
  


  ngOnInit(): void {
    const budgetId = this.route.snapshot.paramMap.get('id');
    if (budgetId) {
      this.budgetService.getBudgetById(budgetId).subscribe({
        next: (data) => {
          console.log("Datos del presupuesto:", data);
          this.budget = data;
          this.populateModuleDetails();
        },
        error: () => {
          alert("Error al cargar los detalles del presupuesto");
        }
        
      });
    }
    this.moduleService.getModuleTypes().subscribe((data) => {
      this.allModuleTypes = data;
  })
}
  trackByFn(index: number, module: BudgetModule): number {
    return module.moduleType.id;
  }
  // ADDITIONAL DOCS: same as BudgetListComponent
  budget:Budget |null =null;
  private readonly route = inject(ActivatedRoute)
  private budgetService:BudgetService = inject (BudgetService)
  allModuleTypes: ModuleType[] = [];
  private moduleService:ModuleService = inject(ModuleService)
  private router :Router = inject(Router)
  populateModuleDetails(): void {
    this.budget?.modules.forEach((module) => {
      module.moduleType = this.allModuleTypes.find((mt) => mt.id === module.moduleType.id) || module.moduleType;
    });
}

}
