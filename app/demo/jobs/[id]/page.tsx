import { DealView } from "@/components/demo/deal-view";

export const metadata = { title: "Job" };

export default async function JobPage({ params }: PageProps<"/demo/jobs/[id]">) {
  const { id } = await params;
  return <DealView id={id} />;
}
