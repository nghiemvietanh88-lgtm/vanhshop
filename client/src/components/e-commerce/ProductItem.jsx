import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Box, Card, Button, Typography, Stack, Chip } from '@material-ui/core';
import { experimentalStyled as styled, alpha } from '@material-ui/core/styles';
//
import { useDispatch } from 'react-redux';
import { useLocales } from '../../hooks';

import { ImageBrokenIcon } from '../../assets';

import ProductNameTypo from './ProductNameTypo';

import { fCurrency } from '../../utils/formatNumber';
import { trackingClick } from '../../redux/slices/userBehaviorSlice';

// ----------------------------------------------------------------------

const ContainerStyle = styled(Card)(({ theme }) => ({
  height: '100%',
  flexGrow: 1,
  position: 'relative',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.customShadows.z24,
    '& .product-image': {
      transform: 'scale(1.1)'
    },
    '& .btn-recommend': {
      display: 'unset',
      position: 'absolute',
      bottom: '-20px',
      zIndex: 2
    }
  },
  '& .btn-recommend': {
    display: 'none'
  }
}));

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  position: 'absolute',
  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
});

const DiscountBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 9,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  padding: '4px 10px',
  borderRadius: theme.spacing(1),
  fontWeight: 700,
  fontSize: '0.75rem',
  boxShadow: theme.customShadows.z8
}));

const PriceBoxStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  gap: theme.spacing(0.5)
}));

// ----------------------------------------------------------------------

ProductItem.propTypes = {
  product: PropTypes.object
};

export default function ProductItem({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, currentLang } = useLocales();

  const { _id, name, slug, variants, category } = product;
  const image = variants?.[0]?.thumbnail || null;
  const linkTo = `/${category?.slug || 'c'}/${slug}`;

  // Calculate discount percentage
  const price = variants[0]?.price || 0;
  const marketPrice = variants[0]?.marketPrice || 0;
  const discountPercent = marketPrice > price ? Math.round(((marketPrice - price) / marketPrice) * 100) : 0;

  // eslint-disable-next-line no-unused-vars
  const handleOnClick = (_e) => {
    dispatch(trackingClick({ productId: _id }));
    navigate(linkTo);
  };

  return (
    <ContainerStyle onClick={handleOnClick}>
      <Box sx={{ pt: '90%', position: 'relative', backgroundColor: 'background.neutral' }}>
        {discountPercent > 0 && <DiscountBadge>-{discountPercent}%</DiscountBadge>}
        {image ? (
          <ProductImgStyle
            className="product-image"
            alt={name}
            src={variants[0].thumbnail}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = '/static/no-picture-available.png';
            }}
          />
        ) : (
          <ImageBrokenIcon sx={{ top: 0, width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }} />
        )}
      </Box>

      <Stack spacing={1.5} sx={{ p: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            lineHeight: 1.4,
            minHeight: 40,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          {name.replaceAll('/', '/ ')}
        </Typography>

        <PriceBoxStyle>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            <Typography
              variant="h6"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '1.1rem'
              }}
            >
              {variants[0].price ? fCurrency(variants[0].price, currentLang.value) : t('products.fee')}
            </Typography>
            {discountPercent > 0 && (
              <Chip
                label={`-${discountPercent}%`}
                size="small"
                color="error"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 600
                }}
              />
            )}
          </Stack>

          {marketPrice > price && (
            <Typography
              component="span"
              variant="caption"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
                fontWeight: 500
              }}
            >
              {fCurrency(marketPrice, currentLang.value)}
            </Typography>
          )}
        </PriceBoxStyle>
      </Stack>
    </ContainerStyle>
  );
}
