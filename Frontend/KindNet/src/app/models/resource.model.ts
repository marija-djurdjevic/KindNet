export enum ResourceCategory {
  Oprema = 0,
  Prostor = 1,
  Prevoz = 2,
  Materijal = 3,
  Hrana = 4,
  Piće = 5,
  Ostalo = 6
}

export enum ResourceRequestStatus {
  Otvoren = 0,
  Djelimicno = 1,
  Ispunjen = 2
}

export interface ResourceRequest {
  id: number;
  eventId: number;
  itemName: string;               
  quantityNeeded: number;           
  category: ResourceCategory; 
  quantityFulfilled: number;
  status: ResourceRequestStatus;
}

export interface ResourceFulfillment {
  id: number;                 
  requestId: number;  
  providerUserId: number;         
  quantityProvided: number;   
  agreementTime: Date;           
}

export interface ResourceFulfillmentDetailDto {
  id: number;                 
  requestId: number;  
  providerUserId: number;         
  quantityProvided: number;   
  agreementTime: Date;  
  providerName: string;
}

export interface ResourceRequestDetailDto {
  id: number;
  eventId: number;
  itemName: string;               
  quantityNeeded: number;           
  category: ResourceCategory; 
  quantityFulfilled: number;
  status: ResourceRequestStatus;
  fulfillments: ResourceFulfillmentDetailDto[]; 
}