import lockFill from '@iconify/icons-eva/lock-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import detailUser from '@iconify/icons-eva/person-delete-fill';
import unlockFill from '@iconify/icons-eva/unlock-fill';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
// material
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

UserMoreMenu.propTypes = {
  onDetail: PropTypes.func,
  onLockAccount: PropTypes.func,
  isLocked: PropTypes.bool
};

export default function UserMoreMenu({ onDetail, onLockAccount, isLocked = false }) {
  const { t } = useLocales();
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>
      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <div onMouseLeave={() => setIsOpen(false)}>
          <MenuItem onClick={onLockAccount} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon={isLocked ? unlockFill : lockFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary={isLocked ? 'Mở khóa' : t('dashboard.users.lock-account')}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </MenuItem>
          <MenuItem onClick={onDetail} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon={detailUser} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={t('dashboard.users.detail')} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        </div>
      </Menu>
    </>
  );
}
