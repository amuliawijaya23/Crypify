// import from MUI
import { Button, Avatar, List, ListItem, ListItemAvatar, ListItemText, DialogTitle, Dialog, Typography} from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';

// state management
import { useSelector } from "react-redux"

const Holders = ({ onClose, open }) => {
  const holders = useSelector((state) => state.token.value.transfers.holders);

  return (
    <></>
  )
}

export default Holders