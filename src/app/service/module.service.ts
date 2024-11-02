import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModuleType } from '../models/budget';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private readonly http:HttpClient = inject(HttpClient);
  private readonly url= "http://localhost:3000/module-types"
  constructor() {}

  getModuleTypes():Observable<ModuleType[]>{
    const observable = this.http.get<ModuleType[]>(this.url)
    return observable
  }
  
}
