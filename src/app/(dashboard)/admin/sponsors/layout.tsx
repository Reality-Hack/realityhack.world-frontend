import { SponsorsProvider } from '@/contexts/SponsorsContext';

export default function SponsorsLayout({ children }: { children: React.ReactNode }) {
  return <SponsorsProvider>{children}</SponsorsProvider>;
}
