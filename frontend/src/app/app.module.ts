import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { ScheduleFormComponent } from './modules/schedules/components/schedule-form.component';
import { ScheduleListComponent } from './modules/schedules/components/schedule-list.component';
import { SlotViewerComponent } from './modules/schedules/components/slot-viewer.component';
import { ScheduleService } from './modules/schedules/services/schedule.service';

@NgModule({
  declarations: [
    AppComponent,
    ScheduleFormComponent,
    ScheduleListComponent,
    SlotViewerComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ScheduleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }