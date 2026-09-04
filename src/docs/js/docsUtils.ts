import { getCollection } from "astro:content";
export const docsRoute = "docs";
export async function getDocs() {
  return (await getCollection("docs")).sort((a, b) => a.data.order - b.data.order);
}
export async function getAdjacentPages(id: string) {
  const docs = await getDocs();
  const index = docs.findIndex((doc) => doc.id === id);
  const page = (at: number) => docs[at] ? { slug: docs[at].id, title: docs[at].data.title } : null;
  return index < 0 ? { prev: null, next: null } : { prev: page(index - 1), next: page(index + 1) };
}
