import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from '../services/schedule.service';
import { SlotGroup, TimeSlot } from '../models/schedule.model';

@Component({
  selector: 'app-slot-viewer',
  template: `
    <div class="slot-viewer-container">
      <h2>Time Slot Generator</h2>
      
      <!-- Slot Generation Form -->
      <form [formGroup]="slotForm" (ngSubmit)="generateSlots()" class="slot-form">
        <div class="form-row">
          <div class="form-group">
            <label for="slotDate">Date *</label>
            <input
              type="date"
              id="slotDate"
              formControlName="date"
              class="form-control"
              [class.error]="isFieldInvalid('date')"
            />
            <div class="error-message" *ngIf="isFieldInvalid('date')">
              Date is required
            </div>
          </div>

          <div class="form-group">
            <label for="slotInterval">Interval (minutes) *</label>
            <select
              id="slotInterval"
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

          <div class="form-actions">
            <button
              type="submit"
              [disabled]="slotForm.invalid || isGenerating"
              class="btn btn-primary"
            >
              {{ isGenerating ? 'Generating...' : 'Generate Slots' }}
            </button>
          </div>
        </div>
      </form>

      <!-- Loading State -->
      <div class="loading" *ngIf="isGenerating">
        Generating time slots...
      </div>

      <!-- Error State -->
      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <!-- Slot Groups Display -->
      <div class="slot-groups" *ngIf="slotGroups.length > 0 && !isGenerating">
        <div class="slot-group" *ngFor="let group of slotGroups">
          <h3 class="group-date">{{ formatDate(group.date) }}</h3>
          
          <div class="slots-summary">
            <div class="summary-item">
              <span class="label">Total Slots:</span>
              <span class="value">{{ group.slots.length }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Available:</span>
              <span class="value available">{{ getAvailableCount(group.slots) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Unavailable:</span>
              <span class="value unavailable">{{ getUnavailableCount(group.slots) }}</span>
            </div>
          </div>

          <div class="slots-container" *ngIf="group.slots.length > 0; else noSlots">
            <div class="slots-grid">
              <div
                *ngFor="let slot of group.slots"
                class="slot-card"
                [class.available]="slot.isAvailable"
                [class.unavailable]="!slot.isAvailable"
              >
                <div class="slot-time">
                  {{ slot.startTime }} - {{ slot.endTime }}
                </div>
                <div class="slot-status">
                  <span class="status-indicator" [class.available]="slot.isAvailable" [class.unavailable]="!slot.isAvailable">
                    {{ slot.isAvailable ? 'Available' : 'Unavailable' }}
                  </span>
                </div>
                <div class="slot-staff" *ngIf="slot.staffId">
                  Staff: {{ slot.staffId }}
                </div>
              </div>
            </div>
          </div>

          <ng-template #noSlots>
            <div class="no-slots">
              <p>No time slots available for this date.</p>
              <p>Make sure there are active schedules for the selected date.</p>
            </div>
          </ng-template>
        </div>
      </div>

      <!-- No Results State -->
      <div class="no-results" *ngIf="slotGroups.length === 0 && !isGenerating && !errorMessage && hasSearched">
        <p>No slots found for the selected criteria.</p>
        <p>Try selecting a different date or check if there are active schedules.</p>
      </div>
    </div>
  `,
  styles: [`
    .slot-viewer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
      text-align: center;
    }

    .slot-form {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 20px;
      align-items: end;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    label {
      font-weight: 600;
      margin-bottom: 4px;
      color: #555;
    }

    .form-control {
      padding: 10px 12px;
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

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
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

    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
      font-style: italic;
    }

    .slot-groups {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .slot-group {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .group-date {
      color: #333;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #007bff;
    }

    .slots-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .summary-item .label {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }

    .summary-item .value {
      font-size: 18px;
      font-weight: 600;
    }

    .summary-item .value.available {
      color: #28a745;
    }

    .summary-item .value.unavailable {
      color: #dc3545;
    }

    .slots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }

    .slot-card {
      border: 2px solid #ddd;
      border-radius: 6px;
      padding: 12px;
      text-align: center;
      transition: all 0.3s;
    }

    .slot-card.available {
      border-color: #28a745;
      background-color: #f8fff9;
    }

    .slot-card.unavailable {
      border-color: #dc3545;
      background-color: #fff8f8;
    }

    .slot-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .slot-time {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 8px;
      color: #333;
    }

    .slot-status {
      margin-bottom: 8px;
    }

    .status-indicator {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-indicator.available {
      background-color: #d4edda;
      color: #155724;
    }

    .status-indicator.unavailable {
      background-color: #f8d7da;
      color: #721c24;
    }

    .slot-staff {
      font-size: 12px;
      color: #666;
      font-style: italic;
    }

    .no-slots,
    .no-results {
      text-align: center;
      padding: 40px;
      color: #666;
      background: #f8f9fa;
      border-radius: 8px;
      border: 2px dashed #ddd;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .slots-grid {
        grid-template-columns: 1fr;
      }
      
      .slots-summary {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SlotViewerComponent {
  slotForm: FormGroup;
  slotGroups: SlotGroup[] = [];
  isGenerating = false;
  errorMessage = '';
  hasSearched = false;

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService
  ) {
    this.slotForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      date: ['', [Validators.required]],
      interval: ['', [Validators.required]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.slotForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  generateSlots(): void {
    if (this.slotForm.valid && !this.isGenerating) {
      this.isGenerating = true;
      this.errorMessage = '';
      this.hasSearched = true;

      const formValue = this.slotForm.value;
      const date = formValue.date;
      const interval = Number(formValue.interval);

      this.scheduleService.generateSlots(date, interval).subscribe({
        next: (slotGroups) => {
          this.slotGroups = slotGroups;
          this.isGenerating = false;
        },
        error: (error) => {
          this.errorMessage = `Error generating slots: ${error.message}`;
          this.slotGroups = [];
          this.isGenerating = false;
        }
      });
    }
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getAvailableCount(slots: TimeSlot[]): number {
    return slots.filter(slot => slot.isAvailable).length;
  }

  getUnavailableCount(slots: TimeSlot[]): number {
    return slots.filter(slot => !slot.isAvailable).length;
  }
}