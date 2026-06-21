/**
 * Type definitions for AllDeliveries Screen
 * Types for displaying and managing saved delivery records.
 */

import type { DeliveryRecord, DeliverySessionData } from '../AddDelivery/types';

/**
 * Props for the DeliveryCard component.
 */
export interface DeliveryCardProps {
  /** The delivery record to display */
  delivery: DeliveryRecord;
  /** Handler when card is pressed */
  onPress: () => void;
  /** Handler when edit button is pressed */
  onEdit: () => void;
}

/**
 * Summary statistics for all deliveries.
 */
export interface DeliverySummary {
  /** Total number of deliveries */
  totalDeliveries: number;
  /** Total cans delivered */
  totalCansDelivered: number;
  /** Total income received */
  totalIncome: number;
  /** Total expense amount */
  totalExpense: number;
  /** Net amount (income - expense) */
  netAmount: number;
}

/**
 * AllDeliveries screen state.
 */
export interface AllDeliveriesState {
  /** Session data */
  session: DeliverySessionData;
  /** List of delivery records */
  deliveries: DeliveryRecord[];
  /** Loading state */
  isLoading: boolean;
  /** Summary stats */
  summary: DeliverySummary;
}
