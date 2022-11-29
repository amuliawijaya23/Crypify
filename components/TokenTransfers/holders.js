// import from MUI
import { Button, Avatar, List, ListItem, ListItemAvatar, ListItemText, Dialog, Typography, DialogTitle } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';

// state management
import { useSelector } from "react-redux"

const Holders = ({ open, onClose }) => {
  const holders = useSelector((state) => state?.token?.value?.transfers?.holders);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Wallet Addresses
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        {holders?.map((h, i) => (
          <ListItem key={`holder-${i}`} button>
            <ListItemText primary={h} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}

export default Holders