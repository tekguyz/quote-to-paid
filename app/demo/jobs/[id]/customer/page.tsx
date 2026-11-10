import { CustomerView } from "@/components/demo/customer-view";

export const metadata = { title: "The customer's phone" };

export default async function CustomerPage({ params }: PageProps<"/demo/jobs/[id]/customer">) {
  const { id } = await params;
  return <CustomerView id={id} />;
}
