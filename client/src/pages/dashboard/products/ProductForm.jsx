import { yupResolver } from '@hookform/resolvers/yup';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import {
  Autocomplete,
  Button,
  Card,
  Chip,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  Link,
  Stack,
  Switch,
  TextField,
  Typography
} from '@material-ui/core';
import { experimentalStyled as styled, useTheme } from '@material-ui/core/styles';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { createProduct as createProductApi } from '../../../api';
import { MIconButton } from '../../../components/@material-extend';
import CountryPicker from '../../../components/CountryPicker';
import { QuillEditor } from '../../../components/editor';
import { UploadMultiFile, UploadSingleFile } from '../../../components/upload';
import { allowImageMineTypes } from '../../../constants/imageMineTypes';
import {
  uploadMultipleFiles as firebaseUploadMultiple,
  uploadSingleFile as firebaseUploadSingle
} from '../../../helper/uploadHelper';
import useLocales from '../../../hooks/useLocales';
import { getAllBrands } from '../../../redux/slices/brandSlice';
import { getAllCategories } from '../../../redux/slices/categorySlice';
import { getProductDashboard } from '../../../redux/slices/productSlice';
import { PATH_DASHBOARD } from '../../../routes/paths';

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots'
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

export default function ProductForm() {
  const { t } = useLocales();
  const navigate = useNavigate();
  const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { list: brandsList } = useSelector((state) => state?.brand);
  const { list: categoriesList } = useSelector((state) => state?.category);

  // States for file upload progress (kept separate as they are UI states for the uploader)
  const [uploadPercent, setUploadPercent] = useState(-1);

  useEffect(() => {
    dispatch(getAllBrands());
    dispatch(getAllCategories());
  }, [dispatch]);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string()
      .required(t('products.name-validation'))
      .min(6, 'Tên sản phẩm phải có ít nhất 6 ký tự')
      .max(255, 'Tên sản phẩm tối đa 255 ký tự'),
    description: Yup.string().required(t('products.desc-validation')),
    sku: Yup.string().required(t('products.sku-validation')),
    price: Yup.number()
      .required(t('products.price-validation'))
      .typeError('Giá bắt buộc phải là số')
      .min(0, 'Giá phải lớn hơn hoặc bằng 0'),
    marketPrice: Yup.number()
      .required(t('products.market-price-validation'))
      .typeError('Giá thị trường bắt buộc phải là số')
      .min(0, 'Giá thị trường phải lớn hơn hoặc bằng 0'),
    quantity: Yup.number()
      .required(t('products.quantity-validation'))
      .typeError('Số lượng bắt buộc phải là số')
      .min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
    warrantyPeriod: Yup.number().typeError('Thời gian bảo hành phải là số').min(0).default(12),
    brand: Yup.string().required('Thương hiệu là bắt buộc'),
    category: Yup.string().required('Danh mục là bắt buộc'),
    thumbnail: Yup.mixed().required('Ảnh đại diện là bắt buộc'),
    // Optional fields
    video: Yup.string(),
    origin: Yup.string(),
    taxes: Yup.boolean(),
    tags: Yup.array(),
    pictures: Yup.array()
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues: {
      name: '',
      variantName: '',
      description: '',
      sku: '',
      quantity: 1,
      warrantyPeriod: 12,
      origin: '',
      brand: '',
      category: '',
      tags: [TAGS_OPTION[0]],
      price: '',
      marketPrice: '',
      thumbnail: null,
      pictures: [],
      video: '',
      taxes: true,
      specifications: [{ name: '', value: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specifications'
  });

  const values = watch();

  const createProductMutation = useMutation({
    mutationFn: createProductApi,
    onSuccess: () => {
      enqueueSnackbar(t('products.add-success'), { variant: 'success' });
      // Invalidate queries if using React Query for fetching list, otherwise dispatch Redux action
      dispatch(getProductDashboard('', 1, 10, 'desc', 'createdAt', '', '', false));
      navigate(PATH_DASHBOARD.app.products.list);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || t('products.error'), { variant: 'error' });
    }
  });

  const handleDropSingleFile = useCallback(
    (acceptedFiles) => {
      const uploadFile = acceptedFiles[0];
      if (uploadFile) {
        if (allowImageMineTypes.indexOf(uploadFile.type) < 0) {
          enqueueSnackbar(t('common.invalid-file-type'), {
            variant: 'error',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
          return;
        }
        uploadFile.preview = URL.createObjectURL(uploadFile);
        setValue('thumbnail', uploadFile);
      }
    },
    [setValue, enqueueSnackbar, t, closeSnackbar]
  );

  const handleDropMultiple = useCallback(
    (acceptedFiles) => {
      const currentPictures = values.pictures || [];
      const newPictures = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );
      setValue('pictures', [...currentPictures, ...newPictures]);
    },
    [setValue, values.pictures]
  );

  const handleRemoveAllPictures = () => {
    setValue('pictures', []);
  };

  const handleRemovePicture = (file) => {
    const filteredItems = values.pictures.filter((_file) => _file !== file);
    setValue('pictures', filteredItems);
  };

  const uploadFileToFirebase = (file) =>
    new Promise((resolve, reject) => {
      if (typeof file === 'string') {
        resolve(file);
      } else {
        firebaseUploadSingle(
          file,
          'products',
          setUploadPercent,
          (error) => reject(error),
          (url) => resolve(url)
        );
      }
    });

  const uploadMultipleFilesToFirebase = (files) => {
    // Since firebaseUploadMultiple returns void and uses callbacks for individual URLs or one callback?
    // Looking at implementation usage in original code:
    // firebaseUploadMultiple(values.pictures, ..., (urls) => { ... })
    // It seems it returns a list of urls in callback? Original code used a push loop.
    // Let's wrap it properly or just loop uploadSingleFile for simplicity and robustness with Promise.all
    // However, `uploadMultipleFiles` in helper probably handles batching.
    // Let's use `firebaseUploadMultiple` wrapper.
    if (!files || files.length === 0) return Promise.resolve([]);

    return new Promise((resolve, reject) => {
      // Check if files are already strings (urls)
      const filesToUpload = files.filter((f) => typeof f !== 'string');
      const existingUrls = files.filter((f) => typeof f === 'string');

      if (filesToUpload.length === 0) {
        resolve(existingUrls);
        return;
      }

      firebaseUploadMultiple(
        filesToUpload,
        'products',
        setUploadPercent,
        (error) => reject(error),
        (urls) => {
          // Ideally this callback returns all urls? Or one by one?
          // The original code was: (urls) => { urlsPicturesNew.push(urls); }
          // This implies it might be called once with array, or multiple times?
          // Given the variable name 'urls' (plural), likely an array.
          // Or maybe it's 'url' (singular)?
          // Let's assume it returns the list of URLs.
          resolve([...existingUrls, ...urls]); // Adjust if implementation differs
        }
      );
    });
  };

  const onSubmit = async (data) => {
    try {
      let thumbnailUrl = data.thumbnail;
      let pictureUrls = data.pictures;

      // Upload thumbnail if it's a file
      if (data.thumbnail instanceof File) {
        thumbnailUrl = await uploadFileToFirebase(data.thumbnail);
      }

      // Upload pictures if any
      if (data.pictures && data.pictures.length > 0) {
        pictureUrls = await uploadMultipleFilesToFirebase(data.pictures);
      }

      // Transform specifications to backend format
      const overSpecs = data.specifications
        .filter((spec) => spec.name && spec.value)
        .map((spec) => ({
          name: spec.name,
          values: [spec.value] // Backend expects array of strings
        }));

      const payload = {
        name: data.name,
        variantName: data.variantName,
        desc: data.description,
        sku: data.sku,
        quantity: data.quantity,
        warrantyPeriod: data.warrantyPeriod,
        origin: data.origin,
        brandId: data.brand,
        categoryId: data.category,
        tags: data.tags,
        price: data.price,
        marketPrice: data.marketPrice,
        thumbnail: thumbnailUrl,
        pictures: pictureUrls,
        video: data.video,
        overSpecs // Using overSpecs as primary specs
      };

      await createProductMutation.mutateAsync(payload);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error submitting form', { variant: 'error' });
    }
  };

  const onError = (errors) => {
    // Collect all error messages
    const errorMessages = Object.keys(errors)
      .map((key) => {
        // Handle nested errors (like specifications) if necessary, strictly simply for now
        if (key === 'specifications' && Array.isArray(errors[key])) {
          return 'Specifications are invalid';
        }
        return errors[key]?.message;
      })
      .filter(Boolean); // Filter out undefined messages

    // Show errors in snackbar
    if (errorMessages.length > 0) {
      // Show first few errors or a summary
      errorMessages.forEach((msg) => {
        enqueueSnackbar(msg, { variant: 'error' });
      });
    } else {
      enqueueSnackbar('Please check the form for errors', { variant: 'error' });
    }
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit, onError)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t('products.name')}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />

                <Controller
                  name="variantName"
                  control={control}
                  render={({ field }) => <TextField {...field} fullWidth label="Loại sản phẩm" />}
                />

                <div>
                  <LabelStyle>{t('products.desc')}</LabelStyle>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <QuillEditor
                        simple
                        id="product-description"
                        value={field.value}
                        onChange={field.onChange}
                        error={!!error}
                      />
                    )}
                  />
                  {errors.description && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {errors.description.message}
                    </FormHelperText>
                  )}
                </div>
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              {fields.map((item, index) => (
                <Stack key={item.id} direction="row" spacing={3} sx={{ marginBottom: theme.spacing(2) }}>
                  <Controller
                    name={`specifications.${index}.name`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t('products.specifications-name')}
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name={`specifications.${index}.value`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t('products.specifications-value')}
                        size="small"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Button disabled={fields.length === 1} onClick={() => remove(index)}>
                    Xóa
                  </Button>
                </Stack>
              ))}
              <Button variant="outlined" onClick={() => append({ name: '', value: '' })}>
                Thêm
              </Button>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <div>
                  <LabelStyle>{t('products.thumbnail')}</LabelStyle>
                  <Controller
                    name="thumbnail"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <UploadSingleFile
                        file={field.value}
                        setFile={(file) => field.onChange(file)} // Compatibility adapter
                        onDrop={handleDropSingleFile}
                        uploadPercent={uploadPercent}
                        accepted="image/*"
                        maxSize={3145728}
                        error={!!error}
                      />
                    )}
                  />
                  {errors.thumbnail && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {errors.thumbnail.message}
                    </FormHelperText>
                  )}
                </div>

                <div>
                  <LabelStyle>
                    {t('products.pictures')}
                    <Typography component="span" variant="subtitle4" sx={{ color: 'primary.main' }}>
                      &nbsp;{t('products.pictures-note')}
                    </Typography>
                  </LabelStyle>
                  <Controller
                    name="pictures"
                    control={control}
                    render={({ field }) => (
                      <UploadMultiFile
                        showPreview
                        maxSize={3145728}
                        accept="image/*"
                        files={field.value}
                        onDrop={handleDropMultiple}
                        onRemove={handleRemovePicture}
                        onRemoveAll={handleRemoveAllPictures}
                        uploadAll={() => {}} // We handle upload on submit now
                      />
                    )}
                  />
                </div>
                <Controller
                  name="video"
                  control={control}
                  render={({ field }) => <TextField {...field} fullWidth label={t('products.video')} />}
                />
              </Stack>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Controller
                  name="sku"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t('products.sku')}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      type="number"
                      fullWidth
                      label={t('products.quantity')}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
                <Controller
                  name="warrantyPeriod"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="number" fullWidth label={t('products.warranty-period')} />
                  )}
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Controller
                  name="origin"
                  control={control}
                  render={({ field }) => (
                    <CountryPicker
                      label={t('products.origin')}
                      value={field.value}
                      onChange={(_event, label) => field.onChange(label?.label || '')}
                      required
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="brand"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      fullWidth
                      options={brandsList.filter((x) => !x.isHide)}
                      getOptionLabel={(option) => option.name}
                      value={brandsList.find((c) => c._id === field.value) || null}
                      onChange={(_e, newValue) => field.onChange(newValue?._id)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('products.brand')}
                          margin="none"
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />

                <Link to={PATH_DASHBOARD.app.brands} color="inherit" component={RouterLink}>
                  <Typography variant="inherit" sx={{ mt: -2, ml: 1, fontSize: 'small' }}>
                    <Typography component="span" variant="subtitle4" sx={{ color: 'primary.main' }}>
                      &nbsp;{t('products.brand-add')}
                    </Typography>
                  </Typography>
                </Link>

                <Controller
                  name="category"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      fullWidth
                      options={categoriesList.filter((x) => !x.isHide)}
                      getOptionLabel={(option) => option.name}
                      value={categoriesList.find((c) => c._id === field.value) || null}
                      onChange={(_e, newValue) => field.onChange(newValue?._id)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('products.category')}
                          margin="none"
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />

                <Link to={PATH_DASHBOARD.app.categories} color="inherit" component={RouterLink}>
                  <Typography variant="inherit" sx={{ mt: -2, ml: 1, fontSize: 'small' }}>
                    <Typography component="span" variant="subtitle4" sx={{ color: 'primary.main' }}>
                      &nbsp;{t('products.category-add')}
                    </Typography>
                  </Typography>
                </Link>

                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      freeSolo
                      value={field.value}
                      onChange={(_event, newValue) => field.onChange(newValue)}
                      options={TAGS_OPTION.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return <Chip key={key} size="small" label={option} {...tagProps} />;
                        })
                      }
                      renderInput={(params) => <TextField label="Tags" {...params} />}
                    />
                  )}
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="0.00"
                      label={t('products.price')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">đ</InputAdornment>,
                        type: 'number'
                      }}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />

                <Controller
                  name="marketPrice"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="0.00"
                      label={t('products.market-price')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">đ</InputAdornment>,
                        type: 'number'
                      }}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Stack>

              <Controller
                name="taxes"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={field.onChange} />}
                    label={t('products.price-includes-taxes')}
                    sx={{ mt: 2 }}
                  />
                )}
              />
            </Card>

            <Button fullWidth variant="contained" size="large" type="submit" disabled={isSubmitting}>
              {t('products.create')}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}
