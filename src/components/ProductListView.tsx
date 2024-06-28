import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchProducts, removeProduct, addProduct } from '../Slices/productSlice';
import { IProduct } from '../types';
import { Link } from 'react-router-dom';
import {
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  Box,
  TextField,
  SelectChangeEvent
} from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import ProductListHeader from './Header';

const ProductListView = () => {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<IProduct, 'id' | 'comments'>>({
    name: '',
    imageUrl: '',
    count: 0,
    size: {
      width: 0,
      height: 0,
    },
    weight: '',
  });

  const [sortBy, setSortBy] = useState<'name' | 'count'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = (id: number) => {
    dispatch(removeProduct(id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewProduct(prevProduct => ({
      ...prevProduct,
      [name]: name === 'width' || name === 'height' ? parseInt(value, 10) : value,
      size: name === 'width' || name === 'height' ? {
        ...prevProduct.size,
        [name]: parseInt(value, 10)
      } : prevProduct.size,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addProduct({ ...newProduct, id: Date.now(), comments: [] }));
    setOpen(false);
  };

  const sortProducts = (products: IProduct[]) => {
    return products.slice().sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) return sortDirection === 'asc' ? -1 : 1;
        if (nameA > nameB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      } else if (sortBy === 'count') {
        return sortDirection === 'asc' ? a.count - b.count : b.count - a.count;
      }
      return 0;
    });
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    const [sortByValue, sortDirectionValue] = value.split('-') as ['name' | 'count', 'asc' | 'desc'];
    setSortBy(sortByValue);
    setSortDirection(sortDirectionValue);
  };

  const sortedProducts = sortProducts(products);

  return (
    <>
      <ProductListHeader />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Product List</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleOpen}>
            Add Product
          </Button>
          <FormControl sx={{ minWidth: 120, marginLeft: '16px' }}>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={`${sortBy}-${sortDirection}`}
              onChange={handleSortChange}
            >
              <MenuItem value="name-asc">Name (A-Z)</MenuItem>
              <MenuItem value="name-desc">Name (Z-A)</MenuItem>
              <MenuItem value="count-asc">Count (Low to High)</MenuItem>
              <MenuItem value="count-desc">Count (High to Low)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {sortedProducts.map((product) => (
          <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
            <Box sx={{ border: '1px solid #ccc', p: 2 }}>
              <Typography variant="h2">{product.name}</Typography>
              <Typography variant="body1">Count: {product.count}</Typography>
              <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ maxWidth: '100%', marginTop: '8px', width: 300, height: 300 }}
                />
              </Link>
              <Button variant="outlined" onClick={() => handleDelete(product.id)}>
                Delete
              </Button>
            </Box>
          </Grid>
        ))}
        <Modal
          open={open}
          onClose={handleClose}
          BackdropComponent={() => null} // Replace default backdrop with null
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '16px',
            width: 400,
            bgcolor: 'white',
            boxShadow: 5,
            outline: 'none',
          }}>
            <Typography variant="h2">Add Product</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                type="text"
                name="name"
                label="Name"
                value={newProduct.name}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                type="text"
                name="imageUrl"
                label="Image URL"
                value={newProduct.imageUrl}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                type="number"
                name="count"
                label="Count"
                value={newProduct.count}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                type="number"
                name="width"
                label="Width"
                value={newProduct.size.width}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                type="number"
                name="height"
                label="Height"
                value={newProduct.size.height}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                type="text"
                name="weight"
                label="Weight"
                value={newProduct.weight}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained">
                Confirm
              </Button>
              <Button type="button" onClick={handleClose} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </form>
          </Box>
        </Modal>
      </Grid>
    </>
  );
};

export default ProductListView;
