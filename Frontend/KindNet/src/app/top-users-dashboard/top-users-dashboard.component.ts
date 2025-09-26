import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { TopPerformers } from '../models/top-users.model';

@Component({
  selector: 'app-top-users-dashboard',
  templateUrl: './top-users-dashboard.component.html',
  styleUrls: ['./top-users-dashboard.component.css']
})
export class TopUsersDashboardComponent implements OnInit {
  topPerformers: TopPerformers | null = null;
  isLoading = true;

  typeIconMapping: { [key: string]: string } = {
    'Volunteer': 'volunteer_activism',
    'Business': 'business',
    'Organization': 'groups'
  };

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getTopPerformers().subscribe({
      next: (data) => {
        this.topPerformers = data;
        console.log(this.topPerformers);
        this.isLoading = false;
      }
    });
  }
}
