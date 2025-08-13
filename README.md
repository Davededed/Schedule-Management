# Schedule Management System

Schedule and Slot Management system built with NestJS (backend) and Angular (frontend). This system provides robust APIs for managing staff schedules and generating time slots with advanced error handling and scalable architecture.

### Backend (NestJS + MongoDB)
- **Clean Architecture**: Modular structure with separation of concerns
- **Enterprise Patterns**: DTOs, Services, Controllers, Schemas, Interfaces
- **Advanced Error Handling**: Global exception filters and validation pipes
- **API Documentation**: Swagger/OpenAPI integration
- **Database**: MongoDB with Mongoose ODM


### Backend APIs
1. **Schedule Management**
   - `GET /schedules` - Retrieve schedules with optional filters
   - `POST /schedules` - Create or update staff schedules
   - `GET /schedules/:id` - Get specific schedule
   - `PATCH /schedules/:id` - Update schedule
   - `DELETE /schedules/:id` - Delete schedule

2. **Slot Generation**
   - `GET /schedules/:date/slots?interval=X` - Generate time slots for a date
   - Automatic overlap detection and conflict resolution
   - Configurable time intervals (15, 30, 60+ minutes)

### Frontend Features
1. **Schedule Creation Form**
   - Staff ID, date, time range, and interval selection
   - Real-time validation and error handling
   - Success/error feedback

2. **Schedule List View**
   - Filterable schedule display
   - Search by staff ID, date, and status
   - Delete functionality

3. **Slot Viewer**
   - Visual time slot generation
   - Available/unavailable slot indicators
   - Summary statistics


### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (v5.0+ recommended)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/schedule-management
   FRONTEND_URL=http://localhost:4200
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Start the backend server**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

6. **Verify backend is running**
   - API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api/docs

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:4200

## 🧪 Testing the System

### Manual Testing Steps

1. **Create a Schedule**
   - Go to "Create Schedule" tab
   - Fill in: Staff ID (e.g., "STAFF001"), Date, Start Time (e.g., "09:00"), End Time (e.g., "17:00"), Interval (e.g., 30 minutes)
   - Click "Create Schedule"

2. **View Schedules**
   - Go to "View Schedules" tab
   - Use filters to search by staff ID or date
   - Verify schedule appears in the list

3. **Generate Time Slots**
   - Go to "Generate Slots" tab
   - Select the same date used in step 1
   - Choose an interval (e.g., 30 minutes)
   - Click "Generate Slots"
   - Verify time slots are displayed

### API Testing with curl

```bash
# Create a schedule
curl -X POST http://localhost:3000/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "staffId": "STAFF001",
    "date": "2024-01-15",
    "startTime": "09:00",
    "endTime": "17:00",
    "interval": 30
  }'

# Get all schedules
curl http://localhost:3000/schedules

# Get schedules for specific staff
curl "http://localhost:3000/schedules?staffId=STAFF001"

# Generate slots for a date
curl "http://localhost:3000/schedules/2024-01-15/slots?interval=30"
```

## 🔧 Configuration

### Backend Configuration

**Environment Variables:**
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment mode (development/production)
- `FRONTEND_URL`: Frontend URL for CORS

**Database Indexes:**
- Compound index on `staffId` and `date` for efficient queries
- Individual indexes on `staffId`, `date`, and `isActive`

### Frontend Configuration

**Environment Files:**
- `src/environments/environment.ts` - Development config
- `src/environments/environment.prod.ts` - Production config

## 📊 Slot Generation Logic

The system implements sophisticated slot generation with the following features:

1. **Time Slot Creation**
   - Divides schedule time range into equal intervals
   - Handles edge cases (partial slots at end of range)
   - Validates time ranges and intervals

2. **Conflict Resolution**
   - Detects overlapping time slots from multiple schedules
   - Marks conflicting slots as unavailable
   - Preserves staff assignment for non-conflicting slots

3. **Validation Rules**
   - Start time must be before end time
   - Interval must be between 1-1440 minutes
   - Schedule duration cannot exceed 24 hours
   - Time format validation (HH:MM)

### Common Issues

1. **MongoDB Connection Error**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution**: Ensure MongoDB is running and accessible

2. **CORS Error in Frontend**
   ```
   Access to XMLHttpRequest blocked by CORS policy
   ```
   **Solution**: Verify backend CORS configuration includes frontend URL

3. **Validation Errors**
   ```
   Bad Request: Validation failed
   ```
   **Solution**: Check API request format matches DTO requirements

4. **Port Already in Use**
   ```
   Error: listen EADDRINUSE :::3000
   ```
   **Solution**: Change port in environment variables or kill existing process

### Debug Mode

**Backend Debug:**
```bash
npm run start:debug
```

**Frontend Debug:**
```bash
ng serve --source-map
```

## 📝 API Documentation

Complete API documentation is available at:
- **Swagger UI**: http://localhost:3000/api/docs (when backend is running)
- **OpenAPI JSON**: http://localhost:3000/api/docs-json
