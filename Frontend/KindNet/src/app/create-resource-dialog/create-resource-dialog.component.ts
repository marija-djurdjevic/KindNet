import { Component } from '@angular/core';
import { ResourceCategory } from '../models/resource.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-resource-dialog',
  templateUrl: './create-resource-dialog.component.html',
  styleUrls: ['./create-resource-dialog.component.css']
})
export class CreateResourceDialogComponent {
  resourceForm: FormGroup;
  resourceCategories: { value: number, viewValue: string }[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateResourceDialogComponent>
  ) {
    this.resourceForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.resourceCategories = Object.keys(ResourceCategory)
      .filter(key => !isNaN(Number(ResourceCategory[key as any])))
      .map(key => ({
        value: Number(ResourceCategory[key as any]),
        viewValue: key
      }));
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.resourceForm.valid) {
      this.dialogRef.close(this.resourceForm.value);
    }
  }
}
