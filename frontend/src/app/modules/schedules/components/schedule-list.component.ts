import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ScheduleService } from '../services/schedule.service';
import { Schedule, ScheduleFilter } from '../models/schedule.model';

@Component({
  selector: 'app-schedule-list',
  template: `
    <div class="schedule-list-container">
      <h2>Schedules</h2>
      
      <!-- Filter Form -->
      <form [formGroup]="filterForm" class="filter-form">
        <div class="filter-row">
          <div class="filter-group">
            <label for="filterStaffId">Staff ID</label>
            <input
              type="text"
              id="filterStaffId"
              formControlName="staffId"
              placeholder="Filter by staff ID"
              class="form-control"
            />
          </div>
          
          <div class="filter-group">
            <label for="filterDate">Date</label>
            <input
              type="date"
              id="filterDate"
              formControlName="date"
              class="form-control"
            />
          </div>
          
          <div class="filter-group">
            <label for="filterActive">Status</label>
            <select id="filterActive" formControlName="isActive" class="form-control">
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          
          <div class="filter-actions">
            <button type="button" (click)="applyFilters()" class="btn btn-primary">
              Filter
            </button>
            <button type="button" (click)="clearFilters()" class="btn btn-secondary">
              Clear
            </button>
          </div>
        </div>
      </form>

      <!-- Loading State -->
      <div class="loading" *ngIf="isLoading">
        Loading schedules...
      </div>

      <!-- Error State -->
      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <!-- Schedules Table -->
      <div class="table-container" *ngIf="!isLoading && !errorMessage">
        <table class="schedules-table" *ngIf="schedules.length > 0; else noSchedules">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Interval</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let schedule of schedules" [class.inactive]="!schedule.isActive">
              <td>{{ schedule.staffId }}</td>
              <td>{{ formatDate(schedule.date) }}</td>
              <td>{{ schedule.startTime }}</td>
              <td>{{ schedule.endTime }}</td>
              <td>{{ schedule.interval }} min</td>
              <td>
                <span class="status-badge" [class.active]="schedule.isActive" [class.inactive]="!schedule.isActive">
                  {{ schedule.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button
                    (click)="viewSlots(schedule)"
                    class="btn btn-sm btn-info"
                    title="View Slots"
                  >
                    View Slots
                  </button>
                  <button
                    (click)="deleteSchedule(schedule)"
                    class="btn btn-sm btn-danger"
                    title="Delete Schedule"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <ng-template #noSchedules>
          <div class="no-data">
            <p>No schedules found.</p>
            <p>Create a new schedule to get started.</p>
          </div>
        </ng-template>
      </div>

      <!-- Schedule Count -->
      <div class="schedule-count" *ngIf="schedules.length > 0">
        Total: {{ schedules.length }} schedule(s)
      </div>
    </div>
  `,
  styles: [`
    .schedule-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .filter-form {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .filter-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 16px;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
    }

    .filter-actions {
      display: flex;
      gap: 8px;
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
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .btn-info {
      background-color: #17a2b8;
      color: white;
    }

    .btn-info:hover {
      background-color: #138496;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 4px;
      border: 1px solid #f5c6cb;
      margin-bottom: 20px;
    }

    .table-container {
      overflow-x: auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .schedules-table {
      width: 100%;
      border-collapse: collapse;
    }

    .schedules-table th,
    .schedules-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    .schedules-table th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }

    .schedules-table tr:hover {
      background-color: #f8f9fa;
    }

    .schedules-table tr.inactive {
      opacity: 0.6;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.active {
      background-color: #d4edda;
      color: #155724;
    }

    .status-badge.inactive {
      background-color: #f8d7da;
      color: #721c24;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .schedule-count {
      margin-top: 16px;
      text-align: right;
      color: #666;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .filter-row {
        grid-template-columns: 1fr;
      }
      
      .filter-actions {
        justify-content: center;
      }
      
      .schedules-table {
        font-size: 12px;
      }
      
      .schedules-table th,
      .schedules-table td {
        padding: 8px 4px;
      }
    }
  `]
})
export class ScheduleListComponent implements OnInit {
  schedules: Schedule[] = [];
  filterForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService
  ) {
    this.filterForm = this.fb.group({
      staffId: [''],
      date: [''],
      isActive: ['']
    });
  }

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(filter?: ScheduleFilter): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.scheduleService.getSchedules(filter).subscribe({
      next: (schedules) => {
        this.schedules = schedules;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Error loading schedules: ${error.message}`;
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const formValue = this.filterForm.value;
    const filter: ScheduleFilter = {};

    if (formValue.staffId?.trim()) {
      filter.staffId = formValue.staffId.trim();
    }
    if (formValue.date) {
      filter.date = formValue.date;
    }
    if (formValue.isActive !== '') {
      filter.isActive = formValue.isActive === 'true';
    }

    this.loadSchedules(filter);
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.loadSchedules();
  }

  viewSlots(schedule: Schedule): void {
    if (schedule._id) {
      // This would typically navigate to a slots view or open a modal
      // For now, we'll just log the action
      console.log('View slots for schedule:', schedule);
      alert(`View slots functionality would be implemented here for ${schedule.staffId} on ${this.formatDate(schedule.date)}`);
    }
  }

  deleteSchedule(schedule: Schedule): void {
    if (schedule._id && confirm(`Are you sure you want to delete the schedule for ${schedule.staffId}?`)) {
      this.scheduleService.deleteSchedule(schedule._id).subscribe({
        next: () => {
          this.loadSchedules();
        },
        error: (error) => {
          this.errorMessage = `Error deleting schedule: ${error.message}`;
        }
      });
    }
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  refreshList(): void {
    this.loadSchedules();
  }
}