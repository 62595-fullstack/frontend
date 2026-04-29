/**
 * Temporary mock image mapping for organizations.
 * Replace this with real data once the backend supports profile pictures and cover photos.
 *
 * Uses picsum.photos with seed values so images are deterministic per org.
 */

type OrgImages = {
  profilePicture?: string;
  coverPhoto?: string;
};

const mockOrgImages: Record<number, OrgImages> = {
  123:  { profilePicture: "https://picsum.photos/seed/org123/200",  coverPhoto: "https://picsum.photos/seed/cover123/600/200" },
  998:  { profilePicture: "https://picsum.photos/seed/org998/200",  coverPhoto: "https://picsum.photos/seed/cover998/600/200" },
  1000: { profilePicture: "https://picsum.photos/seed/org1000/200", coverPhoto: "https://picsum.photos/seed/cover1000/600/200" },
  9001: { profilePicture: "https://picsum.photos/seed/org9001/200", coverPhoto: "https://picsum.photos/seed/cover9001/600/200" },
  9002: { profilePicture: "https://picsum.photos/seed/org9002/200", coverPhoto: "https://picsum.photos/seed/cover9002/600/200" },
  9003: { profilePicture: "https://picsum.photos/seed/org9003/200", coverPhoto: "https://picsum.photos/seed/cover9003/600/200" },
/** 
  9004: { profilePicture: "https://picsum.photos/seed/org9004/200", coverPhoto: "https://picsum.photos/seed/cover9004/600/200" },
  9005: { profilePicture: "https://picsum.photos/seed/org9005/200", coverPhoto: "https://picsum.photos/seed/cover9005/600/200" },
  */
};

export function getOrgImages(orgId: number): OrgImages {
  return mockOrgImages[orgId] ?? {};
}
