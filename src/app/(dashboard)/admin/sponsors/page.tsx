import { useMemo, useState } from 'react';
import { useSponsorsCreate } from '@/types/endpoints';
import { useSponsors } from '@/contexts/SponsorsContext';
import Table from '@/components/Table';
import { ColumnDef } from '@tanstack/react-table';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { TIER_LABELS } from '@/components/admin/sponsors/SponsorTierSelect';
import { EngagementDialog, SponsorRow } from '@/components/admin/sponsors/SponsorTierDialog';
import { toast } from 'sonner';
import { TextInput } from '@/components/Inputs';
import { useAppNavigate } from '@/routing';
import { Sponsor, SponsorEventEngagement } from '@/types/models';
import AppButton from '@/components/common/AppButton';
import AppLoader from '@/components/Loader';

function CreateSponsorDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { trigger: triggerSponsorsCreate } = useSponsorsCreate();
  const { mutateSponsors } = useSponsors();
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    try {
      await triggerSponsorsCreate({ name });
      toast.success('Sponsor created');
      setName('');
      mutateSponsors();
      onClose();
    } catch {
      toast.error('Failed to create sponsor');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Sponsor</DialogTitle>
      <DialogContent>
				<label className="text-xs/8">SPONSOR NAME</label>
				<TextInput
					name="sponsor-name"
					type="text"
					value={name}
					onChange={e => setName(e.target.value)}
					placeholder="Sponsor Name"
				/>
      </DialogContent>
      <DialogActions>
        <AppButton onClick={onClose}>Cancel</AppButton>
        <AppButton onClick={handleSubmit}>Save</AppButton>
      </DialogActions>
    </Dialog>
  );
}

export default function SponsorsPage() {
  const { 
    sponsors, 
    engagements, 
    isMappingSponsorHardware, 
    isMappingSponsorHardwareDevices,
    isLoadingEngagements, 
    hardwareBySponsor, 
    isLoadingSponsors, 
    mutateEngagements
   } = useSponsors();
	type DialogSponsorEngagement = {
		sponsor: Sponsor;
		engagement: SponsorEventEngagement | null;
	}
  const [dialogSponsor, setDialogSponsor] = useState<DialogSponsorEngagement | null>(null);
  const [showDialogSponsor, setShowDialogSponsor] = useState(false);
	const [openSponsorDialog, setOpenSponsorDialog] = useState(false);
  const handleShowDialogSponsor = (sponsor: Sponsor, engagement: SponsorEventEngagement | null) => {
    setDialogSponsor({ sponsor, engagement });
    setShowDialogSponsor(true);
  };
	const router = useAppNavigate();
  const rows: SponsorRow[] = useMemo(
    () =>
      (sponsors ?? []).map((sponsor) => ({
        ...sponsor,
        engagement: engagements?.find((e) => e.sponsor === sponsor.id),
      })),
    [sponsors, engagements],
  );

  const columns: ColumnDef<SponsorRow>[] = [
    {
      header: 'Sponsor',
      accessorKey: 'name',
			size: Number.MAX_SAFE_INTEGER,
    },
    {
      header: 'Current Event Tier',
      accessorKey: 'engagement.tier',
      cell: ({ row }) =>
        row.original.engagement?.tier ? TIER_LABELS[row.original.engagement.tier] : '—',
    },
    {
      header: 'Sponsor Hardware',
      id: 'hardware',
      cell: ({ row }) => {
        const count = (hardwareBySponsor[row.original.id ?? ''] ?? []).length;
        return count > 0 ? count : '—';
      },
    },
    {
      header: 'Sponsor Hardware Devices',
      id: 'hardware-devices',
      cell: ({ row }) => {
        const count = (hardwareBySponsor[row.original.id ?? ''] ?? []).map(h => h.total).reduce((a, b) => a + b, 0);
        return count > 0 ? count : '—';
      },
    },
		{
			header: 'View Sponsor',
			accessorKey: 'view',
			cell: ({ row }) => (
				<button
					className="flex flex-row px-3 py-1 text-sm font-medium text-white bg-[#40337F] rounded hover:opacity-90 w-full justify-center"
					onClick={() => router.push(`/admin/sponsors/${row.original.id}`)}
					>
					View
				</button>
			),
		},
    {
			header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
				<button
					className="flex flex-row px-3 py-1 text-sm font-medium text-white bg-[#40337F] rounded hover:opacity-90 w-full justify-center items-center"
					onClick={() => handleShowDialogSponsor(row.original, row.original.engagement ?? null)}
        >
          {row.original.engagement ? 'Update Tier' : 'Add to Event'}
        </button>
      ),
    },
  ];

  const renderLoadingState = useMemo(() => {
    let loadingText = ''
    if (isLoadingEngagements) {
      loadingText = 'Loading engagements...';
    } else if (isMappingSponsorHardware) {
      loadingText = 'Mapping sponsor hardware...';
    } else if (isMappingSponsorHardwareDevices) {
      loadingText = 'Mapping sponsor hardware devices...';
    }
    if (isLoadingEngagements || isMappingSponsorHardware || isMappingSponsorHardwareDevices) {
      return <AppLoader loadingText={loadingText} size="h-12" direction="flex-row" />;
    }
    return null;
  }, [isLoadingEngagements, isMappingSponsorHardware, isMappingSponsorHardwareDevices, isLoadingEngagements]);

  return (
    <main className="pt-8 h-vh ">
			<div className="flex w-full justify-between">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="text-3xl">Sponsors</h1>
          {renderLoadingState}
        </div>
        <div className="flex-1 w-full">
					<div className="flex justify-end items-center">
						<AppButton
							onClick={() => setOpenSponsorDialog(true)}
						>
							Create Sponsor
						</AppButton>
					</div>
				</div>
			</div>
			<div className="z-50 py-4 overflow-y-scroll bg-[#FCFCFC] border-gray-300 rounded-2xl">
				<div className="max-h-[calc(100vh-200px)] overflow-y-scroll z-50 rounded-l border border-[#EEEEEE]">
					<Table
						data={rows}
						columns={columns}
						search={true}
						pagination={true}
						loading={isLoadingSponsors}
            />
				</div>
			</div>
			{showDialogSponsor && dialogSponsor && (
					<EngagementDialog
						showDialog={showDialogSponsor}
						sponsor={dialogSponsor.sponsor}
						engagement={dialogSponsor.engagement}
						onClose={() => setDialogSponsor(null)}
						onSuccess={() => mutateEngagements()}
					/>
				)}
				<CreateSponsorDialog
					open={openSponsorDialog}
					onClose={() => setOpenSponsorDialog(false)}
				/>
		</main>
  );	
}
