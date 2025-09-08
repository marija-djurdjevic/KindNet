import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserNotification } from 'src/app/models/notification.model';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})

export class LayoutComponent {


  unreadNotifications: number = 0;
  notifications: UserNotification[] = [];
  showNotifications: boolean = false;

  constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService) { }
  
  ngOnInit(): void {
    this.getNotifications();
    this.unreadCount();
    this.sortNotifications();
  }

   getNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (data: UserNotification[]) => {
        this.notifications = data;
        console.log(this.notifications)
        this.unreadNotifications = this.notifications.filter(n => !n.isRead).length;
      }
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  unreadCount(): void {
  this.unreadNotifications = this.notifications.filter(n => !n.isRead).length;
  }

  sortNotifications(): UserNotification[] {
    this.unreadNotifications = this.notifications.filter(n => !n.isRead).length;
    return this.notifications.sort((a, b) => {
      if (a.isRead && !b.isRead) {
        return 1;
      }
      if (!a.isRead && b.isRead) {
        return -1;
      }
      return 0;
    });
  }

   markAsRead(notification: UserNotification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.isRead = true;
          this.unreadCount();
        }
      });
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this.unreadCount();
      }
    });
  }

  deleteNotification(notificationId: number): void {
    this.notificationService.deleteNotification(notificationId).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.unreadCount();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
