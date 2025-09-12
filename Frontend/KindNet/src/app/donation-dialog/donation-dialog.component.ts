import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-donation-dialog',
  templateUrl: './donation-dialog.component.html',
  styleUrls: ['./donation-dialog.component.css']
})
export class DonationDialogComponent {

  donationAmount: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<DonationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { resource: any, neededQuantity: number }
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.donationAmount && this.donationAmount > 0 && this.donationAmount <= this.data.neededQuantity) {
      this.dialogRef.close(this.donationAmount);
    }
  }
}