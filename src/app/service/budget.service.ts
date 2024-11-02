import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Budget } from '../models/budget';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private http:HttpClient = inject(HttpClient)
  private readonly url = "http://localhost:3000/budgets"
  constructor() { }

  postBudget(budget:Budget){
    const observable = this.http.post<Budget>(this.url,budget);
    return observable;
  }
  getBudgets(){
    return this.http.get<Budget[]>(this.url)
  }
  getBudgetById(index:string):Observable<Budget>{
    const observable = this.http.get<Budget>(this.url+'/'+index)
    return observable
  }
}
