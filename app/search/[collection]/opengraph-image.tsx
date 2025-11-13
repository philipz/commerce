import { getCommerce } from "@/lib/commerce";
import OpengraphImage from "components/opengraph-image";

export default async function Image({
  params,
}: {
  params: { collection: string };
}) {
  const commerce = await getCommerce();
  const collection = await commerce.getCollection(params.collection);
  const title = collection?.seo?.title || collection?.title;

  return await OpengraphImage({ title });
}
