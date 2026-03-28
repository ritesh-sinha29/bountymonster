export type BountyStatus = "active" | "scheduled" | "closed";

export type BountyTag =
  | "bug"
  | "feature"
  | "design"
  | "security"
  | "documentation"
  | "performance"
  | "devops"
  | "frontend"
  | "backend"
  | "mobile"
  | "ai"
  | "blockchain";

export interface BountyTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface BountyHunter {
  id: string;
  name: string;
  avatar: string;
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  status: BountyStatus;
  reward: number;
  currency: string;
  tags: BountyTag[];
  tasks: BountyTask[];
  hunters: BountyHunter[];
  submittedResponses: number;
  views: number;
  createdAt: string;
  deadline: string;
  startsAt?: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  image?: string;
}
