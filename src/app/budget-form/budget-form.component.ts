import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Budget, ModuleType, Zone } from '../models/budget';
import { ModuleService } from '../service/module.service';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../service/budget.service';
import { Subscription } from 'rxjs';
import { routes } from '../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.css',
})
export class BudgetFormComponent implements OnInit,OnDestroy {
goLista() {
  this.router.navigate(['budgets'])
}

  budgetForm: FormGroup;
  modulesTypes: ModuleType[] = [];
  zones = Object.values(Zone);
  moduleService: ModuleService = inject(ModuleService);
  budgetService: BudgetService=inject(BudgetService)
  subscription =new Subscription();
  total:number = 0
  boxCount: number = 0
  private router:Router = inject(Router)

  constructor(private fb: FormBuilder) {
    this.budgetForm = this.fb.group({
      client: ['', Validators.required],
      date: ['', [Validators.required, this.validateDate]],
      modules: this.fb.array([], Validators.required)
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {
    this.loadModuleTypes();
    this.addModule();
  }

  get modules(): FormArray {
    return this.budgetForm.get('modules') as FormArray;
  }

  addModule() {
    const moduleGroup = this.fb.group({
      moduleType: [null, Validators.required],
      environment: [null, Validators.required],
      price: [{ value: null, disabled: true }],
      slots: [{ value: null, disabled: true }]
    });
    this.modules.push(moduleGroup);
  }

  loadModuleTypes(): void {
    this.moduleService.getModuleTypes().subscribe({
      next: (moduleType: ModuleType[]) => {
        this.modulesTypes = moduleType;
      },
      error: (err) => {
        alert("Error al cargar los módulos");
      }
    });
  }
  
  updateModuleInfo(index: number) {
    const selectedTypeId = this.modules.at(index).get('moduleType')?.value;
    const selectedModule = this.modulesTypes.find((type) => type.id === selectedTypeId);
    if (selectedModule) {
      this.modules.at(index).patchValue({
        price: selectedModule.price,
        slots: selectedModule.slots,
      });
    }
    this.calculateTotals();
  }
  calculateTotals() {
    this.total = this.modules.controls.reduce((sum, module) => {
      const price = module.get('price')?.value || 0;
      return sum + price;
    }, 0);

    let remainingSlots = 0; 
    let boxCount = 0;       

    this.modules.controls.forEach((module) => {
    const slots = module.get('slots')?.value || 0;

    
    if (slots > remainingSlots) {
      boxCount++; 
      remainingSlots = 3; 
    }

    
    remainingSlots -= slots;
  });

  
  this.boxCount = boxCount;
  }

  getModulePrice(index: number): number | null {
    const selectedTypeId = this.modules.at(index).get('moduleType')?.value;
    const selectedModule = this.modulesTypes.find((type) => type.id === selectedTypeId);
    return selectedModule ? selectedModule.price : null;
  }

  getModuleSlots(index: number): number | null {
    const selectedTypeId = this.modules.at(index).get('moduleType')?.value;
    const selectedModule = this.modulesTypes.find((type) => type.id === selectedTypeId);
    return selectedModule ? selectedModule.slots : null;
  }

  submitBudget() {
    if (this.budgetForm.invalid) {
      alert("Formulario Inválido");
      console.log(this.budgetForm);
      return;
    }
  
  
    const modulesWithDetails = this.modules.controls.map((moduleControl) => {
      const moduleTypeId = moduleControl.get('moduleType')?.value;
      const moduleType = this.modulesTypes.find((type) => type.id === moduleTypeId);
      return {
        moduleType: moduleType || moduleTypeId,
        zone: moduleControl.get('environment')?.value,
        quantity: moduleControl.get('slots')?.value, 
      };
    });
    if(this.modules.length < 5){
      alert("debe cargar minimo 5 modulos")
      return;
    } 
  
    // Creamos el presupuesto con los datos necesarios
    const budget: Budget = {
      ...this.budgetForm.value,
      modules: modulesWithDetails,
      
      total: this.total,
      boxCount: this.boxCount,
    };
  
    //POST
    const addSubscription = this.budgetService.postBudget(budget).subscribe({
      next: () => {
        
      },
      error: (err) => {
        console.error("Error al guardar el presupuesto:", err);
      },
    });
  
    
    this.subscription.add(addSubscription);
    alert("se realizo con exito")
    this.router.navigate(['budgets'])
  }

  validateDate(control: FormControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    return selectedDate > today ? { invalidDate: true } : null;
  }
}
