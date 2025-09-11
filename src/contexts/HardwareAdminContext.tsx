'use client';
import { useHardwaredevicesList, useHardwareList, useHardwarerequestsList } from '@/types/endpoints';
import { HardwareCount, HardwareDevice, HardwareRequestList, HardwarerequestsListParams } from '@/types/models';
import { HardwareCategory } from '@/types/types2'
import { useSession } from 'next-auth/react';
import { getHardwareCategories } from '@/app/api/hardware';
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

type HardwareContextType = {
  setHardwareRequestParams: (params: HardwarerequestsListParams) => void;
  hardwareRequestParams: HardwarerequestsListParams;
  hardwareRequests: HardwareRequestList[] | null;
  isLoadingHardwareRequests: boolean;
  hardwareRequestsError: Error | null;
  mutateHardwareRequests: () => void;
  hardwareDeviceTypes: HardwareCount[] | null;
  isLoadingHardwareDeviceTypes: boolean;
  hardwareDeviceTypesError: Error | null;
  mutateHardwareDeviceTypes: () => void;
  hardwareDeviceTypeMap: Record<string, HardwareCount>;
  hardwareDevices: HardwareDevice[] | null;
  isLoadingHardwareDevices: boolean;
  hardwareDevicesError: Error | null;
  mutateHardwareDevices: () => void;
  hardwareDeviceMap: Record<string, HardwareDevice>;
  hardwareCategories: HardwareCategory[]; 
};

const HardwareContext = createContext<HardwareContextType | undefined>(undefined);

export const useHardwareContext = () => {
  const ctx = useContext(HardwareContext);
  if (!ctx) throw new Error('useHardwareContext must be used within HardwareProvider');
  return ctx;
};

export const HardwareProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [hardwareCategories, setHardwareCategories] = useState<HardwareCategory[]>([]);

  const [hardwareRequestParams, setHardwareRequestParams] = useState<HardwarerequestsListParams>({
    hardware: undefined,
    requester__id: undefined,
    requester__first_name: undefined,
    requester__last_name: undefined,
    search: undefined,
    team: undefined,
  });
  
  useEffect(() => {
    if (!session) return;
    try {
      (async () => {
      const hardwareCategories: HardwareCategory[] = await getHardwareCategories(
        session.access_token
        );
        setHardwareCategories(hardwareCategories);
      })();
    } catch (error) {
      console.error('Error fetching hardware categories:', error);
    }
  }, [session]);

  const { 
    data: hardwareRequests, 
    isLoading: isLoadingHardwareRequests, 
    error: hardwareRequestsError, 
    mutate: mutateHardwareRequests 
  } = useHardwarerequestsList({
    ...hardwareRequestParams,
  }, {
    swr: { enabled: !!session?.access_token}, 
    request: {
      headers: {
        'Authorization': `JWT ${session?.access_token}`
      }
    }
  });

  const { 
    data: hardwareDeviceTypes, 
    isLoading: isLoadingHardwareDeviceTypes, 
    error: hardwareDeviceTypesError,
    mutate: mutateHardwareDeviceTypes
  } = useHardwareList({}, {
    swr: { enabled: !!session?.access_token}, 
    request: {
      headers: {
        'Authorization': `JWT ${session?.access_token}`
      }
    }
  });

  const {
    data: hardwareDevices,
    isLoading: isLoadingHardwareDevices,
    error: hardwareDevicesError,
    mutate: mutateHardwareDevices
  } = useHardwaredevicesList({}, {
    swr: { enabled: !!session?.access_token}, 
    request: {
      headers: {
        'Authorization': `JWT ${session?.access_token}`
      }
    }
  });

  const hardwareDeviceTypeMap = useMemo(() => {
    if (!hardwareDeviceTypes) return {};
    return Object.fromEntries(hardwareDeviceTypes?.map(h => [h.id, h]) || []);
  }, [hardwareDeviceTypes]);

  const hardwareDeviceMap = useMemo(() => {
    if (!hardwareDevices) return {};
    return Object.fromEntries(hardwareDevices?.map(h => [h.id, h]) || []);
  }, [hardwareDevices]);
  return (
    <HardwareContext.Provider value={{
      setHardwareRequestParams,
      hardwareRequestParams,
      hardwareRequests: hardwareRequests || null,
      isLoadingHardwareRequests,
      hardwareRequestsError: hardwareRequestsError as Error | null,
      mutateHardwareRequests,
      hardwareDeviceTypes: hardwareDeviceTypes || null,
      isLoadingHardwareDeviceTypes,
      hardwareDeviceTypesError: hardwareDeviceTypesError as Error | null,
      mutateHardwareDeviceTypes,
      hardwareDeviceTypeMap,
      hardwareDevices: hardwareDevices || null,
      isLoadingHardwareDevices,
      hardwareDevicesError: hardwareDevicesError as Error | null,
      mutateHardwareDevices,
      hardwareDeviceMap,
      hardwareCategories,
    }}>
      {children}
    </HardwareContext.Provider>
  );
};