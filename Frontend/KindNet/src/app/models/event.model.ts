export interface CreateEventDto {
  name: string;
  description: string;
  city: string;
  startTime: Date;
  endTime: Date;
  type: string;
  forceCreate: boolean;
}

export interface EventDto {
  id: number;
  name: string;
  description: string;
  city: string;
  startTime: Date;
  endTime: Date;
  type: string;
}

export interface CreateEventResultDto {
  createdEvent: EventDto;
  isOverlapping: boolean;
}

export interface CreateEventPayload {
  Name: string;
  Description: string;
  City: string;
  StartTime: string;
  EndTime: string;
  Type: number; 
  ForceCreate: boolean;
}