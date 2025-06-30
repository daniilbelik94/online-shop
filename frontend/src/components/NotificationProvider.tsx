import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectNotifications,
  removeNotification,
  type Notification,
} from '../store/slices/notificationSlice';
import { AppDispatch } from '../store';

const NotificationProvider: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(selectNotifications);

  const handleClose = (notificationId: string) => {
    dispatch(removeNotification(notificationId));
  };

  return (
    <>
      {notifications.map((notification: Notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration || 4000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{ mb: notifications.indexOf(notification) * 7 }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationProvider; 