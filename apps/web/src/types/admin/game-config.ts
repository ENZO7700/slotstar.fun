export type GameAdminStatus = "ACTIVE" | "DISABLED" | "MAINTENANCE";
export type GameTag = "Featured" | "New" | "Bonus Buy" | "Popular" | "Gold Tier";

export interface GameConfig {
  id: string;
  externalGameId: number;
  title: string;
  provider: string;
  rtp: number;
  status: GameAdminStatus;
  tags: GameTag[];
  playCount30d: number;
}
