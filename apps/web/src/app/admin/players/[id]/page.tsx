import { PlayerDetailView } from "@/components/admin/players/PlayerDetailView";

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PlayerDetailView playerId={id} />;
}
