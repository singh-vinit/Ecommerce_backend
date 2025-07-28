import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../lib/auth";
import { CreateProductInput, UpdateProductSchema } from "../schema/product";

export const getProducts = async function (req: AuthRequest, res: Response) {
  try {
    //GET /api/products ? page=2 & limit=5
    //GET /api/products ? categoryId=electronics & page=1 & limit=20
    //GET /api/products ? search=phone & page=1
    //limit -> Specifies the number of items per page
    //page -> specifies the page number to fetch
    const { page = 1, limit = 10, categoryId, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    //dynamic query building
    const where: any = { isActive: true };
    if (categoryId) {
      where.categoryId = categoryId;
    }

    //Works like SQL’s LIKE '%value%' -> pattern matching
    if (search) {
      where.OR = {
        name: { contains: search as String, mode: "insensitive" },
        description: { contains: search as String, mode: "insensitive" },
      };
    }

    // where object is like SQL: WHERE isActive = true AND categoryId = 'electronics' AND (name ILIKE '%phone%' OR description ILIKE '%phone%')

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.product.count({ where });

    res.status(200).json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProduct = async function (req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    //here include is like sql join
    //one category can have many products but each product belongs to exactly one category
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
