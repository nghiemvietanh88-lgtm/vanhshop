import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack, Chip } from '@material-ui/core';
import { experimentalStyled as styled, alpha } from '@material-ui/core/styles';
import { ImageIllustration } from '../../../assets';
//
import { fCurrency, fNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.customShadows.z24,
    '& .product-image': {
      transform: 'scale(1.1)'
    }
  }
}));

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
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

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object
};

export default function ShopProductCard({ product }) {
  const { name, slug, variants, category } = product;
  const image = variants?.[0]?.thumbnail || null;
  const linkTo = `/${category.slug}/${slug}`;

  // Calculate discount percentage
  const price = variants[0]?.price || 0;
  const marketPrice = variants[0]?.marketPrice || 0;
  const discountPercent = marketPrice > price ? Math.round(((marketPrice - price) / marketPrice) * 100) : 0;

  return (
    <StyledCard>
      <Box sx={{ pt: '90%', position: 'relative', backgroundColor: 'background.neutral' }}>
        {discountPercent > 0 && <DiscountBadge>-{discountPercent}%</DiscountBadge>}
        {image ? (
          <ProductImgStyle
            className="product-image"
            alt={name}
            src={variants[0].thumbnail}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = '/static/no-picture-available.png';
            }}
          />
        ) : (
          <ImageIllustration
            sx={{
              top: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute'
            }}
          />
        )}
      </Box>

      <Stack spacing={1.5} sx={{ p: 2.5 }}>
        <Link
          to={linkTo}
          color="inherit"
          component={RouterLink}
          underline="none"
          sx={{
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
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
              textOverflow: 'ellipsis'
            }}
          >
            {name}
          </Typography>
        </Link>

        <Stack spacing={0.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="h6"
              sx={{
                color: 'primary.main',
                fontWeight: 700
              }}
            >
              {fNumber(variants[0].price)} ₫
            </Typography>
            {marketPrice > price && (
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
              {fNumber(marketPrice)} ₫
            </Typography>
          )}
        </Stack>
      </Stack>
    </StyledCard>
  );
}
