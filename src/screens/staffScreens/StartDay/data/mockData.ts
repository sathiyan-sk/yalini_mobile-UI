/**
 * Mock data for Staff (Water Delivery) StartDay screen.
 * This demonstrates both assigned and unassigned scenarios.
 */

import type { StaffStartDayData } from '../types';

// Mock data for staff with assigned hotels
export const STAFF_WITH_HOTELS: StaffStartDayData = {
  staff: {
    id: 'emp_seed_suresh',
    name: 'Suresh Kumar',
    businessName: 'Yalini Delivery Service',
    businessType: 'water_delivery',
    role: 'Staff',
  },
  assignment: {
    hotelCount: 3,
    hotels: [
      {
        hotelId: 'hotel_seed_golden_palace',
        hotelName: 'Hotel Golden Palace',
        location: 'MG Road, Sector 5',
      },
      {
        hotelId: 'hotel_seed_royal_inn',
        hotelName: 'Royal Inn',
        location: 'Anna Nagar, Block B',
      },
      {
        hotelId: 'hotel_seed_green_valley',
        hotelName: 'Green Valley Resort',
        location: 'Velachery Main Road',
      },
    ],
    isAssigned: true,
  },
};

// Mock data for staff without assigned hotels
export const STAFF_WITHOUT_HOTELS: StaffStartDayData = {
  staff: {
    id: 'emp_seed_suresh',
    name: 'Suresh Kumar',
    businessName: 'Yalini Delivery Service',
    businessType: 'water_delivery',
    role: 'Staff',
  },
  assignment: null,
};

// Default mock data (with hotels assigned)
export const DEFAULT_STAFF_DATA = STAFF_WITH_HOTELS;
