export enum ResourceCategory {
  Oprema = 0,
  Prostor = 1,
  Prevoz = 2,
  Materijal = 3,
  Hrana = 4,
  Piće = 5,
  Ostalo = 6
}

export interface ResourceRequest {
  eventId: number;
  itemName: string;               
  quantityNeeded: number;           
  category: ResourceCategory; 
}

export interface ResourceFulfillment {
  id: number;                 
  resourceRequestId: number;  
  providerId: number;         
  providedQuantity: number;   
  providedAt: Date;           
}