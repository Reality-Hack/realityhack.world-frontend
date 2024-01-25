// CustomDialog.tsx
import React, { ReactNode } from 'react';
import { Dialog, DialogContent, Button, DialogTitle } from '@mui/material';

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const CustomDialog: React.FC<CustomDialogProps> = ({ open, onClose, title, children }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Optional: Add a title */}
      {/* <div className='text-blue-400'> */}
      {title && <DialogTitle>{title}</DialogTitle>}

      {/* </div> */}

      {/* Content of the dialog */}
      <DialogContent>{children}</DialogContent>


      {/* Close button */}
      <Button onClick={onClose}>Close</Button>
    </Dialog>
  );
};

export default CustomDialog;
