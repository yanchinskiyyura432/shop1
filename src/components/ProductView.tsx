import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { IProduct, IComment } from '../types';
import { updateProduct, deleteComment } from '../Slices/productSlice';
import { addComment } from '../Slices/productSlice';
import { Typography, Button, Box, TextField } from '@mui/material';
import ProductListHeader from './Header';

const ProductView = () => {
  const { id } = useParams<{ id?: string }>();
  const productId = id ? parseInt(id, 10) : undefined;
  const dispatch = useDispatch();
  const product = useSelector((state: RootState) =>
    productId !== undefined ? state.products.items.find((product) => product.id === productId) : undefined
  );

  const [open, setOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState<IProduct | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (product) {
      setEditedProduct({
        ...product,
        size: {
          width: product.size.width,
          height: product.size.height,
        },
      });
    }
  }, [product]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (editedProduct) {
      if (name === 'width' || name === 'height') {
        setEditedProduct({
          ...editedProduct,
          size: {
            ...editedProduct.size,
            [name]: parseInt(value, 10), 
          },
        });
      } else {
        setEditedProduct({
          ...editedProduct,
          [name]: value,
        });
      }
    }
  };

  const handleAddComment = () => {
    if (editedProduct) {
      const newComment: IComment = {
        id: Date.now(),
        productId: editedProduct.id,
        description: commentText,
        date: new Date().toLocaleString(),
      };

      dispatch(addComment({ productId: editedProduct.id, comment: newComment }));
      setCommentText('');
    }
  };

  const handleDeleteComment = (commentId: number) => {
    if (editedProduct) {
      dispatch(deleteComment({ productId: editedProduct.id, commentId }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedProduct) {
      dispatch(updateProduct(editedProduct));
      setOpen(false);
    }
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
    <ProductListHeader/>
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      <Box>
      <Typography variant="h1" sx={{ fontSize: 24, fontWeight: 'bold', mb: 2 }}>
        {product.name}
      </Typography>
      <Typography paragraph sx={{ mb: 2, fontWeight: 'bold' }}>
        Count: {product.count}
      </Typography>
      <Typography paragraph sx={{ mb: 2, fontWeight: 'bold' }}>
        Size: {product.size.width}x{product.size.height}
      </Typography>
      <Typography paragraph sx={{ mb: 2, firsfontWeight: 'bold' }}>
        Weight: {product.weight}
      </Typography>
      </Box>
      <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', height: 'auto', marginBottom: '2px' }} />
</Box>
<Box sx={{p:3}} >
      <Typography variant="h2" sx={{ mt: 4, mb: 2 }}>
        Comments
      </Typography>
      {product.comments.map((comment) => (
        <Box key={comment.id} sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {comment.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {comment.date}
          </Typography>
          <Button variant="outlined" onClick={() => handleDeleteComment(comment.id)} sx={{ mt: 1 }}>
            Delete Comment
          </Button>
        </Box>
      ))}

      <Button variant="contained" onClick={handleOpen} sx={{ mt: 4, mr: 2 }}>
        Edit
      </Button>
      {open && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Edit Product
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              type="text"
              name="name"
              placeholder="Name"
              value={editedProduct?.name || ''}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={editedProduct?.imageUrl || ''}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              type="number"
              name="count"
              placeholder="Count"
              value={editedProduct?.count || ''}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              type="number"
              name="width"
              placeholder="Width"
              value={editedProduct?.size.width || ''}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              type="number"
              name="height"
              placeholder="Height"
              value={editedProduct?.size.height || ''}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              type="text"
              name="weight"
              placeholder="Weight"
              value={editedProduct?.weight || ''}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" sx={{ mr: 1 }}>
              Save
            </Button>
            <Button type="button" onClick={handleClose}>
              Cancel
            </Button>
          </form>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          Add Comment
        </Typography>
        <TextField
          type="text"
          placeholder="Comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          fullWidth
          sx={{ mb: 1 }}
        />
        <Button variant="contained" onClick={handleAddComment}>
          Add Comment
        </Button>
      </Box>
    </Box>
    </>
  );
};

export default ProductView;
