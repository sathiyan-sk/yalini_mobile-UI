/**
 * Delivery Service - Mock Service Layer implementation.
 *
 * This service handles delivery record operations using the mock data store.
 * To wire a real backend, replace the mock store calls with API calls.
 * 
 * STRUCTURE FOR BACKEND INTEGRATION:
 * - All functions return Promises for async compatibility
 * - Data shapes match backend API expectations
 * - Mock latency simulates real network behavior
 * - Now uses central mockData store for hotels 
 */

import { USE_MOCK, API_CONFIG } from './featureFlags';
import { 
  getHotels, 
  generateId, 
  todayISODate,
  createWaterDeliveryRecord,
  getEmployeeById,
} from './mockData';
import type { MockHotel, MockWaterDeliveryRecord, HotelDelivery } from './mockData/types';
import type {
  HotelOption,
  DeliveryRecord,
  DeliveryFormValues,
  DeliverySessionData,
  SessionStatus,
} from '../screens/staffScreens/AddDelivery/types';

/** Staff configuration - defaults to emp_seed_mani for demo */
const STAFF_CONFIG = {
  staffId: 'emp_seed_mani',
  staffName: 'Mani Kumar',
  businessName: 'Yalini Minerals',
};

function toHotelOption(hotel: MockHotel): HotelOption {
  return {
    id: hotel.id,
    name: hotel.name,
    ratePerCan: hotel.ratePerCan,
    location: hotel.location,
    status: hotel.status,
  };
}

/** In-memory store for delivery records during a session */
let deliveryRecords: DeliveryRecord[] = [];

/** Current session data */
let currentSession: DeliverySessionData | null = null;

/**
 * Simulates network latency for realistic async behavior.
 * @returns Promise that resolves after delay
 */
async function simulateLatency(): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 150));
  }
}

/**
 * Loads all enabled hotels from the admin master list.
 * Uses the central mock data store for consistency with admin hotel management.
 * 
 * BACKEND INTEGRATION:
 * Replace with: GET /api/v1/hotels?status=enabled
 * 
 * @returns Promise resolving to array of hotel options
 */
export async function loadHotelsForDelivery(): Promise<HotelOption[]> {
  if (USE_MOCK) {    // Get hotels from central store (already has latency simulation)
    const allHotels = await getHotels();
    // Filter for enabled hotels and convert to HotelOption type
    return allHotels
      .filter(h => h.status === 'enabled')
      .map(toHotelOption);
  }
  
  // Real backend call (when USE_MOCK is false)
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/hotels?status=enabled`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to load hotels');
  }
  
  return response.json();
}

/**
 * Gets the current delivery session data.
 * Creates a mock session if none exists.
 * 
 * BACKEND INTEGRATION:
 * Replace with: GET /api/v1/sessions/current or POST /api/v1/sessions/start
 * 
 * @returns Promise resolving to session data
 */
export async function getDeliverySession(): Promise<DeliverySessionData> {
  if (USE_MOCK) {
    await simulateLatency();
    
    if (!currentSession) {
      // Create mock session data
      const now = new Date();
      currentSession = {
        id: generateId('session'),
        staffName: 'Mani Kumar',
        serviceName: 'Yalini Minerals',
        sessionDate: now.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        sessionTime: now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        sessionStatus: 'ACTIVE',
      };
    }
    
    return currentSession;
  }
  
  // Real backend call
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/sessions/current`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to get session');
  }
  
  return response.json();
}

/**
 * Updates the session status.
 * 
 * BACKEND INTEGRATION:
 * Replace with: PATCH /api/v1/sessions/{sessionId}/status
 * 
 * @param status - New session status
 */
export async function updateSessionStatus(status: SessionStatus): Promise<void> {
  if (USE_MOCK) {
    await simulateLatency();
    if (currentSession) {
      currentSession = { ...currentSession, sessionStatus: status };
    }
    return;
  }
  
  // Real backend call
  const sessionId = currentSession?.id;
  if (!sessionId) throw new Error('No active session');
  
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/sessions/${sessionId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update session status');
  }
}

/**
 * Saves a new delivery record.
 * Includes all new fields: loadedCans, estAmount, receivedIncome, expense fields.
 * 
 * BACKEND INTEGRATION:
 * Replace with: POST /api/v1/deliveries
 * 
 * @param formValues - The delivery form data
 * @returns Promise resolving to the created delivery record
 */
export async function saveDeliveryRecord(
  formValues: DeliveryFormValues
): Promise<DeliveryRecord> {
  if (USE_MOCK) {
    await simulateLatency();
    
    const newRecord: DeliveryRecord = {
      id: generateId('delivery'),
      hotelId: formValues.hotelId,
      hotelName: formValues.hotelName,
      ratePerCan: formValues.ratePerCan,
      loadedCans: formValues.loadedCans,
      cansDelivered: formValues.cansDelivered,
      cansReturned: formValues.cansReturned,
      outstandingCans: formValues.outstandingCans,
      estAmount: formValues.estAmount,
      receivedIncome: formValues.receivedIncome,
      paymentMode: formValues.paymentMode,
      expenseCategory: formValues.expenseCategory,
      expenseAmount: formValues.expenseAmount,
      createdAt: new Date().toISOString(),
    };
    
    deliveryRecords = [newRecord, ...deliveryRecords];
    return newRecord;
  }
  
  // Real backend call
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/deliveries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formValues),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save delivery');
  }
  
  return response.json();
}

/**
 * Updates an existing delivery record.
 * 
 * BACKEND INTEGRATION:
 * Replace with: PATCH /api/v1/deliveries/{deliveryId}
 * 
 * @param id - The delivery record ID
 * @param updates - Partial delivery data to update
 * @returns Promise resolving to updated delivery record
 */
export async function updateDeliveryRecord(
  id: string,
  updates: Partial<DeliveryRecord>
): Promise<DeliveryRecord> {
  if (USE_MOCK) {
    await simulateLatency();
    
    const index = deliveryRecords.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Delivery record not found');
    }
    
    const updated = { ...deliveryRecords[index], ...updates };
    deliveryRecords = deliveryRecords.map(r => r.id === id ? updated : r);
    return updated;
  }
  
  // Real backend call
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/deliveries/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update delivery');
  }
  
  return response.json();
}

/**
 * Gets all delivery records for the current session.
 * 
 * BACKEND INTEGRATION:
 * Replace with: GET /api/v1/deliveries?sessionId={sessionId}
 * 
 * @returns Promise resolving to array of delivery records
 */
export async function getDeliveryRecords(): Promise<DeliveryRecord[]> {
  if (USE_MOCK) {
    await simulateLatency();
    return [...deliveryRecords];
  }
  
  // Real backend call
  const sessionId = currentSession?.id;
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/deliveries?sessionId=${sessionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to get delivery records');
  }
  
  return response.json();
}

/**
 * Gets a delivery record by ID.
 * 
 * BACKEND INTEGRATION:
 * Replace with: GET /api/v1/deliveries/{deliveryId}
 * 
 * @param id - The delivery record ID
 * @returns Promise resolving to delivery record or undefined
 */
export async function getDeliveryRecordById(
  id: string
): Promise<DeliveryRecord | undefined> {
  if (USE_MOCK) {
    await simulateLatency();
    return deliveryRecords.find(r => r.id === id);
  }
  
  // Real backend call
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/deliveries/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (response.status === 404) {
    return undefined;
  }
  
  if (!response.ok) {
    throw new Error('Failed to get delivery record');
  }
  
  return response.json();
}

/**
 * Deletes a delivery record by ID.
 * 
 * BACKEND INTEGRATION:
 * Replace with: DELETE /api/v1/deliveries/{deliveryId}
 * 
 * @param id - The delivery record ID
 */
export async function deleteDeliveryRecord(id: string): Promise<void> {
  if (USE_MOCK) {
    await simulateLatency();
    deliveryRecords = deliveryRecords.filter(r => r.id !== id);
    return;
  }
  
  // Real backend call
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/deliveries/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete delivery record');
  }
}

/**
 * Resets the delivery session (for testing or new day).
 * This clears all in-memory data.
 */
export function resetDeliverySession(): void {
  deliveryRecords = [];
  currentSession = null;
}
// Avatar colors for staff records (created same as from driver module)
const AVATAR_COLORS = [
  '#1E88E5', // Blue
  '#7C3AED', // Purple
  '#059669', // Green
  '#EA580C', // Orange
  '#8B5CF6', // Vivid Purple
  '#0D9488', // Teal
  '#0891B2', // Cyan
];

function getRandomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

/**
 * Submission data for staff session
 */
export interface StaffSessionSubmissionData {
  /** Staff/employee ID */
  staffId: string;
  /** Staff name */
  staffName: string;
  /** List of delivery records from the session */
  deliveries: DeliveryRecord[];
  /** Total income received */
  totalIncome: number;
  /** Total expenses incurred */
  totalExpense: number;
  /** Net amount (income - expense) */
  netAmount: number;
}

/**
 * Response from session submission
 */
export interface StaffSessionSubmissionResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  submittedAt?: string;
}

/**
 * Submit staff delivery session to the central store.
 * This is the KEY function that creates a MockWaterDeliveryRecord in the
 * central store, making the submission visible to Admin's Records screen.
 * 
 * BACKEND INTEGRATION:
 * Replace with: POST /api/v1/staff/session/submit
 * 
 * @param data - Session submission data including all deliveries
 * @returns Promise resolving to submission response
 */
export async function submitStaffSession(
  data: StaffSessionSubmissionData
): Promise<StaffSessionSubmissionResponse> {
  if (USE_MOCK) {
    await simulateLatency();

    // Get staff/employee information
    let staffName = data.staffName || STAFF_CONFIG.staffName;
    const staffId = data.staffId || STAFF_CONFIG.staffId;

    // Try to get actual employee name from store
    const employee = await getEmployeeById(staffId);
    if (employee) {
      staffName = employee.fullName;
    }

    // Convert delivery records to HotelDelivery format
    // Group by hotel and aggregate
    const hotelMap = new Map<string, HotelDelivery>();

    data.deliveries.forEach((delivery, index) => {
      const existing = hotelMap.get(delivery.hotelId);
      if (existing) {
        // Aggregate with existing hotel entry
        existing.totalCans += delivery.loadedCans;
        existing.deliveredCans += delivery.cansDelivered;
        existing.returnedCans += delivery.cansReturned;
        existing.outstandingCans += delivery.outstandingCans;
        existing.income += delivery.receivedIncome;
        existing.expense += delivery.expenseAmount || 0;
        existing.profit = existing.income - existing.expense;
      } else {
        // Create new hotel entry
        hotelMap.set(delivery.hotelId, {
          id: `hoteldelivery_${delivery.hotelId}_${Date.now()}_${index}`,
          hotelName: delivery.hotelName,
          location: '', // Location info not captured in delivery form
          totalCans: delivery.loadedCans,
          deliveredCans: delivery.cansDelivered,
          returnedCans: delivery.cansReturned,
          outstandingCans: delivery.outstandingCans,
          income: delivery.receivedIncome,
          expense: delivery.expenseAmount || 0,
          profit: delivery.receivedIncome - (delivery.expenseAmount || 0),
        });
      }
    });

    const hotelDeliveries = Array.from(hotelMap.values());

    // Calculate totals
    const totals = hotelDeliveries.reduce(
      (acc, hotel) => ({
        totalHotels: acc.totalHotels + 1,
        totalCans: acc.totalCans + hotel.totalCans,
        totalDelivered: acc.totalDelivered + hotel.deliveredCans,
        totalReturned: acc.totalReturned + hotel.returnedCans,
        totalOutstanding: acc.totalOutstanding + hotel.outstandingCans,
        totalIncome: acc.totalIncome + hotel.income,
        totalExpense: acc.totalExpense + hotel.expense,
        totalProfit: acc.totalProfit + hotel.profit,
      }),
      {
        totalHotels: 0,
        totalCans: 0,
        totalDelivered: 0,
        totalReturned: 0,
        totalOutstanding: 0,
        totalIncome: 0,
        totalExpense: 0,
        totalProfit: 0,
      }
    );

    // Create the water delivery record for central store
    const recordData: Omit<MockWaterDeliveryRecord, 'id'> = {
      deliveryPersonName: staffName,
      employeeId: staffId,
      date: todayISODate(),
      status: 'submitted',
      avatarColor: getRandomAvatarColor(),
      ...totals,
      hotelDeliveries,
    };

    // Save to central store - Admin will see this immediately!
    const createdRecord = await createWaterDeliveryRecord(recordData);

    // Clear local session data after successful submission
    deliveryRecords = [];

    return {
      success: true,
      message: 'Session submitted successfully',
      submissionId: createdRecord.id,
      submittedAt: new Date().toISOString(),
    };
  }

  // Real API call
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/staff/session/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Submission failed' }));
    return {
      success: false,
      message: error.message || 'Failed to submit session',
    };
  }

  return response.json();
}

/**
 * Get staff session for a specific employee ID (used by StartDay screen).
 * Uses centralized staff config.
 */
export async function getStaffHomeData() {
  if (USE_MOCK) {
    await simulateLatency();

    const employee = await getEmployeeById(STAFF_CONFIG.staffId);
    
    if (employee) {
      return {
        staff: {
          id: employee.id,
          name: employee.fullName,
          businessName: employee.businessName,
          businessType: employee.businessType,
          role: 'Staff',
        },
        sessionStatus: 'OPEN',
        sessionDate: formatDisplayDate(todayISODate()),
      };
    }

    // Fallback to config
    return {
      staff: {
        id: STAFF_CONFIG.staffId,
        name: STAFF_CONFIG.staffName,
        businessName: STAFF_CONFIG.businessName,
        businessType: 'water_delivery',
        role: 'Staff',
      },
      sessionStatus: 'OPEN',
      sessionDate: formatDisplayDate(todayISODate()),
    };
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/staff/home`);
  if (!response.ok) throw new Error('Failed to fetch staff home data');
  return response.json();
}

/**
 * Format date for display (e.g., \"22 Jun 2026\")
 */
function formatDisplayDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}
