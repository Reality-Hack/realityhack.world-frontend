import { useSession } from '@/auth/client';
import {
  eventsActivateCreate,
  getApplicationquestionsListKey,
  getEventdestinyhardwareListKey,
  getEventsListKey,
  getEventtracksListKey,
  getSponsoreventengagementsListKey,
  useEventsRetrieve,
} from '@/types/endpoints';
import { ApplicationquestionsListFormType, Event } from '@/types/models';
import { useAppParams } from '@/routing';
import { DateTime } from 'luxon';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import type { KeyedMutator } from 'swr';

type AdminEventContextType = {
  eventId: string;
  event: Event | undefined;
  basePath: string;
  isQueryEnabled: boolean;
  isLoading: boolean;
  mutateEvent: KeyedMutator<Event>;
  activateEvent: () => Promise<void>;
  formatEventDate: (date: string) => string;
  invalidateEventTabCaches: () => Promise<void>;
  invalidateQuestionsCache: (
    formType?: ApplicationquestionsListFormType,
  ) => Promise<void>;
  invalidatePrizesCache: () => Promise<void>;
};

const AdminEventContext = createContext<AdminEventContextType | undefined>(
  undefined,
);

export function AdminEventProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { id: eventId = '' } = useAppParams();
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const isQueryEnabled = !!session?.access_token && !!eventId;
  const basePath = `/admin/events/${eventId}`;

  const {
    data: event,
    isLoading,
    mutate: mutateEvent,
  } = useEventsRetrieve(eventId, {
    swr: { enabled: isQueryEnabled },
  });

  const formatEventDate = useCallback((date: string): string => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT);
  }, []);

  const invalidateQuestionsCache = useCallback(
    async (
      formType?: ApplicationquestionsListFormType,
    ): Promise<void> => {
      if (formType) {
        await mutate(
          getApplicationquestionsListKey({ event: eventId, form_type: formType }),
        );
        return;
      }

      await Promise.all([
        mutate(
          getApplicationquestionsListKey({
            event: eventId,
            form_type: ApplicationquestionsListFormType.A,
          }),
        ),
        mutate(
          getApplicationquestionsListKey({
            event: eventId,
            form_type: ApplicationquestionsListFormType.R,
          }),
        ),
      ]);
    },
    [eventId, mutate],
  );

  const invalidatePrizesCache = useCallback(async (): Promise<void> => {
    await Promise.all([
      mutate(getEventtracksListKey({ event: eventId })),
      mutate(getEventdestinyhardwareListKey({ event: eventId })),
    ]);
  }, [eventId, mutate]);

  const invalidateEventTabCaches = useCallback(async (): Promise<void> => {
    await Promise.all([
      invalidateQuestionsCache(),
      invalidatePrizesCache(),
      mutate(getSponsoreventengagementsListKey({ event: eventId })),
      mutate(getEventsListKey({})),
    ]);
  }, [eventId, invalidatePrizesCache, invalidateQuestionsCache, mutate]);

  const activateEvent = useCallback(async (): Promise<void> => {
    if (!eventId) {
      return;
    }

    await eventsActivateCreate(eventId);
    toast.success('Event activated successfully');
    await mutateEvent();
    await invalidateEventTabCaches();
  }, [eventId, invalidateEventTabCaches, mutateEvent]);

  const value = useMemo(
    (): AdminEventContextType => ({
      eventId,
      event,
      basePath,
      isQueryEnabled,
      isLoading,
      mutateEvent,
      activateEvent,
      formatEventDate,
      invalidateEventTabCaches,
      invalidateQuestionsCache,
      invalidatePrizesCache,
    }),
    [
      activateEvent,
      basePath,
      event,
      eventId,
      formatEventDate,
      invalidateEventTabCaches,
      invalidatePrizesCache,
      invalidateQuestionsCache,
      isLoading,
      isQueryEnabled,
      mutateEvent,
    ],
  );

  return (
    <AdminEventContext.Provider value={value}>
      {children}
    </AdminEventContext.Provider>
  );
}

export function useAdminEvent(): AdminEventContextType {
  const context = useContext(AdminEventContext);
  if (!context) {
    throw new Error('useAdminEvent must be used within AdminEventProvider');
  }
  return context;
}
