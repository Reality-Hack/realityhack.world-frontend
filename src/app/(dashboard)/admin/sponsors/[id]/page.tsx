import { useMemo, useState } from 'react';
import { useAppParams } from "@/routing";
import Loader from "@/components/Loader";
import { Button, Chip } from "@mui/material";
import { EngagementDialog, SponsorRow } from "@/components/admin/sponsors/SponsorTierDialog";
import { TIER_LABELS } from "@/components/admin/sponsors/SponsorTierSelect";
import { useSponsors } from '@/contexts/SponsorsContext';

export default function AdminSponsorDetailPage() {
  const { id } = useAppParams();
  const { sponsors, engagements, sponsorHardware, isLoadingSponsors, isLoadingSponsorHardware, mutateEngagements } = useSponsors();
  const [dialogOpen, setDialogOpen] = useState(false);

  const sponsor = useMemo(
    () => sponsors?.find((s) => s.id === id),
    [sponsors, id]
  );

  const engagement = useMemo(
    () => engagements?.find((e) => e.sponsor === id),
    [engagements, id]
  );

  const displayTier = useMemo(() => {
    return engagement?.tier ? TIER_LABELS[engagement.tier] : '-';
  }, [engagement]);

  const devices = useMemo(
    () => sponsorHardware[id ?? ''] ?? [],
    [sponsorHardware, id]
  );

  if (isLoadingSponsors) {
    return <Loader loadingText="Loading sponsor data..." />;
  }
  return (
    <main className="pt-8 h-vh">
			<div className="flex flex-col gap-4">
				<h1 className="text-2xl font-bold">{sponsor?.name}</h1>
				<div className="flex flex-row gap-4 justify-between">
					<div className="flex flex-col">
						<div className="text-sm font-medium">Current Sponsorship Level: </div>
						<div className="text-lg font-bold">{displayTier}</div>	
					</div>
					<Button variant="contained" onClick={() => setDialogOpen(true)}>
						{engagement ? 'Update Tier' : 'Add to Event'}
					</Button>
				</div>
				{dialogOpen && (
					<EngagementDialog
						sponsor={sponsor!}
						engagement={engagement ?? null}
						onClose={() => setDialogOpen(false)}
						onSuccess={() => mutateEngagements()}
					/>
				)}
				<div className="flex flex-col gap-2 mt-4">
					<h2 className="text-lg font-semibold">Hardware Devices</h2>
					{isLoadingSponsorHardware ? (
						<p className="text-sm text-gray-500">Loading devices...</p>
					) : devices.length === 0 ? (
						<p className="text-sm text-gray-500">No devices assigned.</p>
					) : (
						<div className="border border-[#EEEEEE] rounded-xl overflow-hidden">
							<table className="w-full text-sm">
								<thead className="bg-gray-50 text-left">
									<tr>
										<th className="px-4 py-2 font-medium text-gray-600">Serial</th>
										<th className="px-4 py-2 font-medium text-gray-600">Status</th>
									</tr>
								</thead>
								<tbody>
									{devices.map((device) => (
										<tr key={device.id} className="border-t border-[#EEEEEE]">
											<td className="px-4 py-2 font-mono">{device.serial}</td>
											<td className="px-4 py-2">
												{device.checked_out_to ? (
													<Chip label="Checked Out" size="small" color="warning" />
												) : (
													<Chip label="Available" size="small" color="success" />
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
		</div>
    </main>
  );
}
