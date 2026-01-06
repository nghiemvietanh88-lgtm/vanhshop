// material
import { Button, Divider, Stack, Typography } from '@material-ui/core';
// hooks
import { useSnackbar } from 'notistack';
import useAuth from '../../hooks/useAuth';
import useLocales from '../../hooks/useLocales';
// icons
import { FacebookIcon, TwitterIcon } from '../../assets';

// ----------------------------------------------------------------------

export default function AuthWithSocial({ isLogin }) {
  const { t } = useLocales();
  const { loginWithFaceBook, loginWithTwitter } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleLoginFaceBook = async () => {
    try {
      await loginWithFaceBook();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginTwitter = async () => {
    try {
      await loginWithTwitter();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleLoginFaceBook}>
          <FacebookIcon disabled />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleLoginTwitter}>
          <TwitterIcon disabled />
        </Button>
      </Stack>

      {isLogin && (
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('auth.or').toUpperCase()}
          </Typography>
        </Divider>
      )}
    </>
  );
}
