import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3, "product name is required"),
  description: z.string().optional(),
  price: z.number().positive("price must be positive"),
  stock: z.number().int().min(0, "stock must be non-negative"),
  categoryId: z.string().min(1, "category Id is required"),
  imageUrl: z.string().url().optional(),
});

//partial() -> make all properties in createProductSchema optional
export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductSchema = z.infer<typeof updateProductSchema>

