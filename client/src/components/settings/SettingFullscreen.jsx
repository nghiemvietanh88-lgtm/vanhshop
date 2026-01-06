import roundFullscreen from '@iconify/icons-ic/round-fullscreen';
import roundFullscreenExit from '@iconify/icons-ic/round-fullscreen-exit';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
// material
import { Button } from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';

// ----------------------------------------------------------------------

SettingFullscreen.propTypes = {
  titleOn: PropTypes.string,
  titleOff: PropTypes.string
};

// SettingFullscreen.defaultProps = {
//   titleOn: 'Fullscreen',
//   titleOff: 'Exit Fullscreen'
// };

export default function SettingFullscreen({ titleOn = 'Fullscreen', titleOff = 'Exit Fullscreen' }) {
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  return (
    <Button
      fullWidth
      size="large"
      variant="outlined"
      color={fullscreen ? 'primary' : 'inherit'}
      startIcon={<Icon icon={fullscreen ? roundFullscreenExit : roundFullscreen} />}
      onClick={toggleFullScreen}
      sx={{
        fontSize: 14,
        ...(fullscreen && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
        })
      }}
    >
      {fullscreen ? titleOff : titleOn}
    </Button>
  );
}
