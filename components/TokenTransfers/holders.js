// import from MUI
import { Button, Avatar, List, ListItem, Divider, ListItemAvatar, ListItemText, Dialog, Typography, DialogTitle } from '@mui/material';
import WalletIcon from '@mui/icons-material/Wallet';

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
          <>
            <ListItem key={`holder-${i}`} button>
              <ListItemAvatar>
                <Avatar>
                  <WalletIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={h} />
            </ListItem>
            {i < (holders?.length - 1) && <Divider /> }
          </>
        ))}
      </List>
    </Dialog>
  )
}

export default Holders