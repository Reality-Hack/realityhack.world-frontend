import React, { ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const CustomDialog: React.FC<CustomDialogProps> = ({ open, onClose, title, children }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: '60%',  // Set the width as 60% of the screen
          maxWidth: '47rem',  // Maximum width of 1000px
        }
      }}
    >
      {/* Optional: Add a title without a close button */}
      {title && <DialogTitle style={{ padding: 0, margin: 0 }}>{title}</DialogTitle>} {/* Remove padding */}
      
      {/* Content of the dialog */}
      <DialogContent style={{ padding: 0 }}>{children}</DialogContent> {/* Remove content padding */}
    </Dialog>
  );
};

export default CustomDialog;
