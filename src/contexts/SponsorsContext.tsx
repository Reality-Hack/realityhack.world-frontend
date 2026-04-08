'use client';

import { createContext, useContext, useMemo, ReactNode, useState } from 'react';
import { useSponsorsList, useSponsoreventengagementsList, useHardwaredevicesList, useHardwareList } from '@/types/endpoints';
import { HardwareCount, HardwareDevice, Sponsor, SponsorEventEngagement } from '@/types/models';
import { useEvents } from '@/contexts/EventContext';

type SponsorsContextType = {
  sponsors: Sponsor[] | null;
  engagements: SponsorEventEngagement[] | null;
  isLoadingSponsors: boolean;
  isLoadingEngagements: boolean;
  hardwareDevicesBySponsor: Record<string, HardwareDevice[]>;
  hardwareBySponsor: Record<string, HardwareCount[]>;
  hardwareCatalog: HardwareCount[] | null;
  hardwareById: Record<string, HardwareCount>;
  isLoadingSponsorHardware: boolean;
  isLoadingHardwareCatalog: boolean;
  isMappingSponsorHardware: boolean;
  isMappingSponsorHardwareDevices: boolean;
  mutateSponsors: () => void;
  mutateEngagements: () => void;
  mutateSponsorHardware: () => void;
  mutateHardware: () => void;
};

const SponsorsContext = createContext<SponsorsContextType | undefined>(undefined);

export const useSponsors = (): SponsorsContextType => {
  const context = useContext(SponsorsContext);
  if (!context) {
    throw new Error('useSponsors must be used within SponsorsProvider');
  }
  return context;
};

export const SponsorsProvider = ({ children }: { children: ReactNode }) => {
  const { selectedEvent } = useEvents();
  const [isMappingSponsorHardware, setIsMappingSponsorHardware] = useState(true);
  const [isMappingSponsorHardwareDevices, setIsMappingSponsorHardwareDevices] = useState(true);
  const {
    data: sponsors,
    isLoading: isLoadingSponsors,
    mutate: mutateSponsors,
  } = useSponsorsList();

  const {
    data: engagements,
    isLoading: isLoadingEngagements,
    mutate: mutateEngagements,
  } = useSponsoreventengagementsList(
    { event: selectedEvent?.id },
    { swr: { enabled: !!selectedEvent?.id } },
  );

  const {
    data: hardwareDevices,
    isLoading: isLoadingSponsorHardware,
    mutate: mutateSponsorHardware,
  } = useHardwaredevicesList(
    {},
    { swr: { enabled: !!selectedEvent?.id } },
  );

  const {
    data: hardware,
    isLoading: isLoadingHardwareCatalog,
    mutate: mutateHardware,
  } = useHardwareList(
    {},
    { swr: { enabled: !!selectedEvent?.id } },
  );

  const hardwareById = useMemo((): Record<string, HardwareCount> => {
    const map: Record<string, HardwareCount> = {};
    for (const row of hardware ?? []) {
      if (row.id) {
        map[row.id] = row;
      }
    }
    return map;
  }, [hardware]);

  const hardwareDevicesBySponsor = useMemo((): Record<string, HardwareDevice[]> => {
    if (!hardwareDevices || !hardware) return {};
    const acc: Record<string, HardwareDevice[]> = {};
    for (const device of hardwareDevices) {
      const catalogRow = hardwareById[device.hardware];
      const sponsorId = catalogRow?.sponsor_company;
      if (!sponsorId) continue;
      if (!acc[sponsorId]) acc[sponsorId] = [];
      acc[sponsorId].push(device);
    }
    setIsMappingSponsorHardwareDevices(false);
    return acc;
  }, [hardwareDevices, hardwareById]);

  const hardwareBySponsor = useMemo((): Record<string, HardwareCount[]> => {
    if (!hardware) return {};
    const result = hardware.reduce<Record<string, HardwareCount[]>>((acc, device) => {
      const sponsorId = device.sponsor_company;
      if (!sponsorId) return acc;
      if (!(acc[sponsorId])) acc[sponsorId] = [];
      acc[sponsorId].push(device);
      return acc;
    }, {});
    setIsMappingSponsorHardware(false);
    return result;
  }, [hardware]);

  return (
    <SponsorsContext.Provider
      value={{
        sponsors: sponsors ?? null,
        engagements: engagements ?? null,
        isLoadingSponsors,
        isLoadingEngagements,
        hardwareDevicesBySponsor,
        hardwareBySponsor,
        hardwareCatalog: hardware ?? null,
        hardwareById,
        isLoadingSponsorHardware,
        isLoadingHardwareCatalog,
        isMappingSponsorHardware,
        isMappingSponsorHardwareDevices,
        mutateSponsors,
        mutateEngagements,
        mutateSponsorHardware,
        mutateHardware,
      }}
    >
      {children}
    </SponsorsContext.Provider>
  );
};
