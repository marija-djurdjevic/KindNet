export interface CreateEventDto {
  name: string;
  description: string;
  city: string;
  startTime: Date;
  endTime: Date;
  type: string;
  forceCreate: boolean;
  applicationDeadline: Date;
  requiredSkills: string[];
}

export interface EventDto {
  id: number;
  name: string;
  description: string;
  city: string;
  startTime: Date;
  endTime: Date;
  type: number;
  status: number;
  applicationDeadline: Date;
  requiredSkills: string[];
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
  ApplicationDeadline: string;
  RequiredSkills: string[];
}