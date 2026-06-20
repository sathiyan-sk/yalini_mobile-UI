/**
 * Type contracts for the Staff (Water Delivery) StartDay module.
 */

export interface HotelAssignment {
  hotelId: string;
  hotelName: string;
  location?: string;
}

export interface StaffAssignment {
  hotelCount: number;
  hotels: HotelAssignment[];
  isAssigned: boolean;
}

export interface StaffInfo {
  id: string;
  name: string;
  businessName: string;
  businessType: 'water_delivery';
  role: 'Staff';
}

export interface StaffStartDayData {
  staff: StaffInfo;
  assignment: StaffAssignment | null;
}
