import { Navigate } from 'react-router-dom';
import { useAppParams } from '@/routing';

export default function AdminEventDetailIndex() {
  const { id: eventId = '' } = useAppParams();

  return (
    <Navigate to={`/admin/events/${eventId}/application-questions`} replace />
  );
}
