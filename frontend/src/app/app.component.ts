import { Component, ViewChild } from '@angular/core';
import { ScheduleListComponent } from './modules/schedules/components/schedule-list.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Schedule Management System</h1>
        <p>Schedule and Slot Management</p>
      </header>

      <nav class="app-nav">
        <button
          (click)="activeTab = 'create'"
          [class.active]="activeTab === 'create'"
          class="nav-button"
        >
          Create Schedule
        </button>
        <button
          (click)="activeTab = 'list'"
          [class.active]="activeTab === 'list'"
          class="nav-button"
        >
          View Schedules
        </button>
        <button
          (click)="activeTab = 'slots'"
          [class.active]="activeTab === 'slots'"
          class="nav-button"
        >
          Generate Slots
        </button>
      </nav>

      <main class="app-main">
        <div class="tab-content">
          <!-- Create Schedule Tab -->
          <div *ngIf="activeTab === 'create'" class="tab-panel">
            <app-schedule-form (scheduleCreated)="onScheduleCreated()"></app-schedule-form>
          </div>

          <!-- Schedule List Tab -->
          <div *ngIf="activeTab === 'list'" class="tab-panel">
            <app-schedule-list #scheduleList></app-schedule-list>
          </div>

          <!-- Slot Viewer Tab -->
          <div *ngIf="activeTab === 'slots'" class="tab-panel">
            <app-slot-viewer></app-slot-viewer>
          </div>
        </div>
      </main>

      <footer class="app-footer">
        <p>&copy; 2024 Schedule Management System. Built with Angular & NestJS.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;
    }

    .app-header {
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .app-header h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
    }

    .app-header p {
      margin: 0;
      opacity: 0.9;
      font-size: 16px;
    }

    .app-nav {
      background: white;
      padding: 0;
      display: flex;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-bottom: 1px solid #dee2e6;
    }

    .nav-button {
      background: none;
      border: none;
      padding: 16px 24px;
      font-size: 14px;
      font-weight: 600;
      color: #666;
      cursor: pointer;
      transition: all 0.3s;
      border-bottom: 3px solid transparent;
    }

    .nav-button:hover {
      background-color: #f8f9fa;
      color: #007bff;
    }

    .nav-button.active {
      color: #007bff;
      border-bottom-color: #007bff;
      background-color: #f8f9fa;
    }

    .app-main {
      flex: 1;
      padding: 20px;
    }

    .tab-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .tab-panel {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .app-footer {
      background: #343a40;
      color: white;
      text-align: center;
      padding: 16px;
      margin-top: auto;
    }

    .app-footer p {
      margin: 0;
      font-size: 14px;
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .app-header h1 {
        font-size: 24px;
      }
      
      .app-header p {
        font-size: 14px;
      }
      
      .app-nav {
        flex-direction: column;
      }
      
      .nav-button {
        padding: 12px 16px;
        border-bottom: 1px solid #dee2e6;
        border-right: none;
      }
      
      .nav-button.active {
        border-bottom-color: #dee2e6;
        border-left: 3px solid #007bff;
      }
      
      .app-main {
        padding: 16px;
      }
    }
  `]
})
export class AppComponent {
  @ViewChild('scheduleList') scheduleList!: ScheduleListComponent;
  
  activeTab: 'create' | 'list' | 'slots' = 'create';

  onScheduleCreated(): void {
    // Switch to list tab and refresh the list
    this.activeTab = 'list';
    // Use setTimeout to ensure the view is rendered before calling refresh
    setTimeout(() => {
      if (this.scheduleList) {
        this.scheduleList.refreshList();
      }
    }, 100);
  }
}