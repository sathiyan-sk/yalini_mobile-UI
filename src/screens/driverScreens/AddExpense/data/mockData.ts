/**
 * Mock data for AddExpense screen
 * Contains trip data and expense categories
 */

import type { TripData, ExpenseCategory, ExpenseFormData } from '../../../../types/driver';

// Mock trip data that comes from AddTrip screen
export const MOCK_TRIP_DATA: TripData = {
  tripId: 'T-2024-05-10-001',
  from: 'Coimbatore',
  to: 'Airport',
  date: '10 May 2024',
  time: '08:30 AM',
  paymentMode: 'Cash',
  amount: 650,
};

// Expense categories with default values
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: 'fuel',
    name: 'Fuel',
    subtitle: 'Petrol / Diesel',
    icon: 'local-gas-station',
    iconLibrary: 'MaterialIcons',
    color: '#22C55E',
    backgroundColor: '#DCFCE7',
    defaultValue: 110,
  },
  {
    id: 'toll',
    name: 'Toll',
    subtitle: 'Toll charges',
    icon: 'toll',
    iconLibrary: 'MaterialIcons',
    color: '#1E88E5',
    backgroundColor: '#E3F2FD',
    defaultValue: 40,
  },
  {
    id: 'food',
    name: 'Food',
    subtitle: 'Meals / Snacks',
    icon: 'restaurant',
    iconLibrary: 'MaterialIcons',
    color: '#F59E0B',
    backgroundColor: '#FEF3C7',
    defaultValue: 30,
  },
  {
    id: 'other',
    name: 'Other',
    subtitle: 'Parking, Tips, etc.',
    icon: 'more-horiz',
    iconLibrary: 'MaterialIcons',
    color: '#6366F1',
    backgroundColor: '#E0E7FF',
    defaultValue: 20,
  },
];

// Initial form data - starts with zeros for new expenses
export const INITIAL_EXPENSE_FORM: ExpenseFormData = {
  fuel: '0',
  toll: '0',
  food: '0',
  other: '0',
  notes: '',
};
