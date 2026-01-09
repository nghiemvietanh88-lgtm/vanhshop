import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// icons
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import homeFill from '@iconify/icons-eva/home-fill';
import personFill from '@iconify/icons-eva/person-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
// material
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@material-ui/core';
//
import Logo from '../../components/Logo';
import { MHidden } from '../../components/@material-extend';
import DashboardSearchBar from './DashboardSearchBar';
import AccountPopover from '../common/AccountPopover';
import LanguagePopover from '../common/LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 64;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APP_BAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APP_BAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar }) {
  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <RouterLink to="/">
            <Logo />
          </RouterLink>
          <IconButton onClick={onOpenSidebar} sx={{ marginX: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>

        <DashboardSearchBar />
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={{ xs: 0.5, sm: 1.5 }}>
          <LanguagePopover />
          <NotificationsPopover />
          <AccountPopover
            menuOptions={[
              { label: 'Trang chủ', icon: homeFill, linkTo: '/' },
              { label: 'Tài khoản', icon: personFill, linkTo: PATH_DASHBOARD.app.profile },
              { label: 'Cài đặt', icon: settings2Fill, linkTo: PATH_DASHBOARD.app.account_setting }
            ]}
          />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
