import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from '../services/schedule.service';
import { CreateScheduleRequest } from '../models/schedule.model';

@Component({
  selector: 'app-schedule-form',
  template: `
    <div class="schedule-form-container">
      <h2>Create Schedule</h2>
      
      <form [formGroup]="scheduleForm" (ngSubmit)="onSubmit()" class="schedule-form">
        <div class="form-group">
          <label for="staffId">Staff ID *</label>
          <input
            type="text"
            id="staffId"
            formControlName="staffId"
            placeholder="e.g., STAFF001"
            class="form-control"
            [class.error]="isFieldInvalid('staffId')"
          />
          <div class="error-message" *ngIf="isFieldInvalid('staffId')">
            Staff ID is required
          </div>
        </div>

        <div class="form-group">
          <label for="date">Date *</label>
          <input
            type="date"
            id="date"
            formControlName="date"
            class="form-control"
            [class.error]="isFieldInvalid('date')"
          />
          <div class="error-message" *ngIf="isFieldInvalid('date')">
            Date is required
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="startTime">Start Time *</label>
            <input
              type="time"
              id="startTime"
              formControlName="startTime"
              class="form-control"
              [class.error]="isFieldInvalid('startTime')"
            />
            <div class="error-message" *ngIf="isFieldInvalid('startTime')">
              Start time is required
            </div>
          </div>

          <div class="form-group">
            <label for="endTime">End Time *</label>
            <input
              type="time"
              id="endTime"
              formControlName="endTime"
              class="form-control"
              [class.error]="isFieldInvalid('endTime')"
            />
            <div class="error-message" *ngIf="isFieldInvalid('endTime')">
              End time is required
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="interval">Interval (minutes) *</label>
          <select
            id="interval"
            formControlName="interval"
            class="form-control"
            [class.error]="isFieldInvalid('interval')"
          >
            <option value="">Select interval</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
            <option value="120">120 minutes</option>
          </select>
          <div class="error-message" *ngIf="isFieldInvalid('interval')">
            Interval is required
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              formControlName="isActive"
              class="checkbox"
            />
            Active Schedule
          </label>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            [disabled]="scheduleForm.invalid || isSubmitting"
            class="btn btn-primary"
          >
            {{ isSubmitting ? 'Creating...' : 'Create Schedule' }}
          </button>
          
          <button
            type="button"
            (click)="resetForm()"
            class="btn btn-secondary"
          >
            Reset
          </button>
        </div>
      </form>

      <div class="message" *ngIf="message" [class]="messageType">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .schedule-form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
      text-align: center;
    }

    .schedule-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    label {
      font-weight: 600;
      margin-bottom: 4px;
      color: #555;
    }

    .form-control {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }

    .form-control.error {
      border-color: #dc3545;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .checkbox {
      width: 16px;
      height: 16px;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .message {
      margin-top: 16px;
      padding: 12px;
      border-radius: 4px;
      text-align: center;
    }

    .message.success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .message.error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ScheduleFormComponent {
  @Output() scheduleCreated = new EventEmitter<void>();

  scheduleForm: FormGroup;
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService
  ) {
    this.scheduleForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      staffId: ['', [Validators.required]],
      date: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      interval: ['', [Validators.required]],
      isActive: [true]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.scheduleForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.scheduleForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.message = '';

      const formValue = this.scheduleForm.value;
      const scheduleRequest: CreateScheduleRequest = {
        staffId: formValue.staffId.trim(),
        date: formValue.date,
        startTime: formValue.startTime,
        endTime: formValue.endTime,
        interval: Number(formValue.interval),
        isActive: formValue.isActive
      };

      this.scheduleService.createSchedule(scheduleRequest).subscribe({
        next: (schedule) => {
          this.message = `Schedule created successfully for ${schedule.staffId}`;
          this.messageType = 'success';
          this.resetForm();
          this.scheduleCreated.emit();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.message = `Error creating schedule: ${error.message}`;
          this.messageType = 'error';
          this.isSubmitting = false;
        }
      });
    }
  }

  resetForm(): void {
    this.scheduleForm.reset({
      isActive: true
    });
    this.message = '';
  }
}