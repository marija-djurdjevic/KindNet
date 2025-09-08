export interface CreateEventDto {
  name: string;
  description: string;
  city: string;
  startTime: Date;
  endTime: Date;
  type: string;
  status: string;
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
  type: string;
  status: string;
  applicationDeadline: Date;
  requiredSkills: string[];
  organizerName: string;
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
  Status: string;
  ForceCreate: boolean;
  ApplicationDeadline: string;
  RequiredSkills: string[];
}
export enum EventStatus {
  Draft = 0,
  Planned = 1,
  Active = 2,
  Finished = 3,
  Canceled = 4,
  Archived = 5
}