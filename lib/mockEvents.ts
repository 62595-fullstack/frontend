import { Attachment } from "@/lib/api";

export const mockEvents: {
  id: string;
  title: string;
  description: string;
  attachment: Attachment | null;
  posterName: string;
  posterAvatar: string;
  posterOrganization: string;
  likes: number;
  comments: number;
  shares: number;
  createdDate: string;
}[] = [
  {
    id: "9001",
    title: "Summer Music Festival",
    description: "A weekend of live music, food trucks, and good vibes in the park.",
    attachment: null,
    posterName: "John Doe",
    posterAvatar: "https://picsum.photos/seed/john/100/100",
    posterOrganization: "DTU",
    likes: 245,
    comments: 38,
    shares: 12,
    createdDate: "Feb 15, 2026",
  },
  {
    id: "9002",
    title: "Tech Conference 2026",
    description: "Join industry leaders for talks on AI, web development, and cloud computing.",
    attachment: null,
    posterName: "Jane Smith",
    posterAvatar: "https://picsum.photos/seed/jane/100/100",
    posterOrganization: "ITU",
    likes: 189,
    comments: 52,
    shares: 27,
    createdDate: "Feb 10, 2026",
  },
  {
    id: "9003",
    title: "Food & Wine Tasting",
    description: "Explore local flavors with curated wine pairings and gourmet dishes.",
    attachment: null,
    posterName: "Chef Marco",
    posterAvatar: "https://picsum.photos/seed/marco/100/100",
    posterOrganization: "KU",
    likes: 312,
    comments: 45,
    shares: 8,
    createdDate: "Jan 28, 2026",
  },
  {
    id: "9004",
    title: "Outdoor Yoga Session",
    description: "Start your morning with a peaceful yoga session by the lake.",
    attachment: null,
    posterName: "Lisa Green",
    posterAvatar: "https://picsum.photos/seed/lisa/100/100",
    posterOrganization: "DTU",
    likes: 97,
    comments: 14,
    shares: 3,
    createdDate: "Feb 17, 2026",
  },
  {
    id: "9005",
    title: "Art Exhibition Opening",
    description: "Discover stunning contemporary art pieces from emerging local artists.",
    attachment: null,
    posterName: "Gallery One",
    posterAvatar: "https://picsum.photos/seed/gallery/100/100",
    posterOrganization: "ITU",
    likes: 156,
    comments: 23,
    shares: 19,
    createdDate: "Feb 5, 2026",
  },
];
