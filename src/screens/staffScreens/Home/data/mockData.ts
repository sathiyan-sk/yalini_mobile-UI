/**
 * Mock data for Staff Home Screen
 */
import type { StaffSessionData } from '../types';

export const MOCK_STAFF_SESSION: StaffSessionData = {
  staffId: 'staff_001',
  staffName: 'Rajan Kumar',
  businessName: 'Yalini Minerals',
  sessionDate: new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
  sessionTime: new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }),
  assignedHotels: [
    {
      hotelId: 'hotel_001',
      hotelName: 'Grand Palace Hotel',
      location: 'Anna Nagar',
    },
    {
      hotelId: 'hotel_002',
      hotelName: 'Royal Inn',
      location: 'T Nagar',
    },
    {
      hotelId: 'hotel_003',
      hotelName: 'Sunrise Lodge',
      location: 'Velachery',
    },
    {
      hotelId: 'hotel_004',
      hotelName: 'City View Hotel',
      location: 'Adyar',
    },
  ],
  overview: {
    assignedHotels: 4,
    deliveriesDone: 0,
    cashCollected: 0,
    creditSales: 0,
  },
};
