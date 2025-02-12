import { TicketPriority } from '../types/ticket';

interface PriorityBadgeProps {
  bgColor: string;
  textColor: string;
  label: string;
}

export const getPriorityBadgeProps = (priority: TicketPriority): PriorityBadgeProps => {
  switch (priority) {
    case 'low':
      return {
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        label: 'Niedrig'
      };
    case 'medium':
      return {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        label: 'Mittel'
      };
    case 'high':
      return {
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        label: 'Hoch'
      };
    case 'critical':
      return {
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        label: 'Kritisch'
      };
    default:
      return {
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        label: 'Unbekannt'
      };
  }
};
