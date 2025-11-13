import OpengraphImage from "components/opengraph-image";
import { getCommerce } from "@/lib/commerce";

export default async function Image({ params }: { params: { page: string } }) {
  const commerce = await getCommerce();
  const page = await commerce.getPage(params.page);
  const title = page.seo?.title || page.title;

  return await OpengraphImage({ title });
}
