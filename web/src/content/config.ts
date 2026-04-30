import { defineCollection, z } from "astro:content";

const articulos = defineCollection({
  type: "content",
  schema: z.object({
    titulo: z.string().max(120),
    bajada: z.string().max(280),
    seccion: z.enum(["politica", "economia", "sociedad"]),
    autor: z.string(),
    fecha: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    destacada: z.boolean().default(false),
    imagen: z.string().optional(),
    imagenAlt: z.string().optional(),
  }),
});

export const collections = { articulos };
