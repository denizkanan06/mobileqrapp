import type { Participant } from "./participant";

export type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  participants: Participant[];
};