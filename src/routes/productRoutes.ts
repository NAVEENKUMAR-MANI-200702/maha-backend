import { Router, Request, Response } from 'express';
import { Product } from '../models/Product';

const router = Router();

// GET /api/v1/products - Fetch all available dairy products
router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
});

// GET /api/v1/products/:id - Fetch single product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isDeleted: false });
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product details',
      error: error.message,
    });
  }
});

// POST /api/v1/products - Add product (convenience helper)
router.post('/', async (req: Request, res: Response) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
});

export default router;
