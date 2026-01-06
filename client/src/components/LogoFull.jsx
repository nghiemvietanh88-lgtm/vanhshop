import PropTypes from 'prop-types';
// material
import { useTheme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
// ----------------------------------------------------------------------

LogoFull.propTypes = {
  sx: PropTypes.object
};

export default function LogoFull({ sx }) {
  const theme = useTheme();
  const PRIMARY_LIGHT = theme.palette.primary.light;
  const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_DARK = theme.palette.primary.dark;

  return (
    <Box sx={{ width: 150, height: 30, ...sx }}>
      <img
        src="/favicon/logo.png"
        alt="VanhShop Logo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </Box>
  );
}
