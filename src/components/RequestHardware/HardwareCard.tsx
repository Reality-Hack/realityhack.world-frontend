'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { HardwareCount, HardwareRequestCreateRequest } from '@/types/models';
import { fixFileLink } from '@/app/api/uploaded_files';
import { toast } from 'sonner';
import { useHardwarerequestsCreate } from '@/types/endpoints';

export default function HardwareCard({ item, identifier, teamId }: { item: HardwareCount, identifier: string, teamId: string | null }) {
  const { data: session } = useSession();
  const [reason, setReason] = useState('');
  const quantity = item.available;

  const { trigger: createHardwareRequest, isMutating, error } = useHardwarerequestsCreate({
    request: {
      headers: {
        Authorization: `JWT ${session?.access_token}`
      }
    }
  });
  
  function sendRequest() {
    if (!item?.id) {
      toast.error('No hardware ID found');
      return;
    }
    if (!teamId) {
      toast.error('Please register your team first');
      return;
    }
    const requestBody: HardwareRequestCreateRequest = {
      hardware: item.id,
      requester: session!.user!.email!,
      reason: reason,
      team: teamId,
    }
    createHardwareRequest(requestBody);
    setReason('');
  }
  const canCreateRequest = reason.length === 0 || quantity <= 0 || isMutating;
  return (
    <div data-testid={identifier} className="flex-col gap-2 w-[355px] bg-gradient-to-t from-[#FFFFFF] to-[#FFFFFF] border border-blue-500 rounded-[10px] shadow flex justify-center items-center p-2">
      {!!item.image && <img className="rounded-xl" src={fixFileLink(item.image.file)} />}
      <div className="flex justify-between w-full">
        <span className="text-xl" title="Hardware name">{item.name}</span>
        <span className="text-xl font-light flex-shrink-0">
          Quantity: {quantity}
        </span>
      </div>
      <div className="flex justify-between w-full">
        <span className="text-md font-light flex-shrink-0">
          {item.tags.map(tag => tag.valueOf()).join(', ')}
        </span>
      </div>
      <span className="overflow-auto break-all">{item.description}</span>
      <div className="flex justify-between w-full">
        <textarea
          disabled={quantity === 0 || isMutating}
          className="mt-4 placeholder:transition-all transition-all border-[1px] bg-white w-full px-3 py-2 rounded-lg appearance-none rounded-t-md focus:z-10 sm:text-sm outline-0 hover:text-themelight hover:border-themePrimary hover:shadow-themeActive hover:border-opacity-100 mr-2 required"
          name="reason"
          placeholder="Reason for request"
          value={reason}
          rows={2}
          onChange={event => setReason(event.target.value)}
        ></textarea>
        <button
          disabled={canCreateRequest}
          className="cursor-pointer text-white bg-[#493B8A] px-4 rounded-full disabled:opacity-50 transition-all flex-shrink h-10 self-end"
          onClick={() => sendRequest()}
        >
          Request
        </button>
      </div>
    </div>
  );
}
