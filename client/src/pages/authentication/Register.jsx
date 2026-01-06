// material
import { Box, Card, Container, Link, Typography } from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
// form validation
import * as Yup from 'yup';
//
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// hooks
import { useLocales } from '../../hooks';
// routes
import { PATH_AUTH } from '../../routes/paths';
// layouts
import AuthLayout from '../../layouts/AuthLayout';
// components
import { MHidden } from '../../components/@material-extend';
import RegisterForm from '../../components/authentication/register/RegisterForm';
import Page from '../../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Register() {
  const { t } = useLocales();

  const [country, setCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMgs, setErrorMgs] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /* useEffect(() => {
    // eslint-disable-next-line import/no-named-as-default-member
    // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('invisible-recaptcha', {
    //   size: 'invisible',
    //   defaultCountry: 'VN',
    //   callback: (response) => {
    //     console.log('response', response);
    //   }
    // });
  }, []); */

  return (
    <RootStyle title={t('auth.page-title.register')}>
      <AuthLayout>
        {t('auth.already-have-account')} &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to={PATH_AUTH.login}>
          {t('auth.login')}
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            {t('auth.register-salutation')}
          </Typography>
          <img alt="register" src="/static/illustrations/illustration_register.png" />
        </SectionStyle>
      </MHidden>

      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              {t('auth.register-title')}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>{t('auth.register-subtitle')}</Typography>
          </Box>

          {/* <AuthWithSocial isLogin={false} /> */}

          {/* <Stack spacing={3}> */}
          {/*  {errorMgs && <Alert severity="error">{errorMgs}</Alert>} */}
          {/*  <CustomPhoneInput */}
          {/*    label={t('auth.phone')} */}
          {/*    value={phoneNumber} */}
          {/*    onChange={(phone) => setPhoneNumber(phone.trim())} */}
          {/*    onEnter={handleRegister} */}
          {/*  /> */}
          {/*  <LoadingButton fullWidth size="large" variant="contained" onClick={handleRegister}> */}
          {/*    {t('auth.register')} */}
          {/*  </LoadingButton> */}
          {/* </Stack> */}

          <RegisterForm />

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
            {t('auth.accept-terms')}&nbsp;
            <Link underline="always" sx={{ color: 'text.primary' }}>
              {t('auth.tos')}
            </Link>
            &nbsp;{t('common.and')}&nbsp;
            <Link underline="always" sx={{ color: 'text.primary' }}>
              {t('auth.privacy-policy')}
            </Link>
            .
          </Typography>

          <MHidden width="smUp">
            <Typography variant="subtitle2" sx={{ mt: 3, textAlign: 'center' }}>
              {t('auth.already-have-account')}&nbsp;
              <Link to={PATH_AUTH.login} component={RouterLink}>
                {t('auth.login')}
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
