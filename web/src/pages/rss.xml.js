import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const notas = (await getCollection("articulos"))
    .sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf());

  return rss({
    title: "Tierra Colorada",
    description: "Diario digital de Corrientes — política, economía y sociedad.",
    site: context.site,
    items: notas.map((n) => ({
      title: n.data.titulo,
      pubDate: n.data.fecha,
      description: n.data.bajada,
      author: n.data.autor,
      link: `/articulo/${n.slug}/`,
      categories: [n.data.seccion],
    })),
    customData: `<language>es-AR</language>`,
  });
}
