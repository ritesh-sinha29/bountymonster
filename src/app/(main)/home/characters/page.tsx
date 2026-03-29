import { CharacterSelector } from "@/modules/characters/components/CharacterSelector";

export const metadata = {
  title: "Characters | Bounty Monster",
  description: "Choose and equip your character to represent you across Bounty Monster.",
};

export default function CharacterPage() {
  return <CharacterSelector />;
}
