import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '@environments/environment';
import {
  Schedule,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  ScheduleFilter,
  SlotGroup,
  ApiResponse,
  ApiError,
} from '../models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private readonly apiUrl = `${environment.apiUrl}/schedules`;

  constructor(private http: HttpClient) {}

  /**
   * Create or update a schedule
   */
  createSchedule(schedule: CreateScheduleRequest): Observable<Schedule> {
    return this.http.post<ApiResponse<Schedule>>(this.apiUrl, schedule)
      .pipe(
        timeout(environment.apiTimeout),
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get all schedules with optional filtering
   */
  getSchedules(filter?: ScheduleFilter): Observable<Schedule[]> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.staffId) {
        params = params.set('staffId', filter.staffId);
      }
      if (filter.date) {
        params = params.set('date', filter.date);
      }
      if (filter.isActive !== undefined) {
        params = params.set('isActive', filter.isActive.toString());
      }
    }

    return this.http.get<ApiResponse<Schedule[]>>(this.apiUrl, { params })
      .pipe(
        timeout(environment.apiTimeout),
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get a specific schedule by ID
   */
  getSchedule(id: string): Observable<Schedule> {
    return this.http.get<ApiResponse<Schedule>>(`${this.apiUrl}/${id}`)
      .pipe(
        timeout(environment.apiTimeout),
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update a schedule
   */
  updateSchedule(id: string, schedule: UpdateScheduleRequest): Observable<Schedule> {
    return this.http.patch<ApiResponse<Schedule>>(`${this.apiUrl}/${id}`, schedule)
      .pipe(
        timeout(environment.apiTimeout),
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Delete a schedule
   */
  deleteSchedule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        timeout(environment.apiTimeout),
        catchError(this.handleError)
      );
  }

  /**
   * Generate time slots for a specific date
   */
  generateSlots(date: string, interval: number): Observable<SlotGroup[]> {
    const params = new HttpParams().set('interval', interval.toString());
    
    return this.http.get<ApiResponse<SlotGroup[]>>(`${this.apiUrl}/${date}/slots`, { params })
      .pipe(
        timeout(environment.apiTimeout),
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      const apiError = error.error as ApiError;
      if (apiError && apiError.message) {
        if (typeof apiError.message === 'string') {
          errorMessage = apiError.message;
        } else if (typeof apiError.message === 'object') {
          errorMessage = JSON.stringify(apiError.message);
        }
      } else {
        errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }

    console.error('Schedule Service Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  };
}