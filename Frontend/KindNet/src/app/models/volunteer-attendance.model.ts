export interface DailyAttendance {
    hoursVolunteered: number;
    status: boolean;
}

export interface AttendanceRecord {
    applicationId: number;
    volunteerUserId: number;
    volunteerFirstName: string;
    volunteerLastName: string;
    dailyRecords: { [date: string]: DailyAttendance | undefined };
}

export interface SaveAttendanceRecord {
    applicationId: number;
    sessionDate: string; 
    hoursVolunteered: number;
    status: boolean;
}
