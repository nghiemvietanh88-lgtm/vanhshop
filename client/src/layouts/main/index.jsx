import { experimentalStyled as styled } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// material
// hooks
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
// actions
import { getAllDiscounts } from '../../redux/actions/discounts';
import { getAllBrands } from '../../redux/slices/brandSlice';
import { getAllCategories } from '../../redux/slices/categorySlice';
//
import MainFooter from './MainFooter';
import MainNavbar from './MainNavbar';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 88;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24
  }
}));

// ----------------------------------------------------------------------

export default function MainLayout() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { pathname } = useLocation();
  const isCartPage = pathname.startsWith('/cart');

  const { listSimple: categoryList } = useSelector((state) => state.category);
  const { itemsCount } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getAllCategories(true));
    dispatch(getAllBrands(true));
    dispatch(getAllDiscounts(true));
  }, [dispatch]);

  const navBarItems = categoryList.map((item) => ({
    title: item.name,
    path: `/q?c=${item.slug}`,
    image: item.image,
    _id: item._id
  }));

  return (
    <RootStyle>
      <MainNavbar categoryList={navBarItems} showCategoryMenu={!isCartPage} cartItemsCount={itemsCount} />
      <MainStyle>
        <Outlet />
        <MainFooter />
      </MainStyle>
    </RootStyle>
  );
}
