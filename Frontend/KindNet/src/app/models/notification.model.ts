export interface UserNotification {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: Date;
  type: NotificationType;
  eventId: number;
}

export enum NotificationType {
    NewApplication = 0,
    ApplicationStatusUpdate = 1,
    EventUpdate = 2
}