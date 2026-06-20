# Yalini Mobile — Backend Development Guide

> **Comprehensive architecture analysis, API specification, and backend integration instructions**
> for the [yalini_mobile-UI](https://github.com/sathiyan-sk/yalini_mobile-UI.git) React Native frontend.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [App Architecture](#2-app-architecture)
3. [Domain Model & Entity Relationships](#3-domain-model--entity-relationships)
4. [Mock Service Layer Analysis](#4-mock-service-layer-analysis)
5. [Frontend-Backend Connectivity Format](#5-frontend-backend-connectivity-format)
6. [Complete API Specification](#6-complete-api-specification)
7. [PostgreSQL Database Schema](#7-postgresql-database-schema)
8. [Backend Project Structure (Fastify + PostgreSQL)](#8-backend-project-structure-fastify--postgresql)
9. [Implementation Guide — Step by Step](#9-implementation-guide--step-by-step)
10. [Backend Wiring in Frontend — Migration Steps](#10-backend-wiring-in-frontend--migration-steps)
11. [Seed Data Reference](#11-seed-data-reference)
12. [Appendix — Type Definitions](#12-appendix--type-definitions)

---

## 1. Project Overview

| Item | Value |
| --- | --- |
| **App Name** | Yalini Mobile |
| **Purpose** | Multi-role business operations admin (Taxi + Water Delivery management) |
| **Frontend** | React Native (Expo SDK 54), TypeScript ~5.9 |
| **Routing** | React Navigation v7 (Bottom Tabs + Native Stacks) |
| **Current State** | UI-only — all data served from in-memory mock service layer |
| **Target Backend** | Node.js + Fastify + PostgreSQL |
| **Backend Status** | Not wired yet — `EXPO_PUBLIC_BACKEND_URL` env var is present and ready |

### What the App Does

Yalini Mobile is a business operations management app for two types of businesses:

- **Taxi Business** — Manage vehicles, assign drivers, track daily trip records
- **Water Delivery Business** — Manage hotels (delivery points), assign delivery persons, track daily delivery records

The admin can:
- Create/manage businesses (taxi or water delivery)
- Create/manage employees (drivers or delivery persons)
- Create/manage vehicles (for taxi) and hotels (for water delivery)
- Assign assets (vehicles/hotels) to employees
- View a dashboard with business metrics and daily submissions
- View detailed daily records (trips for taxi, deliveries for water)

---

## 2. App Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT NATIVE (Expo)                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    SCREENS                           │    │
│  │  Dashboard │ Records │ Employees │ Settings          │    │
│  │  + nested: MyBusiness, Vehicles, Hotels, AssignAssets│    │
│  └───────────────┬──────────────────────────────────────┘    │
│                  │ use data via hooks                        │
│  ┌───────────────▼──────────────────────────────────────┐    │
│  │                    HOOKS                              │    │
│  │  useDashboard │ useBusinesses │ useEmployees          │    │
│  │  useVehicles  │ useHotels     │ useRecords            │    │
│  │  (in-memory cache + listener fan-out pattern)         │    │
│  └───────────────┬──────────────────────────────────────┘    │
│                  │ call service functions                    │
│  ┌───────────────▼──────────────────────────────────────┐    │
│  │                  SERVICES                             │    │
│  │  businessService │ employeeService │ vehicleService   │    │
│  │  hotelService    │ recordsService  │ dashboardService │    │
│  │                                                       │    │
│  │  ┌─────────────────────────────────────────────┐      │    │
│  │  │   TODAY: Mock Data Store (in-memory)        │      │    │
│  │  │   TOMORROW: fetch() → Backend API           │      │    │
│  │  └─────────────────────────────────────────────┘      │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                    (after wiring)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                BACKEND (Fastify + Node.js)                   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    ROUTES                             │   │
│  │  /api/businesses │ /api/employees │ /api/vehicles     │   │
│  │  /api/hotels     │ /api/records   │ /api/dashboard    │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                       │
│  ┌──────────────────▼───────────────────────────────────┐   │
│  │                  CONTROLLERS                          │   │
│  │  (business logic, validation, error handling)         │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                       │
│  ┌──────────────────▼───────────────────────────────────┐   │
│  │              DATA ACCESS LAYER                        │   │
│  │  (SQL queries via pg / knex / prisma)                 │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                       │
│  ┌──────────────────▼───────────────────────────────────┐   │
│  │                 PostgreSQL                            │   │
│  │  businesses │ employees │ vehicles │ hotels           │   │
│  │  driver_records │ water_delivery_records │ trips      │   │
│  │  hotel_deliveries                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Navigation Architecture

```
RootNavigator (Bottom Tabs)
├── Dashboard Tab ─────── DashboardScreen
├── DailyRecords Tab ──── RecordsNavigator (Native Stack)
│   ├── RecordsHome
│   ├── TaxiRecordDetails  { recordId: string }
│   └── WaterRecordDetails { recordId: string }
├── Employees Tab ─────── EmployeesNavigator (Native Stack)
│   ├── EmployeesList
│   ├── AddEmployee
│   └── EditEmployee       { employeeId: string }
└── Settings Tab ──────── SettingsNavigator (Native Stack)
    ├── SettingsHome
    ├── MyBusiness (list)
    ├── AddBusiness
    ├── EditBusiness         { businessId: string }
    ├── Vehicles ──────────── VehiclesNavigator (Nested Stack)
    │   ├── AllVehicles
    │   ├── AddVehicle
    │   └── EditVehicle      { vehicleId: string }
    ├── Hotels ────────────── HotelsNavigator (Nested Stack)
    │   ├── AllHotels
    │   ├── AddHotel
    │   └── EditHotel        { hotelId: string }
    ├── AssignAssets (list)
    └── AssignAsset           { employeeId?, assetType? }
```

### 2.3 Roles (Prepared but Not Implemented)

The app has scaffolded navigators for three roles (files exist but are empty):
- **Admin** — Full access (currently the only active role)
- **Driver** — Taxi driver view (future)
- **Staff** — Water delivery staff view (future)

---

## 3. Domain Model & Entity Relationships

### 3.1 Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐
│   BUSINESS   │──1:N──│   EMPLOYEE   │
│              │       │              │
│ type: taxi   │       │ businessId   │
│ type: water  │       │ businessType │
│ mode: auto   │       │ pin (4-digit)│
│   / manual   │       │              │
└──────────────┘       └──────┬───────┘
                              │
                    ┌─────────┼─────────┐
                    │                   │
               (if taxi)          (if water)
                    │                   │
              ┌─────▼─────┐      ┌──────▼─────┐
              │  VEHICLE   │      │   HOTEL    │
              │            │      │            │
              │ assignedTo │      │ assignedTo │
              │ Employee   │      │ Employee   │
              │            │      │ ratePerCan │
              └─────┬──────┘      └──────┬─────┘
                    │                    │
              ┌─────▼──────┐      ┌──────▼─────────────┐
              │  DRIVER    │      │ WATER DELIVERY      │
              │  RECORD    │      │ RECORD              │
              │ (daily)    │      │ (daily)             │
              │            │      │                     │
              │ trips[]    │      │ hotelDeliveries[]   │
              └────────────┘      └─────────────────────┘
```

### 3.2 Data Relationships Summary

| Parent | Child | Relationship | Foreign Key |
| --- | --- | --- | --- |
| Business | Employee | 1 Business → N Employees | `employee.businessId` |
| Employee | Vehicle | 1 Employee → 1 Vehicle (taxi only) | `vehicle.assignedEmployeeId` |
| Employee | Hotel | 1 Employee → N Hotels (water only) | `hotel.assignedEmployeeId` |
| Employee + Vehicle | DriverRecord | 1 per day per driver | `record.employeeId`, `record.vehicleId` |
| DriverRecord | TripDetail | 1 Record → N Trips | Nested / `trip.recordId` |
| Employee | WaterDeliveryRecord | 1 per day per delivery person | `record.employeeId` |
| WaterDeliveryRecord | HotelDelivery | 1 Record → N Hotel Deliveries | Nested / `delivery.recordId` |

### 3.3 Business Type Constraints

| Business Type | Assets | Records Type | Key Metrics |
| --- | --- | --- | --- |
| `taxi` | Vehicles | DriverRecord (trips) | income, expense, profit, trips, perKmRate, fuelExpense |
| `water_delivery` | Hotels | WaterDeliveryRecord (deliveries) | totalCans, deliveredCans, returnedCans, outstandingCans, income, expense, profit |

### 3.4 Business Mode

| Mode | Description |
| --- | --- |
| `auto` | Employees can self-select their business assets (Vehicle/Hotel) |
| `manual` | Admin assigns business assets to employees |

---

## 4. Mock Service Layer Analysis

The frontend uses a well-structured mock service layer designed for easy backend migration. Here's the architecture:

### 4.1 Layer Overview

```
src/services/
├── mockData/
│   ├── index.ts          # Central in-memory store + all CRUD operations
│   ├── seedData.ts       # Initial seed data with proper relationships
│   └── types.ts          # Unified types (source of truth)
├── businessService.ts    # Business domain service (wraps mockData)
├── employeeService.ts    # Employee domain service
├── vehicleService.ts     # Vehicle domain service
├── hotelService.ts       # Hotel domain service
├── recordsService.ts     # Records domain service (taxi + water)
└── dashboardService.ts   # Dashboard aggregation service
```

### 4.2 How the Mock Layer Works

1. **Central Store** (`mockData/index.ts`):
   - In-memory `store` object holds all entity arrays
   - All CRUD operations are `async` and simulate network latency (150ms)
   - Maintains data relationships (e.g., deleting an employee updates business count)

2. **Service Layer** (e.g., `businessService.ts`):
   - Thin wrapper around mock store operations
   - Converts mock types to domain types
   - **This is the layer you replace with API calls**

3. **Hooks** (e.g., `useBusinesses.ts`):
   - Module-scoped in-memory cache + listener fan-out pattern
   - Provides `loading`, `refresh`, CRUD methods
   - UI never calls services directly — always through hooks
   - **Do NOT modify hooks** — they consume services via the same function signatures

### 4.3 Migration Strategy (Mock → Real API)

The services are designed for a clean swap. Each service file has comments like:

```typescript
// businessService.ts
// TODAY:
const businesses = await getBusinesses();  // reads from in-memory store

// TOMORROW — replace with:
const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/businesses`);
if (!res.ok) throw new Error(\"Failed to fetch businesses\");
return (await res.json()) as Business[];
```

**Key migration principle**: Replace the **body** of each service function, keep the **signature** (parameters + return type) identical.

### 4.4 Mock Operations Mapped to API Endpoints

| Mock Store Operation | HTTP Method | API Endpoint | Service File |
| --- | --- | --- | --- |
| `getBusinesses()` | GET | `/api/businesses` | `businessService.ts` |
| `getBusinessById(id)` | GET | `/api/businesses/:id` | `businessService.ts` |
| `createBusiness(data)` | POST | `/api/businesses` | `businessService.ts` |
| `updateBusiness(id, data)` | PUT | `/api/businesses/:id` | `businessService.ts` |
| `deleteBusiness(id)` | DELETE | `/api/businesses/:id` | `businessService.ts` |
| `getEmployees()` | GET | `/api/employees` | `employeeService.ts` |
| `getEmployeesByBusinessId(bizId)` | GET | `/api/employees?businessId=:id` | `employeeService.ts` |
| `getEmployeesByBusinessType(type)` | GET | `/api/employees?businessType=:type` | `employeeService.ts` |
| `createEmployee(data)` | POST | `/api/employees` | `employeeService.ts` |
| `updateEmployee(id, data)` | PUT | `/api/employees/:id` | `employeeService.ts` |
| `deleteEmployee(id)` | DELETE | `/api/employees/:id` | `employeeService.ts` |
| `getVehicles()` | GET | `/api/vehicles` | `vehicleService.ts` |
| `getVehicleById(id)` | GET | `/api/vehicles/:id` | `vehicleService.ts` |
| `createVehicle(data)` | POST | `/api/vehicles` | `vehicleService.ts` |
| `updateVehicle(id, data)` | PUT | `/api/vehicles/:id` | `vehicleService.ts` |
| `deleteVehicle(id)` | DELETE | `/api/vehicles/:id` | `vehicleService.ts` |
| `assignEmployeeToVehicle(vId, eId, name)` | POST | `/api/vehicles/:id/assign` | `vehicleService.ts` |
| `unassignEmployeeFromVehicle(vId)` | POST | `/api/vehicles/:id/unassign` | `vehicleService.ts` |
| `getHotels()` | GET | `/api/hotels` | `hotelService.ts` |
| `getHotelById(id)` | GET | `/api/hotels/:id` | `hotelService.ts` |
| `createHotel(data)` | POST | `/api/hotels` | `hotelService.ts` |
| `updateHotel(id, data)` | PUT | `/api/hotels/:id` | `hotelService.ts` |
| `deleteHotel(id)` | DELETE | `/api/hotels/:id` | `hotelService.ts` |
| `assignEmployeeToHotel(hId, eId, name)` | POST | `/api/hotels/:id/assign` | `hotelService.ts` |
| `unassignEmployeeFromHotel(hId)` | POST | `/api/hotels/:id/unassign` | `hotelService.ts` |
| `getDriverRecords()` | GET | `/api/records/driver` | `recordsService.ts` |
| `getDriverRecordById(id)` | GET | `/api/records/driver/:id` | `recordsService.ts` |
| `getDriverRecordsByDate(date)` | GET | `/api/records/driver?date=:date` | `recordsService.ts` |
| `getWaterDeliveryRecords()` | GET | `/api/records/water` | `recordsService.ts` |
| `getWaterDeliveryRecordById(id)` | GET | `/api/records/water/:id` | `recordsService.ts` |
| `getWaterDeliveryRecordsByDate(date)` | GET | `/api/records/water?date=:date` | `recordsService.ts` |
| `getBusinessesForSelector()` | GET | `/api/businesses/selector` | `recordsService.ts` |
| `fetchDashboardData(date)` | GET | `/api/dashboard?date=:date` | `dashboardService.ts` |

---

## 5. Frontend-Backend Connectivity Format

### 5.1 Environment Configuration

The frontend uses the `EXPO_PUBLIC_BACKEND_URL` environment variable for all API calls:

```env
# frontend/.env
EXPO_PUBLIC_BACKEND_URL=http://localhost:3001
```

Access in code:
```typescript
const API_BASE = process.env.EXPO_PUBLIC_BACKEND_URL;
```

### 5.2 API Call Convention

All API calls should follow this pattern in the service files:

```typescript
// Standard GET request
async function fetchResource<T>(path: string): Promise<T> {
  const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}${path}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// Standard POST/PUT request
async function mutateResource<T>(
  path: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}
```

### 5.3 Response Format Convention

All API responses should follow a consistent envelope format:

```typescript
// Success Response
{
  \"success\": true,
  \"data\": { /* entity or array */ }
}

// Error Response
{
  \"success\": false,
  \"message\": \"Human-readable error description\",
  \"code\": \"VALIDATION_ERROR\"  // optional machine-readable code
}

// List Response (with optional pagination)
{
  \"success\": true,
  \"data\": [ /* array of entities */ ],
  \"meta\": {
    \"total\": 42,
    \"page\": 1,
    \"limit\": 20
  }
}
```

### 5.4 Date Formats

- All dates in requests/responses use **ISO 8601 format**: `YYYY-MM-DD`
- The frontend's `dayjs` library handles formatting for display
- Example: `\"2026-06-10\"` (not `\"2026-06-10T00:00:00Z\"` for date-only fields)

### 5.5 Currency

- All monetary amounts are stored and transmitted as **integers** (INR)
- No decimal/float currency — frontend formats using `Intl.NumberFormat(\"en-IN\")`
- Example: `totalIncome: 4500` means ₹4,500

---

## 6. Complete API Specification

### 6.1 Businesses API

#### `GET /api/businesses`
Returns all businesses.

**Response:**
```json
{
  \"success\": true,
  \"data\": [
    {
      \"id\": \"biz_seed_city_taxi\",
      \"name\": \"City Taxi\",
      \"type\": \"taxi\",
      \"mode\": \"auto\",
      \"status\": \"enabled\",
      \"employees\": 4,
      \"createdAt\": \"2026-06-10\"
    }
  ]
}
```

#### `GET /api/businesses/:id`
Returns a single business by ID.

**Response:**
```json
{
  \"success\": true,
  \"data\": {
    \"id\": \"biz_seed_city_taxi\",
    \"name\": \"City Taxi\",
    \"type\": \"taxi\",
    \"mode\": \"auto\",
    \"status\": \"enabled\",
    \"employees\": 4,
    \"createdAt\": \"2026-06-10\"
  }
}
```

#### `GET /api/businesses/selector`
Returns businesses formatted for selector/dropdown components (only enabled businesses).

**Response:**
```json
{
  \"success\": true,
  \"data\": [
    { \"id\": \"biz_seed_city_taxi\", \"name\": \"City Taxi\", \"type\": \"taxi\" },
    { \"id\": \"biz_seed_yalini_minerals\", \"name\": \"Yalini Minerals\", \"type\": \"water\" }
  ]
}
```

> **Note**: `type` for selector returns `\"water\"` instead of `\"water_delivery\"` for frontend compatibility.

#### `POST /api/businesses`
Creates a new business.

**Request Body:**
```json
{
  \"name\": \"New Taxi Service\",
  \"type\": \"taxi\",
  \"mode\": \"auto\",
  \"status\": \"enabled\"
}
```

**Validation Rules:**
- `name`: required, non-empty string, trimmed
- `type`: required, must be `\"taxi\"` or `\"water_delivery\"`
- `mode`: required, must be `\"auto\"` or `\"manual\"`
- `status`: required, must be `\"enabled\"` or `\"disabled\"`

**Response:**
```json
{
  \"success\": true,
  \"data\": {
    \"id\": \"biz_abc123\",
    \"name\": \"New Taxi Service\",
    \"type\": \"taxi\",
    \"mode\": \"auto\",
    \"status\": \"enabled\",
    \"employees\": 0,
    \"createdAt\": \"2026-06-15\"
  }
}
```

#### `PUT /api/businesses/:id`
Updates an existing business.

**Request Body:** (same fields as POST, all optional)
```json
{
  \"name\": \"Updated Taxi Service\",
  \"type\": \"taxi\",
  \"mode\": \"manual\",
  \"status\": \"enabled\"
}
```

**Response:** Returns updated business object.

#### `DELETE /api/businesses/:id`
Deletes a business by ID.

**Response:**
```json
{ \"success\": true, \"message\": \"Business deleted\" }
```

**Side Effect:** Consider cascading — what happens to employees, vehicles, hotels, records under this business.

---

### 6.2 Employees API

#### `GET /api/employees`
Returns all employees. Supports optional query filters.

**Query Parameters:**
| Parameter | Type | Description |
| --- | --- | --- |
| `businessId` | string | Filter by business ID |
| `businessType` | `\"taxi\"` or `\"water_delivery\"` | Filter by business type |

**Response:**
```json
{
  \"success\": true,
  \"data\": [
    {
      \"id\": \"emp_seed_ramesh\",
      \"fullName\": \"Ramesh Kumar\",
      \"mobile\": \"9876543210\",
      \"businessId\": \"biz_seed_city_taxi\",
      \"businessName\": \"City Taxi\",
      \"businessType\": \"taxi\",
      \"pin\": \"1234\",
      \"status\": \"enabled\",
      \"createdAt\": \"2026-06-10\"
    }
  ]
}
```

#### `GET /api/employees/:id`
Returns a single employee by ID.

#### `POST /api/employees`
Creates a new employee.

**Request Body:**
```json
{
  \"fullName\": \"New Driver\",
  \"mobile\": \"9876543200\",
  \"businessId\": \"biz_seed_city_taxi\",
  \"pin\": \"5678\",
  \"status\": \"enabled\"
}
```

**Validation Rules:**
- `fullName`: required, non-empty, trimmed
- `mobile`: required, digits only (cleaned by frontend with `.replace(/\D/g, '')`)
- `businessId`: required, must reference existing business
- `pin`: required, exactly 4 digits
- `status`: required, `\"enabled\"` or `\"disabled\"`

**Backend Logic:**
- Look up `businessName` and `businessType` from the referenced business
- Auto-increment the `employees` count on the parent business
- Set `createdAt` to today's date

**Response:** Returns created employee with populated `businessName` and `businessType`.

#### `PUT /api/employees/:id`
Updates an existing employee.

**Request Body:** Same fields as POST. `pin` is optional on update (keeps existing if not provided).

**Backend Logic:**
- If `businessId` changes, update `businessName` and `businessType` from new business
- Handle business employee count updates if business changes

#### `DELETE /api/employees/:id`
Deletes an employee.

**Side Effects:**
- Decrement `employees` count on the parent business
- Consider unassigning from any vehicles/hotels

---

### 6.3 Vehicles API

#### `GET /api/vehicles`
Returns all vehicles.

**Response:**
```json
{
  \"success\": true,
  \"data\": [
    {
      \"id\": \"veh_seed_swift_dzire\",
      \"name\": \"Swift Dzire\",
      \"number\": \"TN01AB1234\",
      \"status\": \"enabled\",
      \"assignedDriver\": \"Ramesh Kumar\",
      \"assignedEmployeeId\": \"emp_seed_ramesh\",
      \"notes\": \"Regular maintenance completed last week\",
      \"createdAt\": \"2026-06-10\",
      \"updatedAt\": \"2026-06-15\"
    }
  ]
}
```

#### `GET /api/vehicles/:id`
Returns a single vehicle by ID.

#### `POST /api/vehicles`
Creates a new vehicle.

**Request Body:**
```json
{
  \"name\": \"Maruti Alto\",
  \"number\": \"TN01XY9999\",
  \"status\": \"enabled\",
  \"notes\": \"New addition to fleet\",
  \"assignedDriver\": \"Ajay Verma\",
  \"assignedEmployeeId\": \"emp_seed_ajay\"
}
```

**Validation Rules:**
- `name`: required, trimmed
- `number`: required, trimmed, uppercase
- `status`: required, `\"enabled\"` or `\"disabled\"`
- `notes`: optional string
- `assignedDriver`: optional string (driver name for display)
- `assignedEmployeeId`: optional string (reference to employee)

**Backend Logic:**
- Set `createdAt` and `updatedAt` to today
- Validate vehicle number uniqueness (recommended)

#### `PUT /api/vehicles/:id`
Updates an existing vehicle. Sets `updatedAt` to current date.

#### `DELETE /api/vehicles/:id`
Deletes a vehicle.

#### `POST /api/vehicles/:id/assign`
Assigns an employee (driver) to a vehicle.

**Request Body:**
```json
{
  \"employeeId\": \"emp_seed_ramesh\",
  \"employeeName\": \"Ramesh Kumar\"
}
```

**Backend Logic:**
- Sets `assignedEmployeeId` and `assignedDriver` on the vehicle
- Updates `updatedAt`

**Response:** Returns updated vehicle object.

#### `POST /api/vehicles/:id/unassign`
Removes the current driver assignment from a vehicle.

**Request Body:** None required.

**Backend Logic:**
- Sets `assignedEmployeeId` and `assignedDriver` to `null`
- Updates `updatedAt`

**Response:** Returns updated vehicle object.

---

### 6.4 Hotels API

#### `GET /api/hotels`
Returns all hotels.

**Response:**
```json
{
  \"success\": true,
  \"data\": [
    {
      \"id\": \"hotel_seed_golden_palace\",
      \"name\": \"Hotel Golden Palace\",
      \"ratePerCan\": 25,
      \"status\": \"enabled\",
      \"location\": \"MG Road, Sector 5\",
      \"assignedEmployeeId\": \"emp_seed_suresh\",
      \"assignedEmployeeName\": \"Suresh Kumar\",
      \"createdAt\": \"2026-06-10\"
    }
  ]
}
```

#### `GET /api/hotels/:id`
Returns a single hotel by ID.

#### `POST /api/hotels`
Creates a new hotel.

**Request Body:**
```json
{
  \"name\": \"New Palace Hotel\",
  \"ratePerCan\": 30,
  \"status\": \"enabled\",
  \"location\": \"Park Street, Block A\",
  \"assignedEmployeeId\": \"emp_seed_suresh\",
  \"assignedEmployeeName\": \"Suresh Kumar\"
}
```

**Validation Rules:**
- `name`: required, trimmed
- `ratePerCan`: required, positive integer
- `status`: required, `\"enabled\"` or `\"disabled\"`
- `location`: optional string
- `assignedEmployeeId`: optional
- `assignedEmployeeName`: optional

#### `PUT /api/hotels/:id`
Updates an existing hotel.

#### `DELETE /api/hotels/:id`
Deletes a hotel.

#### `POST /api/hotels/:id/assign`
Assigns an employee (delivery person) to a hotel.

**Request Body:**
```json
{
  \"employeeId\": \"emp_seed_suresh\",
  \"employeeName\": \"Suresh Kumar\"
}
```

**Response:** Returns updated hotel object.

#### `POST /api/hotels/:id/unassign`
Removes the employee assignment from a hotel.

**Response:** Returns updated hotel object.

---

### 6.5 Records API

#### `GET /api/records/driver`
Returns all driver (taxi) records.

**Query Parameters:**
| Parameter | Type | Description |
| --- | --- | --- |
| `date` | string (`YYYY-MM-DD`) | Filter records by date |

**Response:**
```json
{
  \"success\": true,
  \"data\": [
    {
      \"id\": \"rec_taxi_emp_seed_ramesh_2026-06-10\",
      \"driverName\": \"Ramesh Kumar\",
      \"employeeId\": \"emp_seed_ramesh\",
      \"vehicleId\": \"veh_seed_swift_dzire\",
      \"vehicleName\": \"Swift Dzire\",
      \"vehicleNumber\": \"TN01AB1234\",
      \"date\": \"2026-06-10\",
      \"status\": \"submitted\",
      \"avatarColor\": \"#1E88E5\",
      \"trips\": 9,
      \"totalIncome\": 4500,
      \"totalExpense\": 800,
      \"settledToAdmin\": 3150,
      \"balanceShortage\": 550,
      \"totalProfit\": 3700,
      \"perKmRate\": 16,
      \"tripDetails\": [
        {
          \"id\": \"trip-1234-0\",
          \"tripNumber\": 1,
          \"destination\": \"Airport to MG Road\",
          \"distance\": 12.5,
          \"income\": 450,
          \"expense\": 80
        }
      ],
      \"fuelExpense\": 900
    }
  ]
}
```

#### `GET /api/records/driver/:id`
Returns a single driver record by ID (includes full `tripDetails` array).

#### `GET /api/records/water`
Returns all water delivery records.

**Query Parameters:**
| Parameter | Type | Description |
| --- | --- | --- |
| `date` | string (`YYYY-MM-DD`) | Filter records by date |

**Response:**
```json
{
  \"success\": true,
  \"data\": [
    {
      \"id\": \"rec_water_emp_seed_suresh_2026-06-10\",
      \"deliveryPersonName\": \"Suresh Kumar\",
      \"employeeId\": \"emp_seed_suresh\",
      \"date\": \"2026-06-10\",
      \"status\": \"submitted\",
      \"avatarColor\": \"#1E88E5\",
      \"totalHotels\": 2,
      \"totalCans\": 50,
      \"totalDelivered\": 42,
      \"totalReturned\": 3,
      \"totalOutstanding\": 5,
      \"totalIncome\": 1150,
      \"totalExpense\": 173,
      \"totalProfit\": 977,
      \"hotelDeliveries\": [
        {
          \"id\": \"delivery-hotel_seed_golden_palace-1234\",
          \"hotelName\": \"Hotel Golden Palace\",
          \"location\": \"MG Road, Sector 5\",
          \"totalCans\": 25,
          \"deliveredCans\": 22,
          \"returnedCans\": 1,
          \"outstandingCans\": 2,
          \"income\": 550,
          \"expense\": 83,
          \"profit\": 467
        }
      ]
    }
  ]
}
```

#### `GET /api/records/water/:id`
Returns a single water delivery record by ID (includes full `hotelDeliveries` array).

---

### 6.6 Dashboard API

#### `GET /api/dashboard?date=:date`
Returns aggregated dashboard data for a specific date.

**Query Parameters:**
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `date` | string (`YYYY-MM-DD`) | Yes | Date to aggregate data for |

**Response:**
```json
{
  \"success\": true,
  \"data\": {
    \"stats\": {
      \"activeEmployees\": 6,
      \"submittedToday\": 4,
      \"pendingToday\": 2,
      \"businesses\": 2
    },
    \"businesses\": [
      {
        \"id\": \"biz_seed_city_taxi\",
        \"name\": \"City Taxi\",
        \"category\": \"Taxi\",
        \"tone\": \"purple\",
        \"icon\": { \"family\": \"ion\", \"name\": \"car-outline\" },
        \"metrics\": [
          { \"label\": \"Total Income\", \"amount\": 12500, \"color\": \"info\" },
          { \"label\": \"Total Expense's\", \"amount\": 2400, \"color\": \"error\" },
          { \"label\": \"Net Profit\", \"amount\": 10100, \"color\": \"success\" }
        ]
      },
      {
        \"id\": \"biz_seed_yalini_minerals\",
        \"name\": \"Yalini Minerals\",
        \"category\": \"Delivery\",
        \"tone\": \"blue\",
        \"icon\": { \"family\": \"feather\", \"name\": \"droplet\" },
        \"metrics\": [
          { \"label\": \"Total Income\", \"amount\": 3500, \"color\": \"info\" },
          { \"label\": \"Total Expense's\", \"amount\": 525, \"color\": \"error\" },
          { \"label\": \"Net Profit\", \"amount\": 2975, \"color\": \"success\" }
        ]
      }
    ],
    \"submissions\": [
      {
        \"id\": \"rec_taxi_emp_seed_ramesh_2026-06-10\",
        \"employeeName\": \"Ramesh Kumar\",
        \"businessName\": \"City Taxi\",
        \"date\": \"2026-06-10\",
        \"time\": \"8:30 PM\",
        \"status\": \"submitted\",
        \"avatarColor\": \"#7C3AED\"
      }
    ]
  }
}
```

**Backend Aggregation Logic:**
1. Count all employees with `status = 'enabled'` → `activeEmployees`
2. Count all businesses with `status = 'enabled'` → `businesses`
3. Filter driver records and water records for the given `date`
4. Count records with `status = 'submitted'` → `submittedToday`
5. Count records with `status = 'pending'` → `pendingToday`
6. Per business: sum `totalIncome`, `totalExpense`, compute `netProfit`
7. Build `submissions` list from all records for the date

---

## 7. PostgreSQL Database Schema

### 7.1 Schema SQL

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";

-- ============================================================================
-- BUSINESSES
-- ============================================================================
CREATE TABLE businesses (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(20)  NOT NULL CHECK (type IN ('taxi', 'water_delivery')),
    mode        VARCHAR(10)  NOT NULL CHECK (mode IN ('auto', 'manual')),
    status      VARCHAR(10)  NOT NULL DEFAULT 'enabled' CHECK (status IN ('enabled', 'disabled')),
    location    VARCHAR(500),
    employees   INTEGER      NOT NULL DEFAULT 0,
    created_at  DATE         NOT NULL DEFAULT CURRENT_DATE
);

-- ============================================================================
-- EMPLOYEES
-- ============================================================================
CREATE TABLE employees (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name      VARCHAR(255)  NOT NULL,
    mobile         VARCHAR(15)   NOT NULL,
    business_id    UUID          NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    business_name  VARCHAR(255)  NOT NULL,
    business_type  VARCHAR(20)   NOT NULL CHECK (business_type IN ('taxi', 'water_delivery')),
    pin            VARCHAR(4)    NOT NULL,
    status         VARCHAR(10)   NOT NULL DEFAULT 'enabled' CHECK (status IN ('enabled', 'disabled')),
    created_at     DATE          NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_employees_business_id   ON employees(business_id);
CREATE INDEX idx_employees_business_type ON employees(business_type);

-- ============================================================================
-- VEHICLES
-- ============================================================================
CREATE TABLE vehicles (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                 VARCHAR(255) NOT NULL,
    number               VARCHAR(50)  NOT NULL UNIQUE,
    status               VARCHAR(10)  NOT NULL DEFAULT 'enabled' CHECK (status IN ('enabled', 'disabled')),
    notes                TEXT,
    assigned_driver      VARCHAR(255),
    assigned_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_at           DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_at           DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_vehicles_assigned_employee ON vehicles(assigned_employee_id);

-- ============================================================================
-- HOTELS
-- ============================================================================
CREATE TABLE hotels (
    id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                   VARCHAR(255) NOT NULL,
    rate_per_can           INTEGER      NOT NULL,
    status                 VARCHAR(10)  NOT NULL DEFAULT 'enabled' CHECK (status IN ('enabled', 'disabled')),
    location               VARCHAR(500),
    assigned_employee_id   UUID REFERENCES employees(id) ON DELETE SET NULL,
    assigned_employee_name VARCHAR(255),
    created_at             DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_hotels_assigned_employee ON hotels(assigned_employee_id);

-- ============================================================================
-- DRIVER RECORDS (daily taxi records)
-- ============================================================================
CREATE TABLE driver_records (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_name       VARCHAR(255) NOT NULL,
    employee_id       UUID         NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    vehicle_id        UUID         NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    vehicle_name      VARCHAR(255) NOT NULL,
    vehicle_number    VARCHAR(50)  NOT NULL,
    date              DATE         NOT NULL,
    status            VARCHAR(10)  NOT NULL DEFAULT 'pending' CHECK (status IN ('submitted', 'pending')),
    avatar_color      VARCHAR(10),
    trips             INTEGER      NOT NULL DEFAULT 0,
    total_income      INTEGER      NOT NULL DEFAULT 0,
    total_expense     INTEGER      NOT NULL DEFAULT 0,
    settled_to_admin  INTEGER      NOT NULL DEFAULT 0,
    balance_shortage  INTEGER      NOT NULL DEFAULT 0,
    total_profit      INTEGER      NOT NULL DEFAULT 0,
    per_km_rate       INTEGER      NOT NULL DEFAULT 0,
    fuel_expense      INTEGER      NOT NULL DEFAULT 0
);

CREATE INDEX idx_driver_records_date        ON driver_records(date);
CREATE INDEX idx_driver_records_employee_id ON driver_records(employee_id);
CREATE UNIQUE INDEX idx_driver_records_unique ON driver_records(employee_id, date);

-- ============================================================================
-- TRIP DETAILS (child of driver_records)
-- ============================================================================
CREATE TABLE trip_details (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id   UUID         NOT NULL REFERENCES driver_records(id) ON DELETE CASCADE,
    trip_number INTEGER      NOT NULL,
    destination VARCHAR(500) NOT NULL,
    distance    DECIMAL(6,1) NOT NULL,
    income      INTEGER      NOT NULL DEFAULT 0,
    expense     INTEGER      NOT NULL DEFAULT 0
);

CREATE INDEX idx_trip_details_record_id ON trip_details(record_id);

-- ============================================================================
-- WATER DELIVERY RECORDS (daily water delivery records)
-- ============================================================================
CREATE TABLE water_delivery_records (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_person_name  VARCHAR(255) NOT NULL,
    employee_id           UUID         NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date                  DATE         NOT NULL,
    status                VARCHAR(10)  NOT NULL DEFAULT 'pending' CHECK (status IN ('submitted', 'pending')),
    avatar_color          VARCHAR(10),
    total_hotels          INTEGER NOT NULL DEFAULT 0,
    total_cans            INTEGER NOT NULL DEFAULT 0,
    total_delivered       INTEGER NOT NULL DEFAULT 0,
    total_returned        INTEGER NOT NULL DEFAULT 0,
    total_outstanding     INTEGER NOT NULL DEFAULT 0,
    total_income          INTEGER NOT NULL DEFAULT 0,
    total_expense         INTEGER NOT NULL DEFAULT 0,
    total_profit          INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_water_records_date        ON water_delivery_records(date);
CREATE INDEX idx_water_records_employee_id ON water_delivery_records(employee_id);
CREATE UNIQUE INDEX idx_water_records_unique ON water_delivery_records(employee_id, date);

-- ============================================================================
-- HOTEL DELIVERIES (child of water_delivery_records)
-- ============================================================================
CREATE TABLE hotel_deliveries (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id        UUID         NOT NULL REFERENCES water_delivery_records(id) ON DELETE CASCADE,
    hotel_name       VARCHAR(255) NOT NULL,
    location         VARCHAR(500),
    total_cans       INTEGER NOT NULL DEFAULT 0,
    delivered_cans   INTEGER NOT NULL DEFAULT 0,
    returned_cans    INTEGER NOT NULL DEFAULT 0,
    outstanding_cans INTEGER NOT NULL DEFAULT 0,
    income           INTEGER NOT NULL DEFAULT 0,
    expense          INTEGER NOT NULL DEFAULT 0,
    profit           INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_hotel_deliveries_record_id ON hotel_deliveries(record_id);
```

### 7.2 Column Name Mapping (Frontend ↔ Database)

The frontend uses **camelCase**, the database uses **snake_case**. Your backend must handle this conversion.

| Frontend Field | Database Column | Type |
| --- | --- | --- |
| `id` | `id` | UUID |
| `fullName` | `full_name` | varchar |
| `businessId` | `business_id` | UUID (FK) |
| `businessName` | `business_name` | varchar |
| `businessType` | `business_type` | varchar |
| `createdAt` | `created_at` | date |
| `updatedAt` | `updated_at` | date |
| `ratePerCan` | `rate_per_can` | integer |
| `assignedDriver` | `assigned_driver` | varchar |
| `assignedEmployeeId` | `assigned_employee_id` | UUID (FK) |
| `assignedEmployeeName` | `assigned_employee_name` | varchar |
| `driverName` | `driver_name` | varchar |
| `vehicleId` | `vehicle_id` | UUID (FK) |
| `vehicleName` | `vehicle_name` | varchar |
| `vehicleNumber` | `vehicle_number` | varchar |
| `totalIncome` | `total_income` | integer |
| `totalExpense` | `total_expense` | integer |
| `settledToAdmin` | `settled_to_admin` | integer |
| `balanceShortage` | `balance_shortage` | integer |
| `totalProfit` | `total_profit` | integer |
| `perKmRate` | `per_km_rate` | integer |
| `fuelExpense` | `fuel_expense` | integer |
| `tripNumber` | `trip_number` | integer |
| `deliveryPersonName` | `delivery_person_name` | varchar |
| `totalHotels` | `total_hotels` | integer |
| `totalCans` | `total_cans` | integer |
| `totalDelivered` | `total_delivered` | integer |
| `totalReturned` | `total_returned` | integer |
| `totalOutstanding` | `total_outstanding` | integer |
| `deliveredCans` | `delivered_cans` | integer |
| `returnedCans` | `returned_cans` | integer |
| `outstandingCans` | `outstanding_cans` | integer |
| `avatarColor` | `avatar_color` | varchar |
| `recordId` | `record_id` | UUID (FK) |
| `hotelName` | `hotel_name` | varchar |

---

## 8. Backend Project Structure (Fastify + PostgreSQL)

### 8.1 Recommended Folder Structure

```
backend/
├── package.json
├── .env                      # DB connection + server config
├── .env.example              # Template for env vars
├── src/
│   ├── index.ts              # App entry point — starts Fastify server
│   ├── app.ts                # Fastify app setup, plugin registration
│   ├── config/
│   │   └── database.ts       # PostgreSQL connection pool (pg)
│   ├── plugins/
│   │   ├── cors.ts           # CORS configuration
│   │   └── errorHandler.ts   # Global error handler
│   ├── routes/
│   │   ├── businesses.ts     # /api/businesses routes
│   │   ├── employees.ts      # /api/employees routes
│   │   ├── vehicles.ts       # /api/vehicles routes
│   │   ├── hotels.ts         # /api/hotels routes
│   │   ├── records.ts        # /api/records routes
│   │   └── dashboard.ts      # /api/dashboard routes
│   ├── controllers/
│   │   ├── businessController.ts
│   │   ├── employeeController.ts
│   │   ├── vehicleController.ts
│   │   ├── hotelController.ts
│   │   ├── recordController.ts
│   │   └── dashboardController.ts
│   ├── services/
│   │   ├── businessService.ts
│   │   ├── employeeService.ts
│   │   ├── vehicleService.ts
│   │   ├── hotelService.ts
│   │   ├── recordService.ts
│   │   └── dashboardService.ts
│   ├── repositories/           # Direct DB access layer
│   │   ├── businessRepo.ts
│   │   ├── employeeRepo.ts
│   │   ├── vehicleRepo.ts
│   │   ├── hotelRepo.ts
│   │   └── recordRepo.ts
│   ├── schemas/                # Fastify JSON schemas for validation
│   │   ├── businessSchema.ts
│   │   ├── employeeSchema.ts
│   │   ├── vehicleSchema.ts
│   │   ├── hotelSchema.ts
│   │   └── recordSchema.ts
│   ├── utils/
│   │   ├── caseConverter.ts    # snake_case ↔ camelCase conversion
│   │   └── response.ts        # Standard response helpers
│   └── types/
│       └── index.ts            # Shared TypeScript types
├── migrations/
│   └── 001_initial_schema.sql  # The SQL from Section 7
├── seeds/
│   └── seed.ts                 # Seed data from frontend mock data
└── tsconfig.json
```

### 8.2 Required Dependencies

```json
{
  \"dependencies\": {
    \"fastify\": \"^5.x\",
    \"@fastify/cors\": \"^10.x\",
    \"pg\": \"^8.x\",
    \"dotenv\": \"^16.x\"
  },
  \"devDependencies\": {
    \"@types/node\": \"^22.x\",
    \"@types/pg\": \"^8.x\",
    \"typescript\": \"^5.x\",
    \"tsx\": \"^4.x\"
  }
}
```

### 8.3 Environment Variables

```env
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/yalini_db
HOST=0.0.0.0
PORT=3001
NODE_ENV=development

# CORS - allow frontend origin
CORS_ORIGIN=http://localhost:8081
```

### 8.4 Key Implementation Files

#### `src/config/database.ts`
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
```

#### `src/utils/caseConverter.ts`
```typescript
// Convert snake_case DB rows to camelCase for frontend
export function toCamelCase<T>(row: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result as T;
}

// Convert camelCase frontend data to snake_case for DB
export function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}
```

#### `src/utils/response.ts`
```typescript
export function successResponse<T>(data: T) {
  return { success: true, data };
}

export function errorResponse(message: string, code?: string) {
  return { success: false, message, code };
}

export function listResponse<T>(data: T[], meta?: { total: number }) {
  return { success: true, data, meta };
}
```

---

## 9. Implementation Guide — Step by Step

### Phase 1: Project Setup

1. **Initialize the project**
   ```bash
   mkdir backend && cd backend
   npm init -y
   npm install fastify @fastify/cors pg dotenv
   npm install -D typescript @types/node @types/pg tsx
   npx tsc --init
   ```

2. **Configure TypeScript** (`tsconfig.json`)
   ```json
   {
     \"compilerOptions\": {
       \"target\": \"ES2022\",
       \"module\": \"NodeNext\",
       \"moduleResolution\": \"NodeNext\",
       \"outDir\": \"./dist\",
       \"rootDir\": \"./src\",
       \"strict\": true,
       \"esModuleInterop\": true,
       \"skipLibCheck\": true,
       \"resolveJsonModule\": true
     },
     \"include\": [\"src/**/*\"]
   }
   ```

3. **Create `.env`** with database credentials

4. **Run migrations** — execute the SQL from Section 7

### Phase 2: Core CRUD APIs (Priority Order)

Build in this order to match frontend dependency chain:

| Order | Module | Why First |
| --- | --- | --- |
| 1 | **Businesses** | Root entity — everything depends on it |
| 2 | **Employees** | Depends on Business |
| 3 | **Vehicles** | Depends on Employee (assignment) |
| 4 | **Hotels** | Depends on Employee (assignment) |
| 5 | **Records — Driver** | Depends on Employee + Vehicle |
| 6 | **Records — Water** | Depends on Employee + Hotel |
| 7 | **Dashboard** | Aggregates all the above |

### Phase 3: Business Logic Rules

**When creating an Employee:**
- Look up the referenced business to populate `businessName` and `businessType`
- Increment `employees` count on the business

**When deleting an Employee:**
- Decrement `employees` count on the business
- Unassign from any vehicles (set `assigned_employee_id = NULL`, `assigned_driver = NULL`)
- Unassign from any hotels (set `assigned_employee_id = NULL`, `assigned_employee_name = NULL`)

**When deleting a Business:**
- Cascade delete all employees under it (DB handles via ON DELETE CASCADE)
- This cascades to unassign vehicles/hotels and remove records

**When assigning Vehicle/Hotel:**
- Validate the employee exists and belongs to the correct business type
- For vehicles: employee must belong to a `taxi` business
- For hotels: employee must belong to a `water_delivery` business

**Dashboard aggregation:**
- This is a read-only endpoint
- Aggregates data from businesses, employees, driver_records, and water_delivery_records
- Filter records by the `date` query parameter
- Compute sums for income, expense, profit per business

### Phase 4: Testing

```bash
# Test each endpoint with curl
curl http://localhost:3001/api/businesses
curl http://localhost:3001/api/employees?businessType=taxi
curl http://localhost:3001/api/dashboard?date=2026-06-10
```

---

## 10. Backend Wiring in Frontend — Migration Steps

### Step 1: Create an API Client Utility

Create a new file `src/services/apiClient.ts`:

```typescript
const API_BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function apiPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function apiPut<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
}
```

### Step 2: Replace Each Service File

Replace the mock data calls with API calls in each service file. **Keep the function signatures identical.**

#### Example: `businessService.ts` Migration

```typescript
// BEFORE (mock):
import { getBusinesses } from './mockData';

export async function loadBusinesses(): Promise<Business[]> {
  const businesses = await getBusinesses();
  return businesses.map(toBusinessType);
}

// AFTER (API):
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

export async function loadBusinesses(): Promise<Business[]> {
  return apiGet<Business[]>('/api/businesses');
}

export async function createBusiness(values: BusinessFormValues): Promise<Business> {
  return apiPost<Business>('/api/businesses', values);
}

export async function updateBusiness(id: string, patch: BusinessFormValues): Promise<Business | null> {
  return apiPut<Business>(`/api/businesses/${id}`, patch);
}

export async function deleteBusiness(id: string): Promise<void> {
  return apiDelete(`/api/businesses/${id}`);
}
```

### Step 3: Service-by-Service Migration Checklist

| Service File | Mock Import to Remove | API Endpoints to Wire |
| --- | --- | --- |
| `businessService.ts` | `./mockData` | `GET/POST/PUT/DELETE /api/businesses` |
| `employeeService.ts` | `./mockData` | `GET/POST/PUT/DELETE /api/employees` |
| `vehicleService.ts` | `./mockData` | `GET/POST/PUT/DELETE /api/vehicles`, `POST .../assign`, `POST .../unassign` |
| `hotelService.ts` | `./mockData` | `GET/POST/PUT/DELETE /api/hotels`, `POST .../assign`, `POST .../unassign` |
| `recordsService.ts` | `./mockData` | `GET /api/records/driver`, `GET /api/records/water`, `GET /api/businesses/selector` |
| `dashboardService.ts` | `./mockData` | `GET /api/dashboard?date=` |

### Step 4: No Changes Needed To

- **Hooks** (`useBusinesses`, `useEmployees`, etc.) — they consume services via the same function signatures
- **Screens** — they consume hooks, not services
- **Types** — the backend must return the same shape
- **Theme/Navigation** — purely frontend concerns

---

## 11. Seed Data Reference

The following seed data should be used to populate the database initially. This matches the frontend's mock data:

### Businesses
| ID | Name | Type | Mode | Status | Employees |
| --- | --- | --- | --- | --- | --- |
| biz_seed_city_taxi | City Taxi | taxi | auto | enabled | 4 |
| biz_seed_yalini_minerals | Yalini Minerals | water_delivery | manual | enabled | 3 |

### Employees
| ID | Name | Mobile | Business | Type | Status | PIN |
| --- | --- | --- | --- | --- | --- | --- |
| emp_seed_ramesh | Ramesh Kumar | 9876543210 | City Taxi | taxi | enabled | 1234 |
| emp_seed_ajay | Ajay Verma | 9876543212 | City Taxi | taxi | enabled | 1234 |
| emp_seed_deepak | Deepak Patel | 9876543214 | City Taxi | taxi | enabled | 1234 |
| emp_seed_vijay | Vijay Kumar | 9876543216 | City Taxi | taxi | disabled | 1234 |
| emp_seed_suresh | Suresh Kumar | 9876543211 | Yalini Minerals | water_delivery | enabled | 1234 |
| emp_seed_mani | Mani Kumar | 9876543213 | Yalini Minerals | water_delivery | enabled | 1234 |
| emp_seed_pawan | Pawan Prasad | 9876543215 | Yalini Minerals | water_delivery | enabled | 1234 |

### Vehicles
| ID | Name | Number | Status | Assigned Driver | Notes |
| --- | --- | --- | --- | --- | --- |
| veh_seed_swift_dzire | Swift Dzire | TN01AB1234 | enabled | Ramesh Kumar | Regular maintenance completed |
| veh_seed_innova_crysta | Innova Crysta | TN01CD5678 | enabled | Ajay Verma | Premium for airport transfers |
| veh_seed_wagon_r | Wagon R | TN01EF9012 | enabled | Deepak Patel | — |
| veh_seed_honda_city | Honda City | TN01GH3456 | disabled | — | Under maintenance |

### Hotels
| ID | Name | Rate/Can | Status | Location | Assigned To |
| --- | --- | --- | --- | --- | --- |
| hotel_seed_golden_palace | Hotel Golden Palace | ₹25 | enabled | MG Road, Sector 5 | Suresh Kumar |
| hotel_seed_royal_inn | Royal Inn | ₹28 | enabled | Anna Nagar, Block B | Suresh Kumar |
| hotel_seed_green_valley | Green Valley Resort | ₹30 | enabled | Velachery Main Road | Mani Kumar |
| hotel_seed_sunrise | Sunrise Hotel | ₹22 | enabled | T Nagar, North Street | Mani Kumar |
| hotel_seed_blue_ocean | Hotel Blue Ocean | ₹26 | enabled | Adyar, 2nd Cross | Pawan Prasad |
| hotel_seed_mountain_view | Mountain View Hotel | ₹24 | disabled | Guindy Industrial Estate | — |

---

## 12. Appendix — Type Definitions

### Business Types
```typescript
type BusinessTypeId = \"taxi\" | \"water_delivery\";
type BusinessModeId = \"auto\" | \"manual\";
type BusinessStatusId = \"enabled\" | \"disabled\";

interface Business {
  id: string;
  name: string;
  type: BusinessTypeId;
  mode: BusinessModeId;
  status: BusinessStatusId;
  location?: string;
  employees: number;
  createdAt: string;          // \"YYYY-MM-DD\"
}

interface BusinessFormValues {
  name: string;
  type: BusinessTypeId;
  mode: BusinessModeId;
  status: BusinessStatusId;
}
```

### Employee Types
```typescript
type EmployeeStatusId = \"enabled\" | \"disabled\";

interface Employee {
  id: string;
  fullName: string;
  mobile: string;
  businessId: string;
  businessName: string;
  businessType: BusinessTypeId;
  pin: string;
  status: EmployeeStatusId;
  createdAt: string;
}

interface EmployeeFormValues {
  fullName: string;
  mobile: string;
  businessId: string;
  pin: string;
  confirmPin: string;
  status: EmployeeStatusId;
}
```

### Vehicle Types
```typescript
type VehicleStatusId = \"enabled\" | \"disabled\";

interface Vehicle {
  id: string;
  name: string;
  number: string;
  status: VehicleStatusId;
  notes?: string;
  assignedDriver?: string;
  assignedEmployeeId?: string;
  createdAt: string;
  updatedAt: string;
}

interface VehicleFormValues {
  name: string;
  number: string;
  status: VehicleStatusId;
  notes?: string;
  assignedDriver?: string;
  assignedEmployeeId?: string;
}
```

### Hotel Types
```typescript
type HotelStatusId = \"enabled\" | \"disabled\";

interface Hotel {
  id: string;
  name: string;
  ratePerCan: number;
  status: HotelStatusId;
  location?: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  createdAt: string;
}

interface HotelFormValues {
  name: string;
  ratePerCan: number;
  status: HotelStatusId;
  location?: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
}
```

### Driver Record Types
```typescript
type RecordStatus = \"submitted\" | \"pending\";

interface TripDetail {
  id: string;
  tripNumber: number;
  destination: string;
  distance: number;         // in km
  income: number;           // in INR (integer)
  expense: number;
}

interface DriverRecord {
  id: string;
  driverName: string;
  employeeId: string;
  vehicleId: string;
  vehicleName: string;
  vehicleNumber: string;
  date: string;             // \"YYYY-MM-DD\"
  status: RecordStatus;
  avatarColor: string;
  trips: number;
  totalIncome: number;
  totalExpense: number;
  settledToAdmin: number;
  balanceShortage: number;
  totalProfit: number;
  perKmRate: number;
  tripDetails: TripDetail[];
  fuelExpense: number;
}
```

### Water Delivery Record Types
```typescript
interface HotelDelivery {
  id: string;
  hotelName: string;
  location: string;
  totalCans: number;
  deliveredCans: number;
  returnedCans: number;
  outstandingCans: number;
  income: number;
  expense: number;
  profit: number;
}

interface WaterDeliveryRecord {
  id: string;
  deliveryPersonName: string;
  employeeId: string;
  date: string;             // \"YYYY-MM-DD\"
  status: RecordStatus;
  avatarColor: string;
  totalHotels: number;
  totalCans: number;
  totalDelivered: number;
  totalReturned: number;
  totalOutstanding: number;
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
  hotelDeliveries: HotelDelivery[];
}
```

### Dashboard Types
```typescript
type SubmissionStatus = \"submitted\" | \"pending\";
type MetricColor = \"success\" | \"warning\" | \"error\" | \"info\";

interface DashboardStats {
  activeEmployees: number;
  submittedToday: number;
  pendingToday: number;
  businesses: number;
}

interface BusinessMetric {
  label: string;
  amount: number;           // in INR
  color: MetricColor;
}

interface BusinessOverview {
  id: string;
  name: string;
  category: string;
  tone: string;
  icon: { family: string; name: string };
  metrics: BusinessMetric[];
}

interface Submission {
  id: string;
  employeeName: string;
  businessName: string;
  date: string;
  time: string;
  status: SubmissionStatus;
  avatarColor: string;
}

interface DashboardData {
  stats: DashboardStats;
  businesses: BusinessOverview[];
  submissions: Submission[];
}
```

### Assignment Types
```typescript
type AssetType = \"vehicle\" | \"hotel\";

interface Assignment {
  id: string;
  employeeId: string;
  employeeName: string;
  assetId: string;
  assetName: string;
  assetType: AssetType;
  businessId: string;
  businessName: string;
  businessType: BusinessTypeId;
  assignedAt: string;
}
```

---

## Summary

This guide provides everything needed to build the Yalini Mobile backend:

1. **Architecture** — Clear separation between screens → hooks → services → API
2. **Mock Layer** — Designed for seamless swap to real backend
3. **API Spec** — 30+ endpoints fully specified with request/response formats
4. **Database Schema** — PostgreSQL schema with proper relationships and indexes
5. **Backend Structure** — Fastify project layout with all necessary modules
6. **Migration Path** — Step-by-step instructions for wiring frontend to backend
7. **Seed Data** — Complete test data matching the frontend mock data
8. **Type Definitions** — Full TypeScript types that backend responses must match

The frontend is ready to consume a real backend — the service layer was designed with this migration in mind. Build the API endpoints, ensure the response shapes match the types defined here, and the frontend will work with minimal changes (only service file bodies need updating).