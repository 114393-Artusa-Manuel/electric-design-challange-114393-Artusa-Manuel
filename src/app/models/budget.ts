export interface Budget {
  id?: string;
  client: string;
  date: Date;
  modules: BudgetModule[];
  total:number;
  boxCount: number;
  /* TODO
    Add collection to hold data about:
        - zone
        - moduleType reference that has information about (slots, price, type)
  */
}
export interface BudgetModule{
  moduleType:ModuleType;
  zone: Zone;
  quantity: number;
}

export enum Zone {
  LIVING = 'Living',
  COMEDOR = 'Comedor',
  KITCHEN = 'Cocina',
  ROOM = 'Dormitorio'
}

export interface ModuleType {
  id: number;
  name: string;
  slots: number;
  price: number;
}
