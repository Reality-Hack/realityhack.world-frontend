import AppButton from "./AppButton";
import { Dialog, DialogTitle, DialogActions, DialogContent } from "@mui/material";

type AppDialogProps = {
  showDialog: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function AppDialog({ showDialog, onClose, children, title, onSubmit, isSubmitting }: AppDialogProps) {
  return (
    <Dialog open={showDialog} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
          {children}
      </DialogContent>
      <DialogActions className="flex flex-row gap-2 w-full justify-center">
        <AppButton onClick={onClose} disabled={isSubmitting} className="w-full md:w-auto">
          Cancel
        </AppButton>
        <AppButton onClick={onSubmit} disabled={isSubmitting} className="w-full md:w-auto">
          Save
        </AppButton>
      </DialogActions>
    </Dialog> 
  );
}