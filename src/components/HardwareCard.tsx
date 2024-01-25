'use client';
import { sendHardwareRequest } from '@/app/api/hardware';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Hardware } from '@/types/types';
import { fixFileLink } from '@/app/api/uploaded_files';

export default function HardwareCard({ item, topLevelProps = {} }: { item: Hardware, topLevelProps?: object }) {
  const { data: session } = useSession();
  const [reason, setReason] = useState('');
  const quantity = item.available;
  function sendRequest() {
    sendHardwareRequest(session!.access_token, {
      hardware: item.id,
      requester: session!.user!.email!,
      reason: reason
    });
    setReason('');
  }
  return (
    <div {...topLevelProps} className="flex-col gap-2 w-[355px] bg-gradient-to-t from-[#FFFFFF] to-[#FFFFFF] border border-blue-500 rounded-[10px] shadow flex justify-center items-center p-2">
      {!!item.image && <img className="rounded-xl" src={fixFileLink(item.image.file)} />}
      <div className="flex justify-between w-full">
        <span className="text-xl" title="Hardware name">{item.name}</span>
        <span className="text-xl font-light flex-shrink-0">
          Quantity: {quantity}
        </span>
      </div>
      <span className="overflow-auto break-all">{item.description}</span>
      <div className="flex justify-between w-full">
        <textarea
          disabled={quantity === 0}
          className="mt-4 placeholder:transition-all transition-all border-[1px] bg-white w-full px-3 py-2 rounded-lg appearance-none rounded-t-md focus:z-10 sm:text-sm outline-0 hover:text-themelight hover:border-themePrimary hover:shadow-themeActive hover:border-opacity-100 mr-2 required"
          name="reason"
          placeholder="Reason for request"
          value={reason}
          rows={2}
          onChange={event => setReason(event.target.value)}
        ></textarea>
        <button
          disabled={reason.length === 0 || quantity <= 0}
          className="cursor-pointer text-white bg-[#493B8A] px-4 rounded-full disabled:opacity-50 transition-all flex-shrink h-10 self-end"
          onClick={() => sendRequest()}
        >
          Request
        </button>
      </div>
    </div>
  );
}
