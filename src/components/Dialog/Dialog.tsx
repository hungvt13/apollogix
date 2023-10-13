import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface DiProps {
  title: string
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  children: React.ReactNode | string
}

function Dialog ({
  title,
  isOpen,
  onClose,
  onSave,
  children,
}: DiProps) {

  return (
    <MuiDialog
      fullWidth
      maxWidth='md'
      open={isOpen}
      onClose={onClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            pt: 4
          }}
        >
          {children}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant='outlined'
        >
            Cancel
        </Button>
        <Button
          onClick={onSave}
          variant='contained'
        >
          Save
        </Button>
      </DialogActions>
    </MuiDialog>
  );
}

export default Dialog;