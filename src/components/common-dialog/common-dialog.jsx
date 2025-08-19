import React from 'react';
import { Dialog, List, ListItem, ListItemText } from '@mui/material';

export default function MoreActions({ open, onClose }) {
  const actions = [
    "Edit Campaign", "Unpublish", "Restrictions", 
    "Edit Properties", "Move", "Duplicate",
    "Show Usage", "Download Excel Report", "Delete",
    "Publish", "Pause", "Triggers and Interactivity",
    "Display Configuration", "Mark as Favorite",
    "New Playlist", "Permissions"
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <List>
        {actions.map((action) => (
          <ListItem button key={action} onClick={onClose}>
            <ListItemText primary={action} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}