# Admin Module - Data Fields Flow Analysis
## Yalini Mobile UI Application

---

## Executive Summary

This document provides a comprehensive analysis of the **Admin Module** in the Yalini Mobile application, mapping all data fields that flow through the system from the admin interface to various screens and components.

**App Overview:**
- **Purpose**: Multi-role business operations management (Taxi + Water Delivery)
- **Frontend**: React Native (Expo SDK 54), TypeScript, React Navigation v7
- **Current State**: UI-only with in-memory mock service layer
- **Architecture**: Component → Hook → Service → Mock Data Store

---

## Table of Contents

1. [Admin Module Structure](#1-admin-module-structure)
2. [Core Data Entities](#2-core-data-entities)
3. [Data Field Flow Diagrams](#3-data-field-flow-diagrams)
4. [Module-by-Module Field Analysis](#4-module-by-module-field-analysis)
5. [Data Relationships & Dependencies](#5-data-relationships--dependencies)
6. [Field Validation & Business Rules](#6-field-validation--business-rules)
7. [Service Layer Field Transformations](#7-service-layer-field-transformations)
8. [Cross-Module Field Usage](#8-cross-module-field-usage)

---

## 1. Admin Module Structure

### 1.1 Admin Screen Hierarchy

```
AdminScreens/
├── Dashboard/               # Overview & metrics
├── Records/                 # Daily submissions (Taxi + Water)
│   ├── TaxiRecordDetails
│   └── WaterRecordDetails
├── Employees/              # Employee management
│   ├── EmployeesList
│   ├── AddEmployee
│   └── EditEmployee
└── Settings/               # Business configuration
    ├── MyBusiness/         # Business CRUD
    ├── Vehicles/           # Vehicle management (Taxi)
    ├── Hotels/             # Hotel management (Water)
    └── AssignAssets/       # Employee-Asset assignment
```

### 1.2 Data Flow Architecture

```
┌─────────────────────────────────────────────────────┐
│              ADMIN SCREENS (UI Layer)               │
│  Dashboard | Records | Employees | Settings         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              HOOKS LAYER (State Cache)              │
│  useDashboard | useEmployees | useBusinesses        │
│  useVehicles  | useHotels    | useRecords           │
│  (In-memory cache + listener fan-out pattern)       │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│           SERVICE LAYER (Business Logic)            │
│  businessService | employeeService                  │
│  vehicleService  | hotelService                     │
│  recordsService  | dashboardService                 │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│         MOCK DATA STORE (Temporary Storage)         │
│  businesses[] | employees[] | vehicles[]            │
│  hotels[]     | driverRecords[]                     │
│  waterDeliveryRecords[]                             │
└─────────────────────────────────────────────────────┘
```

---

## 2. Core Data Entities

### 2.1 Business Entity

**Purpose**: Root entity representing a business operation (Taxi or Water Delivery)

| Field Name    | Type                              | Required | Description                              | Source Screen        |
|---------------|-----------------------------------|----------|------------------------------------------|----------------------|
| `id`          | `string`                          | Yes      | Unique identifier (UUID format)          | Auto-generated       |
| `name`        | `string`                          | Yes      | Business name                            | MyBusiness forms     |
| `type`        | `\"taxi\" \| \"water_delivery\"`      | Yes      | Business type                            | MyBusiness forms     |
| `mode`        | `\"auto\" \| \"manual\"`              | Yes      | Assignment mode                          | MyBusiness forms     |
| `status`      | `\"enabled\" \| \"disabled\"`         | Yes      | Operational status                       | MyBusiness forms     |
| `location`    | `string?`                         | No       | Physical location                        | MyBusiness forms     |
| `employees`   | `number`                          | Yes      | Employee count (auto-maintained)         | Calculated           |
| `createdAt`   | `string` (ISO 8601: YYYY-MM-DD)   | Yes      | Creation date                            | Auto-generated       |

**Business Rules**:
- **Type Constraint**: Determines which assets can be assigned:
  - `taxi` → Can assign **Vehicles**
  - `water_delivery` → Can assign **Hotels**
- **Mode Behavior**:
  - `auto`: Employees can self-select assets
  - `manual`: Admin assigns assets explicitly
- **Employee Count**: Auto-incremented when employees are added, decremented on deletion

---

### 2.2 Employee Entity

**Purpose**: Represents a worker (Driver or Delivery Person) linked to a Business

| Field Name       | Type                          | Required | Description                          | Source Screen        |
|------------------|-------------------------------|----------|--------------------------------------|----------------------|
| `id`             | `string`                      | Yes      | Unique identifier                    | Auto-generated       |
| `fullName`       | `string`                      | Yes      | Employee full name                   | Employee forms       |
| `mobile`         | `string`                      | Yes      | Mobile number (digits only)          | Employee forms       |
| `businessId`     | `string`                      | Yes      | Foreign key → Business.id            | Employee forms       |
| `businessName`   | `string`                      | Yes      | Denormalized business name           | Auto-populated       |
| `businessType`   | `\"taxi\" \| \"water_delivery\"`  | Yes      | Inherited from parent business       | Auto-populated       |
| `pin`            | `string`                      | Yes      | 4-digit PIN for authentication       | Employee forms       |
| `status`         | `\"enabled\" \| \"disabled\"`     | Yes      | Account status                       | Employee forms       |
| `createdAt`      | `string` (YYYY-MM-DD)         | Yes      | Creation date                        | Auto-generated       |

**Field Transformations**:
- `mobile`: Cleaned via `mobile.replace(/\D/g, '')` to strip non-digit characters
- `fullName`: Trimmed via `fullName.trim()`
- `businessName` & `businessType`: Auto-populated by looking up the referenced `businessId`

**Business Rules**:
- PIN must be exactly 4 digits
- `businessId` must reference an existing Business
- When created, parent Business.employees count increments
- When deleted, parent Business.employees count decrements

---

### 2.3 Vehicle Entity (Taxi Business Only)

**Purpose**: Represents a taxi vehicle that can be assigned to a driver

| Field Name            | Type                          | Required | Description                          | Source Screen        |
|-----------------------|-------------------------------|----------|--------------------------------------|----------------------|
| `id`                  | `string`                      | Yes      | Unique identifier                    | Auto-generated       |
| `name`                | `string`                      | Yes      | Vehicle model/name                   | Vehicle forms        |
| `number`              | `string`                      | Yes      | Registration number (uppercase)      | Vehicle forms        |
| `status`              | `\"enabled\" \| \"disabled\"`     | Yes      | Vehicle operational status           | Vehicle forms        |
| `notes`               | `string?`                     | No       | Additional notes/comments            | Vehicle forms        |
| `assignedDriver`      | `string?`                     | No       | Driver name (for display)            | AssignAssets screen  |
| `assignedEmployeeId`  | `string?`                     | No       | Foreign key → Employee.id            | AssignAssets screen  |
| `createdAt`           | `string` (YYYY-MM-DD)         | Yes      | Creation date                        | Auto-generated       |
| `updatedAt`           | `string` (YYYY-MM-DD)         | Yes      | Last update date                     | Auto-updated         |

**Field Transformations**:
- `name`: Trimmed
- `number`: Trimmed and converted to uppercase
- `updatedAt`: Updated whenever vehicle is modified or assignment changes

**Business Rules**:
- Vehicle number should be unique (recommended)
- Can only be assigned to Employees with `businessType = \"taxi\"`
- Assignment updates both `assignedDriver` (name) and `assignedEmployeeId` (ID)

---

### 2.4 Hotel Entity (Water Delivery Business Only)

**Purpose**: Represents a delivery location (hotel/customer) for water delivery business

| Field Name              | Type                          | Required | Description                          | Source Screen        |
|-------------------------|-------------------------------|----------|--------------------------------------|----------------------|
| `id`                    | `string`                      | Yes      | Unique identifier                    | Auto-generated       |
| `name`                  | `string`                      | Yes      | Hotel/customer name                  | Hotel forms          |
| `ratePerCan`            | `number`                      | Yes      | Price per water can (INR)            | Hotel forms          |
| `status`                | `\"enabled\" \| \"disabled\"`     | Yes      | Hotel operational status             | Hotel forms          |
| `location`              | `string?`                     | No       | Physical address                     | Hotel forms          |
| `assignedEmployeeId`    | `string?`                     | No       | Foreign key → Employee.id            | AssignAssets screen  |
| `assignedEmployeeName`  | `string?`                     | No       | Employee name (for display)          | AssignAssets screen  |
| `createdAt`             | `string` (YYYY-MM-DD)         | Yes      | Creation date                        | Auto-generated       |

**Field Transformations**:
- `name`: Trimmed
- `ratePerCan`: Must be positive integer (no decimals)

**Business Rules**:
- Can only be assigned to Employees with `businessType = \"water_delivery\"`
- Assignment updates both `assignedEmployeeId` (ID) and `assignedEmployeeName` (name)
- One employee can be assigned to multiple hotels

---

### 2.5 Driver Record Entity (Taxi Business)

**Purpose**: Daily trip submission record from a taxi driver

| Field Name          | Type                          | Required | Description                          | Source Screen        |
|---------------------|-------------------------------|----------|--------------------------------------|----------------------|
| `id`                | `string`                      | Yes      | Unique identifier                    | Auto-generated       |
| `driverName`        | `string`                      | Yes      | Driver's full name                   | Driver app           |
| `employeeId`        | `string`                      | Yes      | Foreign key → Employee.id            | Driver app           |
| `vehicleId`         | `string`                      | Yes      | Foreign key → Vehicle.id             | Driver app           |
| `vehicleName`       | `string`                      | Yes      | Vehicle name (denormalized)          | Driver app           |
| `vehicleNumber`     | `string`                      | Yes      | Vehicle registration                 | Driver app           |
| `date`              | `string` (YYYY-MM-DD)         | Yes      | Record date                          | Driver app           |
| `status`            | `\"submitted\" \| \"pending\"`    | Yes      | Submission status                    | Driver app           |
| `avatarColor`       | `string`                      | Yes      | UI color code                        | Auto-generated       |
| `trips`             | `number`                      | Yes      | Total number of trips                | Calculated           |
| `totalIncome`       | `number`                      | Yes      | Total earnings (INR)                 | Calculated           |
| `totalExpense`      | `number`                      | Yes      | Total expenses (INR)                 | Calculated           |
| `settledToAdmin`    | `number`                      | Yes      | Amount settled to admin (INR)        | Driver app           |
| `balanceShortage`   | `number`                      | Yes      | Balance shortage (INR)               | Calculated           |
| `totalProfit`       | `number`                      | Yes      | Net profit (INR)                     | Calculated           |
| `perKmRate`         | `number`                      | Yes      | Rate per kilometer (INR)             | Driver app           |
| `fuelExpense`       | `number`                      | Yes      | Fuel cost (INR)                      | Driver app           |
| `tripDetails`       | `TripDetail[]`                | Yes      | Array of individual trips            | Driver app           |

**Nested Object - TripDetail**:

| Field Name    | Type      | Required | Description                   |
|---------------|-----------|----------|-------------------------------|
| `id`          | `string`  | Yes      | Unique trip identifier        |
| `tripNumber`  | `number`  | Yes      | Sequential trip number        |
| `destination` | `string`  | Yes      | Trip destination              |
| `distance`    | `number`  | Yes      | Distance in kilometers        |
| `income`      | `number`  | Yes      | Trip income (INR)             |
| `expense`     | `number`  | Yes      | Trip expense (INR)            |

**Business Rules**:
- One record per employee per day (unique constraint on `employeeId + date`)
- `trips` = `tripDetails.length`
- `totalIncome` = sum of all `tripDetails[].income`
- `totalExpense` = sum of all `tripDetails[].expense` + `fuelExpense`
- `totalProfit` = `totalIncome` - `totalExpense`
- `balanceShortage` = `totalIncome` - `settledToAdmin` - `totalExpense`

---

### 2.6 Water Delivery Record Entity (Water Delivery Business)

**Purpose**: Daily delivery submission record from a delivery person

| Field Name             | Type                          | Required | Description                          | Source Screen        |
|------------------------|-------------------------------|----------|--------------------------------------|----------------------|
| `id`                   | `string`                      | Yes      | Unique identifier                    | Auto-generated       |
| `deliveryPersonName`   | `string`                      | Yes      | Delivery person's name               | Staff app            |
| `employeeId`           | `string`                      | Yes      | Foreign key → Employee.id            | Staff app            |
| `date`                 | `string` (YYYY-MM-DD)         | Yes      | Record date                          | Staff app            |
| `status`               | `\"submitted\" \| \"pending\"`    | Yes      | Submission status                    | Staff app            |
| `avatarColor`          | `string`                      | Yes      | UI color code                        | Auto-generated       |
| `totalHotels`          | `number`                      | Yes      | Number of hotels served              | Calculated           |
| `totalCans`            | `number`                      | Yes      | Total cans dispatched                | Calculated           |
| `totalDelivered`       | `number`                      | Yes      | Total cans delivered                 | Calculated           |
| `totalReturned`        | `number`                      | Yes      | Total cans returned                  | Calculated           |
| `totalOutstanding`     | `number`                      | Yes      | Total outstanding cans               | Calculated           |
| `totalIncome`          | `number`                      | Yes      | Total income (INR)                   | Calculated           |
| `totalExpense`         | `number`                      | Yes      | Total expense (INR)                  | Calculated           |
| `totalProfit`          | `number`                      | Yes      | Net profit (INR)                     | Calculated           |
| `hotelDeliveries`      | `HotelDelivery[]`             | Yes      | Array of hotel-wise deliveries       | Staff app            |

**Nested Object - HotelDelivery**:

| Field Name         | Type      | Required | Description                        |
|--------------------|-----------|----------|------------------------------------|
| `id`               | `string`  | Yes      | Unique delivery identifier         |
| `hotelName`        | `string`  | Yes      | Hotel name                         |
| `location`         | `string`  | Yes      | Hotel location                     |
| `totalCans`        | `number`  | Yes      | Cans dispatched to this hotel      |
| `deliveredCans`    | `number`  | Yes      | Cans successfully delivered        |
| `returnedCans`     | `number`  | Yes      | Cans returned                      |
| `outstandingCans`  | `number`  | Yes      | Cans outstanding                   |
| `income`           | `number`  | Yes      | Income from this hotel (INR)       |
| `expense`          | `number`  | Yes      | Expense for this hotel (INR)       |
| `profit`           | `number`  | Yes      | Net profit from this hotel (INR)   |

**Business Rules**:
- One record per employee per day
- `totalHotels` = `hotelDeliveries.length`
- `totalCans` = sum of `hotelDeliveries[].totalCans`
- `totalDelivered` = sum of `hotelDeliveries[].deliveredCans`
- `totalReturned` = sum of `hotelDeliveries[].returnedCans`
- `totalOutstanding` = sum of `hotelDeliveries[].outstandingCans`
- `totalIncome` = sum of `hotelDeliveries[].income`
- `totalExpense` = sum of `hotelDeliveries[].expense`
- `totalProfit` = `totalIncome` - `totalExpense`

---

### 2.7 Assignment Entity

**Purpose**: Links Employees to their assigned Assets (Vehicles or Hotels)

| Field Name       | Type                              | Required | Description                      | Source Screen        |
|------------------|-----------------------------------|----------|----------------------------------|----------------------|
| `id`             | `string`                          | Yes      | Unique identifier                | Auto-generated       |
| `employeeId`     | `string`                          | Yes      | Foreign key → Employee.id        | AssignAssets screen  |
| `employeeName`   | `string`                          | Yes      | Employee name (display)          | Auto-populated       |
| `assetId`        | `string`                          | Yes      | Foreign key → Vehicle/Hotel.id   | AssignAssets screen  |
| `assetName`      | `string`                          | Yes      | Asset name (display)             | Auto-populated       |
| `assetType`      | `\"vehicle\" \| \"hotel\"`            | Yes      | Type of asset                    | Auto-populated       |
| `businessId`     | `string`                          | Yes      | Foreign key → Business.id        | Auto-populated       |
| `businessName`   | `string`                          | Yes      | Business name (display)          | Auto-populated       |
| `businessType`   | `\"taxi\" \| \"water_delivery\"`      | Yes      | Business type                    | Auto-populated       |
| `assignedAt`     | `string` (YYYY-MM-DD)             | Yes      | Assignment date                  | Auto-generated       |

**Business Rules**:
- **Type Matching**: 
  - Employees with `businessType = \"taxi\"` can only be assigned `assetType = \"vehicle\"`
  - Employees with `businessType = \"water_delivery\"` can only be assigned `assetType = \"hotel\"`
- Vehicle assignments are 1:1 (one vehicle → one employee)
- Hotel assignments are N:1 (many hotels → one employee)

---

### 2.8 Dashboard Data Entity

**Purpose**: Aggregated metrics and submissions for the dashboard view

| Field Name  | Type                    | Required | Description                              |
|-------------|-------------------------|----------|------------------------------------------|
| `stats`     | `DashboardStats`        | Yes      | Overview statistics                      |
| `businesses`| `BusinessOverview[]`    | Yes      | Business-wise metrics                    |
| `submissions`| `Submission[]`         | Yes      | Recent daily submissions                 |

**DashboardStats Object**:

| Field Name         | Type     | Description                              |
|--------------------|----------|------------------------------------------|
| `activeEmployees`  | `number` | Count of enabled employees               |
| `submittedToday`   | `number` | Records submitted today                  |
| `pendingToday`     | `number` | Records pending today                    |
| `businesses`       | `number` | Count of enabled businesses              |

**BusinessOverview Object**:

| Field Name  | Type                | Description                              |
|-------------|---------------------|------------------------------------------|
| `id`        | `string`            | Business ID                              |
| `name`      | `string`            | Business name                            |
| `category`  | `string`            | Display category (\"Taxi\" / \"Delivery\")   |
| `tone`      | `string`            | UI color tone                            |
| `icon`      | `BusinessIcon`      | Icon configuration                       |
| `metrics`   | `BusinessMetric[]`  | Business financial metrics               |

**BusinessMetric Object**:

| Field Name  | Type                                    | Description                  |
|-------------|-----------------------------------------|------------------------------|
| `label`     | `string`                                | Metric label                 |
| `amount`    | `number`                                | Amount in INR                |
| `color`     | `\"success\" \| \"warning\" \| \"error\" \| \"info\"` | UI color hint      |

**Submission Object**:

| Field Name     | Type                          | Description                     |
|----------------|-------------------------------|---------------------------------|
| `id`           | `string`                      | Record ID                       |
| `employeeName` | `string`                      | Employee who submitted          |
| `businessName` | `string`                      | Parent business                 |
| `date`         | `string` (YYYY-MM-DD)         | Submission date                 |
| `time`         | `string`                      | Submission time                 |
| `status`       | `\"submitted\" \| \"pending\"`    | Submission status               |
| `avatarColor`  | `string`                      | UI avatar color                 |

---

## 3. Data Field Flow Diagrams

### 3.1 Business Creation Flow

```
┌─────────────────────────┐
│   MyBusiness Screen     │
│   (Add/Edit Form)       │
└───────────┬─────────────┘
            │
            │ Form Fields:
            │ - name: string
            │ - type: \"taxi\" | \"water_delivery\"
            │ - mode: \"auto\" | \"manual\"
            │ - status: \"enabled\" | \"disabled\"
            ▼
┌─────────────────────────┐
│  useBusinesses Hook     │
│  createBusiness()       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  businessService.ts     │
│  createBusiness()       │
└───────────┬─────────────┘
            │ Transforms:
            │ - name.trim()
            │
            ▼
┌─────────────────────────┐
│  mockData/index.ts      │
│  createBusiness()       │
└───────────┬─────────────┘
            │ Generates:
            │ - id (UUID)
            │ - employees: 0
            │ - createdAt (YYYY-MM-DD)
            │
            ▼
┌─────────────────────────┐
│  store.businesses[]     │
│  (In-Memory Store)      │
└─────────────────────────┘
            │
            │ Propagates to:
            │
            ▼
┌─────────────────────────────────────────────┐
│  All Business-dependent screens:            │
│  - Dashboard (business metrics)             │
│  - Employee forms (business selector)       │
│  - Records (business filter)                │
│  - AssignAssets (business context)          │
└─────────────────────────────────────────────┘
```

### 3.2 Employee Creation Flow

```
┌─────────────────────────┐
│   Employees Screen      │
│   (Add/Edit Form)       │
└───────────┬─────────────┘
            │
            │ Form Fields:
            │ - fullName: string
            │ - mobile: string
            │ - businessId: string ───────┐
            │ - pin: string (4 digits)    │
            │ - confirmPin: string         │
            │ - status: enabled/disabled   │
            ▼                               │
┌─────────────────────────┐                │
│  useEmployees Hook      │                │
│  createEmployee()       │                │
└───────────┬─────────────┘                │
            │                               │
            ▼                               │
┌─────────────────────────┐                │
│  employeeService.ts     │                │
│  createEmployee()       │                │
└───────────┬─────────────┘                │
            │ Transforms:                   │
            │ - fullName.trim()             │
            │ - mobile.replace(/\D/g, '')   │
            │                               │
            │ Lookups: ◄───────────────────┘
            │ - Fetch businessName (from businessId)
            │ - Fetch businessType (from businessId)
            │
            ▼
┌─────────────────────────┐
│  mockData/index.ts      │
│  createEmployee()       │
└───────────┬─────────────┘
            │ Generates:
            │ - id (UUID)
            │ - businessName (from lookup)
            │ - businessType (from lookup)
            │ - createdAt (YYYY-MM-DD)
            │
            │ Side Effects:
            │ - Increment Business.employees
            │
            ▼
┌─────────────────────────┐
│  store.employees[]      │
│  (In-Memory Store)      │
└─────────────────────────┘
            │
            │ Propagates to:
            │
            ▼
┌─────────────────────────────────────────────┐
│  All Employee-dependent screens:            │
│  - Dashboard (active employees count)       │
│  - AssignAssets (employee selector)         │
│  - Records (filter by employee)             │
│  - MyBusiness (employee count badge)        │
└─────────────────────────────────────────────┘
```

### 3.3 Vehicle Assignment Flow

```
┌─────────────────────────┐
│  AssignAssets Screen    │
│  (Vehicle Assignment)   │
└───────────┬─────────────┘
            │
            │ Selection:
            │ - employeeId: string
            │ - vehicleId: string
            │ - assetType: \"vehicle\"
            ▼
┌─────────────────────────┐
│  useVehicles Hook       │
│  assignEmployee()       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  vehicleService.ts      │
│  assignEmployeeToVehicle()
└───────────┬─────────────┘
            │ Validation:
            │ - Employee must exist
            │ - Employee.businessType = \"taxi\"
            │
            ▼
┌─────────────────────────┐
│  mockData/index.ts      │
│  assignEmployeeToVehicle()
└───────────┬─────────────┘
            │ Updates Vehicle:
            │ - assignedEmployeeId ← employeeId
            │ - assignedDriver ← employeeName
            │ - updatedAt ← today's date
            │
            ▼
┌─────────────────────────┐
│  store.vehicles[]       │
│  (In-Memory Store)      │
└─────────────────────────┘
            │
            │ Propagates to:
            │
            ▼
┌─────────────────────────────────────────────┐
│  All Vehicle-dependent screens:             │
│  - Vehicle List (shows assigned driver)     │
│  - Driver Records (vehicle info)            │
│  - AssignAssets (assignment list)           │
└─────────────────────────────────────────────┘
```

### 3.4 Dashboard Data Aggregation Flow

```
┌─────────────────────────┐
│   Dashboard Screen      │
│   (Selected Date)       │
└───────────┬─────────────┘
            │
            │ Input: date (YYYY-MM-DD)
            ▼
┌─────────────────────────┐
│  useDashboard Hook      │
│  fetchDashboard()       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  dashboardService.ts    │
│  fetchDashboardData()   │
└───────────┬─────────────┘
            │
            │ Aggregates from multiple stores:
            │
            ├─► store.employees[]
            │   ├─ Count where status = \"enabled\"
            │   └─ → stats.activeEmployees
            │
            ├─► store.businesses[]
            │   ├─ Count where status = \"enabled\"
            │   └─ → stats.businesses
            │
            ├─► store.driverRecords[]
            │   ├─ Filter by date
            │   ├─ Count where status = \"submitted\"
            │   ├─ Count where status = \"pending\"
            │   └─ Group by businessId:
            │       ├─ Sum totalIncome
            │       ├─ Sum totalExpense
            │       └─ Calculate totalProfit
            │
            ├─► store.waterDeliveryRecords[]
            │   ├─ Filter by date
            │   ├─ Count where status = \"submitted\"
            │   ├─ Count where status = \"pending\"
            │   └─ Group by businessId:
            │       ├─ Sum totalIncome
            │       ├─ Sum totalExpense
            │       └─ Calculate totalProfit
            │
            ▼
┌─────────────────────────────────────────┐
│  DashboardData Object                   │
│  {                                      │
│    stats: {                             │
│      activeEmployees: number            │
│      submittedToday: number             │
│      pendingToday: number               │
│      businesses: number                 │
│    },                                   │
│    businesses: BusinessOverview[],      │
│    submissions: Submission[]            │
│  }                                      │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  Dashboard Screen Renders:              │
│  - Stats cards (4 metrics)              │
│  - Business cards (income/expense)      │
│  - Submission timeline                  │
└─────────────────────────────────────────┘
```

---

## 4. Module-by-Module Field Analysis

### 4.1 MyBusiness Module

**Screens**: `AllBusinesses`, `AddBusiness`, `EditBusiness`

**Input Fields**:
| Field      | Type                              | Validation Rules                          |
|------------|-----------------------------------|-------------------------------------------|
| `name`     | text input                        | Required, trimmed, non-empty              |
| `type`     | radio buttons                     | Required, \"taxi\" or \"water_delivery\"      |
| `mode`     | radio buttons                     | Required, \"auto\" or \"manual\"              |
| `status`   | toggle/switch                     | Required, \"enabled\" or \"disabled\"         |

**Display Fields** (List View):
- `name` - Business name
- `type` - Business type badge
- `employees` - Employee count
- `status` - Status badge
- `createdAt` - Formatted date

**Calculated Fields**:
- `employees`: Auto-incremented/decremented based on employee CRUD operations

**Field Flow**:
```
Form Input → Validation → Trim/Clean → Service → Store → UI Update
```

---

### 4.2 Employees Module

**Screens**: `EmployeesList`, `AddEmployee`, `EditEmployee`

**Input Fields**:
| Field          | Type                   | Validation Rules                              |
|----------------|------------------------|-----------------------------------------------|
| `fullName`     | text input             | Required, trimmed, non-empty                  |
| `mobile`       | phone input            | Required, digits only (cleaned automatically) |
| `businessId`   | dropdown/picker        | Required, must reference existing business    |
| `pin`          | secure text input      | Required, exactly 4 digits                    |
| `confirmPin`   | secure text input      | Must match `pin`                              |
| `status`       | toggle/switch          | Required, \"enabled\" or \"disabled\"             |

**Display Fields** (List View):
- `fullName` - Employee name
- `mobile` - Masked mobile number
- `businessName` - Parent business (badge)
- `businessType` - Type indicator (icon)
- `status` - Status badge
- `createdAt` - Formatted date

**Auto-Populated Fields**:
- `businessName`: Looked up from `businessId` during creation
- `businessType`: Inherited from parent business

**Field Flow**:
```
1. User selects businessId from dropdown
   ↓
2. Form validates and cleans:
   - fullName.trim()
   - mobile.replace(/\D/g, '')
   ↓
3. Service looks up Business by businessId:
   - businessName ← Business.name
   - businessType ← Business.type
   ↓
4. Store creates employee with all fields
   ↓
5. Side effect: Business.employees += 1
```

---

### 4.3 Vehicles Module (Taxi Only)

**Screens**: `AllVehicles`, `AddVehicle`, `EditVehicle`

**Input Fields**:
| Field             | Type           | Validation Rules                      |
|-------------------|----------------|---------------------------------------|
| `name`            | text input     | Required, trimmed                     |
| `number`          | text input     | Required, trimmed, uppercase          |
| `status`          | toggle         | Required, \"enabled\" or \"disabled\"     |
| `notes`           | multiline text | Optional                              |

**Display Fields** (List View):
- `name` - Vehicle model
- `number` - Registration number (uppercase)
- `status` - Status badge
- `assignedDriver` - Driver name (or \"Unassigned\")
- `notes` - Additional notes
- `updatedAt` - Last updated date

**Assignment Fields** (Set via AssignAssets):
- `assignedDriver`: Employee name (string)
- `assignedEmployeeId`: Employee ID reference

**Field Flow**:
```
Creation:
  Input → Trim/Uppercase → Generate ID & dates → Store

Assignment:
  Select Employee (businessType must be \"taxi\")
    ↓
  Vehicle.assignedEmployeeId ← Employee.id
  Vehicle.assignedDriver ← Employee.fullName
  Vehicle.updatedAt ← today's date
    ↓
  Notify UI
```

---

### 4.4 Hotels Module (Water Delivery Only)

**Screens**: `AllHotels`, `AddHotel`, `EditHotel`

**Input Fields**:
| Field         | Type           | Validation Rules                      |
|---------------|----------------|---------------------------------------|
| `name`        | text input     | Required, trimmed                     |
| `ratePerCan`  | numeric input  | Required, positive integer            |
| `status`      | toggle         | Required, \"enabled\" or \"disabled\"     |
| `location`    | text input     | Optional                              |

**Display Fields** (List View):
- `name` - Hotel name
- `ratePerCan` - Formatted price (₹XX)
- `status` - Status badge
- `location` - Address
- `assignedEmployeeName` - Assigned employee (or \"Unassigned\")
- `createdAt` - Creation date

**Assignment Fields** (Set via AssignAssets):
- `assignedEmployeeName`: Employee name (string)
- `assignedEmployeeId`: Employee ID reference

**Field Flow**:
```
Creation:
  Input → Validate ratePerCan > 0 → Trim name → Generate ID & date → Store

Assignment:
  Select Employee (businessType must be \"water_delivery\")
    ↓
  Hotel.assignedEmployeeId ← Employee.id
  Hotel.assignedEmployeeName ← Employee.fullName
    ↓
  Notify UI
```

---

### 4.5 AssignAssets Module

**Screens**: `AssignAssetsList`, `AssignAssetScreen`

**Input Fields**:
| Field         | Type                | Validation Rules                          |
|---------------|---------------------|-------------------------------------------|
| `employeeId`  | dropdown/picker     | Required, must exist                      |
| `assetType`   | auto-detected       | Based on employee's businessType          |
| `assetId`     | dropdown/picker     | Required, filtered by assetType           |

**Business Logic**:
```javascript
if (employee.businessType === \"taxi\") {
  assetType = \"vehicle\"
  assetOptions = vehicles.filter(v => v.status === \"enabled\")
} else if (employee.businessType === \"water_delivery\") {
  assetType = \"hotel\"
  assetOptions = hotels.filter(h => h.status === \"enabled\")
}
```

**Display Fields** (Assignment List):
- `employeeName` - Employee name
- `assetName` - Vehicle/Hotel name
- `assetType` - \"Vehicle\" or \"Hotel\" badge
- `businessName` - Parent business
- `assignedAt` - Assignment date

**Field Flow**:
```
1. Admin selects Employee
   ↓
2. System determines assetType from Employee.businessType
   ↓
3. System filters available assets (status = \"enabled\")
   ↓
4. Admin selects Asset
   ↓
5. System creates Assignment record
   ↓
6. System updates Asset's assignment fields
   ↓
7. UI updates across all dependent screens
```

---

### 4.6 Records Module

**Screens**: `RecordsHome`, `TaxiRecordDetails`, `WaterRecordDetails`

#### 4.6.1 Taxi Record Fields

**List View Display**:
- `driverName` - Driver name with avatar
- `vehicleName` - Vehicle model
- `vehicleNumber` - Registration number
- `date` - Record date
- `trips` - Number of trips
- `totalIncome` - Formatted currency (₹)
- `totalExpense` - Formatted currency (₹)
- `totalProfit` - Formatted currency (₹)
- `status` - \"Submitted\" or \"Pending\" badge

**Detail View Fields**:
- All list view fields
- `perKmRate` - Rate per kilometer
- `fuelExpense` - Fuel cost
- `settledToAdmin` - Amount settled
- `balanceShortage` - Balance shortage
- `tripDetails[]` - Array of individual trips:
  - `tripNumber` - Sequential number
  - `destination` - Trip destination
  - `distance` - Distance in km
  - `income` - Trip income
  - `expense` - Trip expense

**Calculated Fields**:
```javascript
trips = tripDetails.length
totalIncome = sum(tripDetails[].income)
totalExpense = sum(tripDetails[].expense) + fuelExpense
totalProfit = totalIncome - totalExpense
balanceShortage = totalIncome - settledToAdmin - totalExpense
```

#### 4.6.2 Water Delivery Record Fields

**List View Display**:
- `deliveryPersonName` - Delivery person name with avatar
- `date` - Record date
- `totalHotels` - Number of hotels served
- `totalCans` - Total cans dispatched
- `totalDelivered` - Cans delivered
- `totalReturned` - Cans returned
- `totalOutstanding` - Outstanding cans
- `totalIncome` - Formatted currency (₹)
- `totalExpense` - Formatted currency (₹)
- `totalProfit` - Formatted currency (₹)
- `status` - \"Submitted\" or \"Pending\" badge

**Detail View Fields**:
- All list view fields
- `hotelDeliveries[]` - Array of hotel-wise deliveries:
  - `hotelName` - Hotel name
  - `location` - Hotel address
  - `totalCans` - Cans dispatched
  - `deliveredCans` - Cans delivered
  - `returnedCans` - Cans returned
  - `outstandingCans` - Outstanding cans
  - `income` - Hotel income
  - `expense` - Hotel expense
  - `profit` - Hotel profit

**Calculated Fields**:
```javascript
totalHotels = hotelDeliveries.length
totalCans = sum(hotelDeliveries[].totalCans)
totalDelivered = sum(hotelDeliveries[].deliveredCans)
totalReturned = sum(hotelDeliveries[].returnedCans)
totalOutstanding = sum(hotelDeliveries[].outstandingCans)
totalIncome = sum(hotelDeliveries[].income)
totalExpense = sum(hotelDeliveries[].expense)
totalProfit = totalIncome - totalExpense
```

---

### 4.7 Dashboard Module

**Screen**: `DashboardScreen`

**Stat Cards** (Top Section):
| Field              | Source                                    | Display Format    |
|--------------------|-------------------------------------------|-------------------|
| `activeEmployees`  | Count(employees where status=\"enabled\")   | Number            |
| `submittedToday`   | Count(records where status=\"submitted\")   | Number            |
| `pendingToday`     | Count(records where status=\"pending\")     | Number            |
| `businesses`       | Count(businesses where status=\"enabled\")  | Number            |

**Business Cards** (Middle Section):
Per business, displays:
- `name` - Business name
- `category` - \"Taxi\" or \"Delivery\"
- `icon` - Business type icon
- `metrics[]`:
  - \"Total Income\": Sum of all records' `totalIncome` for the date
  - \"Total Expense's\": Sum of all records' `totalExpense` for the date
  - \"Net Profit\": `totalIncome - totalExpense`

**Submission Timeline** (Bottom Section):
- `employeeName` - Who submitted
- `businessName` - Parent business
- `date` - Submission date
- `time` - Submission time
- `status` - Submission status
- `avatarColor` - UI color

**Aggregation Logic**:
```javascript
For selected date:
  1. Fetch all driverRecords where date = selectedDate
  2. Fetch all waterDeliveryRecords where date = selectedDate
  3. Group by businessId
  4. For each business:
     - Sum totalIncome across all records
     - Sum totalExpense across all records
     - Calculate totalProfit = income - expense
  5. Count submitted vs pending records
  6. Format into BusinessOverview objects
```

---

## 5. Data Relationships & Dependencies

### 5.1 Entity Relationship Diagram

```
┌──────────────┐
│   BUSINESS   │ (Root Entity)
│              │
│ id           │
│ name         │──────────────────┐
│ type         │                  │
│ mode         │                  │
│ employees ◄──┼──────────┐       │
└──────┬───────┘          │       │
       │                  │       │
       │ 1:N              │       │
       │                  │       │
       ▼                  │       │
┌──────────────┐          │       │
│   EMPLOYEE   │          │       │
│              │          │       │
│ id           │          │       │
│ fullName     │          │       │
│ businessId ──┼──────────┘       │
│ businessName │◄─────────────────┘ (Denormalized)
│ businessType │◄─────────────────┐ (Inherited)
│ pin          │                  │
└──────┬───────┘                  │
       │                          │
       ├────────┬─────────────────┘
       │        │
       │        │ if businessType = \"taxi\"
       │        ▼
       │  ┌─────────────┐
       │  │   VEHICLE   │
       │  │             │
       │  │ id          │
       │  │ name        │
       │  │ number      │
       │  │ assignedEmployeeId ──┐
       │  │ assignedDriver       │ (1:1)
       │  └─────────────┘         │
       │                          │
       │  if businessType = \"water_delivery\"
       │        ▼                 │
       │  ┌─────────────┐         │
       │  │   HOTEL     │         │
       │  │             │         │
       │  │ id          │         │
       │  │ name        │         │
       │  │ ratePerCan  │         │
       │  │ assignedEmployeeId ──┤ (N:1)
       │  │ assignedEmployeeName  │
       │  └─────────────┘         │
       │                          │
       │◄─────────────────────────┘
       │
       ├── if taxi driver
       │        ▼
       │  ┌────────────────┐
       │  │ DRIVER_RECORD  │ (Daily)
       │  │                │
       │  │ id             │
       │  │ employeeId ────┼──┐
       │  │ vehicleId      │  │ (1 per employee per day)
       │  │ date           │  │
       │  │ tripDetails[]  │  │
       │  └────────────────┘  │
       │                      │
       └── if water staff     │
                ▼             │
          ┌────────────────┐  │
          │ WATER_DELIVERY │  │
          │ RECORD         │  │
          │                │  │
          │ id             │  │
          │ employeeId ────┼──┘
          │ date           │
          │ hotelDeliveries[]
          └────────────────┘
```

### 5.2 Data Dependencies Matrix

| Entity              | Depends On                          | Used By                                   |
|---------------------|-------------------------------------|-------------------------------------------|
| **Business**        | None (root)                         | Employee, Dashboard, Records              |
| **Employee**        | Business (businessId)               | Vehicle, Hotel, Records, Dashboard        |
| **Vehicle**         | Employee (optional assignment)      | Driver Record, Dashboard                  |
| **Hotel**           | Employee (optional assignment)      | Water Delivery Record, Dashboard          |
| **Driver Record**   | Employee, Vehicle                   | Dashboard, Records screen                 |
| **Water Record**    | Employee, Hotel (via deliveries)    | Dashboard, Records screen                 |
| **Assignment**      | Employee, Vehicle/Hotel, Business   | AssignAssets screen, Asset lists          |
| **Dashboard Data**  | All entities                        | Dashboard screen                          |

### 5.3 Field Propagation Chains

#### When a Business is Updated:

```
Business.name changes
  ↓
Propagates to:
  ├─► All Employees (businessName field)
  ├─► All Assignments (businessName field)
  ├─► Dashboard (business cards)
  └─► Records (business filter dropdown)
```

#### When an Employee is Updated:

```
Employee.fullName changes
  ↓
Propagates to:
  ├─► Assigned Vehicle (assignedDriver field)
  ├─► Assigned Hotels (assignedEmployeeName field)
  ├─► All Assignments (employeeName field)
  ├─► Driver Records (driverName field)
  ├─► Water Delivery Records (deliveryPersonName field)
  └─► Dashboard submissions (employeeName field)
```

#### When a Vehicle is Assigned:

```
Vehicle assignment created
  ↓
Updates:
  ├─► Vehicle.assignedEmployeeId ← Employee.id
  ├─► Vehicle.assignedDriver ← Employee.fullName
  ├─► Vehicle.updatedAt ← today
  │
  ▼
Reflects in:
  ├─► Vehicle List (shows assigned driver)
  ├─► AssignAssets List (assignment record)
  └─► Driver app (vehicle selection dropdown)
```

---

## 6. Field Validation & Business Rules

### 6.1 Business Entity Rules

| Rule ID | Rule Description                                      | Enforcement Point    |
|---------|-------------------------------------------------------|----------------------|
| BUS-01  | Business name must not be empty after trimming        | Form validation      |
| BUS-02  | Type must be either \"taxi\" or \"water_delivery\"        | Form validation      |
| BUS-03  | Mode must be either \"auto\" or \"manual\"                | Form validation      |
| BUS-04  | Status must be either \"enabled\" or \"disabled\"         | Form validation      |
| BUS-05  | Employee count auto-maintained (never user-editable)  | Service layer        |
| BUS-06  | Cannot delete business with active employees          | Service layer        |

### 6.2 Employee Entity Rules

| Rule ID | Rule Description                                      | Enforcement Point    |
|---------|-------------------------------------------------------|----------------------|
| EMP-01  | Full name must not be empty after trimming            | Form validation      |
| EMP-02  | Mobile must contain only digits                       | Auto-cleaned in service |
| EMP-03  | PIN must be exactly 4 digits                          | Form validation      |
| EMP-04  | PIN and confirm PIN must match                        | Form validation      |
| EMP-05  | Business ID must reference an existing business       | Service layer        |
| EMP-06  | Business name/type auto-populated from business       | Service layer        |
| EMP-07  | Cannot change businessId after creation               | Edit form restriction|
| EMP-08  | Deleting employee unassigns from assets               | Service layer        |
| EMP-09  | Deleting employee decrements parent business count    | Service layer        |

### 6.3 Vehicle Entity Rules

| Rule ID | Rule Description                                      | Enforcement Point    |
|---------|-------------------------------------------------------|----------------------|
| VEH-01  | Vehicle name must not be empty after trimming         | Form validation      |
| VEH-02  | Vehicle number must not be empty after trimming       | Form validation      |
| VEH-03  | Vehicle number converted to uppercase                 | Service layer        |
| VEH-04  | Vehicle number should be unique (recommended)         | Service layer        |
| VEH-05  | Can only assign employees with businessType=\"taxi\"    | Assignment logic     |
| VEH-06  | Assignment is 1:1 (one vehicle → one employee)        | Assignment logic     |
| VEH-07  | Assigning updates both ID and name fields             | Assignment logic     |
| VEH-08  | Unassigning clears both ID and name fields            | Assignment logic     |
| VEH-09  | Updated date refreshed on any modification            | Service layer        |

### 6.4 Hotel Entity Rules

| Rule ID | Rule Description                                           | Enforcement Point    |
|---------|------------------------------------------------------------|----------------------|
| HOT-01  | Hotel name must not be empty after trimming                | Form validation      |
| HOT-02  | Rate per can must be positive integer                      | Form validation      |
| HOT-03  | No decimal values allowed for ratePerCan                   | Form validation      |
| HOT-04  | Can only assign employees with businessType=\"water_delivery\" | Assignment logic   |
| HOT-05  | Assignment is N:1 (many hotels → one employee)             | Assignment logic     |
| HOT-06  | Assigning updates both ID and name fields                  | Assignment logic     |
| HOT-07  | Unassigning clears both ID and name fields                 | Assignment logic     |

### 6.5 Record Entity Rules

#### Taxi Records:

| Rule ID | Rule Description                                      | Enforcement Point    |
|---------|-------------------------------------------------------|----------------------|
| TRX-01  | One record per employee per date                      | Service layer        |
| TRX-02  | Trips count = tripDetails.length                      | Calculated field     |
| TRX-03  | Total income = sum of trip incomes                    | Calculated field     |
| TRX-04  | Total expense = sum of trip expenses + fuel expense   | Calculated field     |
| TRX-05  | Total profit = totalIncome - totalExpense             | Calculated field     |
| TRX-06  | Balance shortage = income - settled - expense         | Calculated field     |
| TRX-07  | Cannot submit record without at least 1 trip          | Submission validation|
| TRX-08  | Record date must not be in the future                 | Submission validation|

#### Water Delivery Records:

| Rule ID | Rule Description                                      | Enforcement Point    |
|---------|-------------------------------------------------------|----------------------|
| WTR-01  | One record per employee per date                      | Service layer        |
| WTR-02  | Total hotels = hotelDeliveries.length                 | Calculated field     |
| WTR-03  | Total cans = sum of hotelDeliveries[].totalCans       | Calculated field     |
| WTR-04  | Total delivered = sum of deliveredCans                | Calculated field     |
| WTR-05  | Total returned = sum of returnedCans                  | Calculated field     |
| WTR-06  | Total outstanding = sum of outstandingCans            | Calculated field     |
| WTR-07  | Total income = sum of hotelDeliveries[].income        | Calculated field     |
| WTR-08  | Total expense = sum of hotelDeliveries[].expense      | Calculated field     |
| WTR-09  | Total profit = totalIncome - totalExpense             | Calculated field     |
| WTR-10  | Cannot submit without at least 1 hotel delivery       | Submission validation|

### 6.6 Assignment Entity Rules

| Rule ID | Rule Description                                      | Enforcement Point    |
|---------|-------------------------------------------------------|----------------------|
| ASN-01  | Employee business type must match asset type          | Assignment logic     |
| ASN-02  | \"taxi\" employees can only be assigned vehicles        | Assignment logic     |
| ASN-03  | \"water_delivery\" employees can only be assigned hotels| Assignment logic     |
| ASN-04  | One vehicle can be assigned to only one employee      | Assignment logic     |
| ASN-05  | Multiple hotels can be assigned to one employee       | Assignment logic     |
| ASN-06  | Cannot assign disabled employees                      | Assignment logic     |
| ASN-07  | Cannot assign disabled assets                         | Assignment logic     |

---

## 7. Service Layer Field Transformations

### 7.1 Input Sanitization

| Service              | Field           | Transformation                        | Purpose                |
|----------------------|-----------------|---------------------------------------|------------------------|
| businessService      | `name`          | `.trim()`                             | Remove whitespace      |
| employeeService      | `fullName`      | `.trim()`                             | Remove whitespace      |
| employeeService      | `mobile`        | `.replace(/\D/g, '')`                 | Keep only digits       |
| vehicleService       | `name`          | `.trim()`                             | Remove whitespace      |
| vehicleService       | `number`        | `.trim().toUpperCase()`               | Normalize format       |
| hotelService         | `name`          | `.trim()`                             | Remove whitespace      |

### 7.2 Field Generation (Auto-populated)

| Service              | Generated Field    | Generation Logic                             |
|----------------------|--------------------|----------------------------------------------|
| businessService      | `id`               | UUID v4 or custom ID generator               |
| businessService      | `employees`        | Initialized to 0                             |
| businessService      | `createdAt`        | Current date (YYYY-MM-DD)                    |
| employeeService      | `id`               | UUID v4 or custom ID generator               |
| employeeService      | `businessName`     | Lookup from Business by `businessId`         |
| employeeService      | `businessType`     | Lookup from Business by `businessId`         |
| employeeService      | `createdAt`        | Current date (YYYY-MM-DD)                    |
| vehicleService       | `id`               | UUID v4 or custom ID generator               |
| vehicleService       | `createdAt`        | Current date (YYYY-MM-DD)                    |
| vehicleService       | `updatedAt`        | Current date (YYYY-MM-DD)                    |
| hotelService         | `id`               | UUID v4 or custom ID generator               |
| hotelService         | `createdAt`        | Current date (YYYY-MM-DD)                    |
| recordsService       | `avatarColor`      | Random color from predefined palette         |

### 7.3 Field Lookup & Denormalization

When creating/updating entities, certain fields are denormalized for performance:

```javascript
// Employee Creation
async function createEmployee(values) {
  // Lookup business details
  const business = await getBusinessById(values.businessId);
  
  return {
    ...values,
    businessName: business.name,      // Denormalized
    businessType: business.type,      // Denormalized
  };
}

// Vehicle Assignment
async function assignEmployeeToVehicle(vehicleId, employeeId) {
  // Lookup employee details
  const employee = await getEmployeeById(employeeId);
  
  return updateVehicle(vehicleId, {
    assignedEmployeeId: employeeId,
    assignedDriver: employee.fullName,  // Denormalized
    updatedAt: today(),
  });
}
```

### 7.4 Side Effect Processing

| Operation                 | Side Effect                                       | Service Layer Logic |
|---------------------------|---------------------------------------------------|---------------------|
| Create Employee           | Increment `Business.employees`                    | employeeService     |
| Delete Employee           | Decrement `Business.employees`                    | employeeService     |
| Delete Employee           | Unassign from Vehicle (set fields to null)        | employeeService     |
| Delete Employee           | Unassign from Hotels (set fields to null)         | employeeService     |
| Assign Vehicle            | Set `assignedEmployeeId` and `assignedDriver`     | vehicleService      |
| Unassign Vehicle          | Clear `assignedEmployeeId` and `assignedDriver`   | vehicleService      |
| Assign Hotel              | Set `assignedEmployeeId` and `assignedEmployeeName` | hotelService      |
| Unassign Hotel            | Clear `assignedEmployeeId` and `assignedEmployeeName` | hotelService    |
| Update Vehicle/Hotel      | Update `updatedAt` timestamp                      | vehicleService      |

---

## 8. Cross-Module Field Usage

### 8.1 Business Fields Referenced Across Modules

| Business Field | Referenced In                              | Purpose                              |
|----------------|--------------------------------------------|--------------------------------------|
| `id`           | Employee (businessId), Dashboard, Records  | Foreign key relationship             |
| `name`         | Employee, Dashboard cards, Records filter  | Display business name                |
| `type`         | Employee, AssignAssets, Records            | Determine asset type, filter logic   |
| `status`       | Dashboard stats, Business list             | Filter active businesses             |
| `employees`    | Business list card                         | Show employee count badge            |

### 8.2 Employee Fields Referenced Across Modules

| Employee Field    | Referenced In                              | Purpose                              |
|-------------------|--------------------------------------------|--------------------------------------|
| `id`              | Vehicle, Hotel, Records, Assignments       | Foreign key relationship             |
| `fullName`        | Vehicle, Hotel, Records, Dashboard         | Display employee name                |
| `businessId`      | Records filter, Assignment validation      | Link to parent business              |
| `businessType`    | AssignAssets (determine asset type)        | Control asset type selection         |
| `status`          | Dashboard (active employees count)         | Filter enabled employees             |

### 8.3 Vehicle Fields Referenced Across Modules

| Vehicle Field       | Referenced In                       | Purpose                              |
|---------------------|-------------------------------------|--------------------------------------|
| `id`                | Driver Records, Assignments         | Foreign key relationship             |
| `name`              | Driver Records, Assignments         | Display vehicle name                 |
| `number`            | Driver Records                      | Display registration number          |
| `assignedDriver`    | Vehicle list, Assignments           | Show assigned driver name            |
| `assignedEmployeeId`| Driver Records (validate ownership) | Link to employee                     |
| `status`            | Vehicle list filter                 | Filter active vehicles               |

### 8.4 Hotel Fields Referenced Across Modules

| Hotel Field            | Referenced In                       | Purpose                              |
|------------------------|-------------------------------------|--------------------------------------|
| `id`                   | Water Records, Assignments          | Foreign key relationship             |
| `name`                 | Water Records, Assignments          | Display hotel name                   |
| `ratePerCan`           | Water Records (calculate income)    | Calculate hotel income               |
| `location`             | Water Records, Hotel list           | Display location                     |
| `assignedEmployeeName` | Hotel list, Assignments             | Show assigned employee               |
| `assignedEmployeeId`   | Water Records (validate ownership)  | Link to employee                     |
| `status`               | Hotel list filter                   | Filter active hotels                 |

### 8.5 Record Fields Referenced Across Modules

#### Driver Record Fields:

| Driver Record Field | Referenced In                       | Purpose                              |
|---------------------|-------------------------------------|--------------------------------------|
| `id`                | Records details, Dashboard          | Unique identifier                    |
| `employeeId`        | Dashboard submissions               | Link to employee                     |
| `date`              | Records filter, Dashboard           | Filter by date                       |
| `status`            | Records list, Dashboard stats       | Filter submitted/pending             |
| `totalIncome`       | Dashboard business metrics          | Aggregate income                     |
| `totalExpense`      | Dashboard business metrics          | Aggregate expense                    |
| `totalProfit`       | Dashboard business metrics          | Aggregate profit                     |

#### Water Delivery Record Fields:

| Water Record Field | Referenced In                       | Purpose                              |
|--------------------|-------------------------------------|--------------------------------------|
| `id`               | Records details, Dashboard          | Unique identifier                    |
| `employeeId`       | Dashboard submissions               | Link to employee                     |
| `date`             | Records filter, Dashboard           | Filter by date                       |
| `status`           | Records list, Dashboard stats       | Filter submitted/pending             |
| `totalIncome`      | Dashboard business metrics          | Aggregate income                     |
| `totalExpense`     | Dashboard business metrics          | Aggregate expense                    |
| `totalProfit`      | Dashboard business metrics          | Aggregate profit                     |

---

## Summary

This analysis document provides a comprehensive mapping of all data fields flowing through the Admin module of the Yalini Mobile application. Key findings:

1. **7 Core Entities**: Business, Employee, Vehicle, Hotel, Driver Record, Water Delivery Record, Assignment
2. **80+ Unique Data Fields** across all entities
3. **Complex Field Relationships**: Including foreign keys, denormalized fields, and calculated fields
4. **Auto-populated Fields**: System-generated IDs, timestamps, and lookups from parent entities
5. **Data Flow Architecture**: Clear separation between UI → Hooks → Services → Store
6. **Field Transformations**: Input sanitization, denormalization for performance
7. **Cross-module Dependencies**: Extensive field usage across multiple screens

The application uses a well-structured mock service layer designed for easy backend migration, with all data relationships and business rules clearly defined and enforced at the service layer.

---

**Document Version**: 1.0  
**Analysis Date**: 2026-01-XX  
**Repository**: https://github.com/sathiyan-sk/yalini_mobile-UI.git
