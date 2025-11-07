import { hardwarerequestsPartialUpdate } from '@/types/endpoints';
import { useState } from "react";
import { toast } from "sonner";
import LinearProgress from "@mui/material/LinearProgress";

export default function ReasonEditor({
    initial,
    id,
    access_token,
    mutateHardwareRequests
  }: {
    initial: string;
    id: string;
    access_token: string | undefined;
    mutateHardwareRequests: () => void;
  }) {
    const [loading, setLoading] = useState(false);
    const [initial_, setInitial] = useState(initial);
    const [value, setValue] = useState(initial);
  
    const submit = ((newReason: string) => {
      if (!access_token) return;
      setLoading(true);
      hardwarerequestsPartialUpdate(id, { reason: newReason}, {
        headers: {
          'Authorization': `JWT ${access_token}`
        }
      }).then(() => {
        setValue(newReason);
        setInitial(newReason);
        mutateHardwareRequests();
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Failed to update hardware request: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
    });
  
    return loading ? <LinearProgress /> : (
      <>
        {value == initial_ ? <input value={value} onChange={e => setValue(e.target.value)}></input>
        : <>
          <textarea value={value} onChange={e => setValue(e.target.value)} rows={4}></textarea>
          <div className="flex flex-row">          
            <button
              className="cursor-pointer text-white bg-[#493B8A] px-2 mx-2 rounded-full disabled:opacity-50 transition-all flex-shrink h-5 self-end"
              onClick={() => submit(value)}
            >
              Submit
            </button>
            <button
              className="cursor-pointer text-white bg-red-800 px-2 mx-2 rounded-full disabled:opacity-50 transition-all flex-shrink h-5 self-end"
              onClick={() => setValue(initial_)}
            >
              Cancel
            </button>
          </div>
        </>}
      </>
    );
  }
  