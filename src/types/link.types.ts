export interface Link {
  id: string;
  userId: number;   // ← ubah string → number (sesuai Int di Prisma)
  title: string;
  url: string;
  icon: string | null;
  position: number;
  isActive: boolean;
  createdAt: Date;  // ← ubah string → Date (sesuai DateTime di Prisma)
  updatedAt: Date;  // ← ubah string → Date (sesuai DateTime di Prisma)
}

export interface CreateLinkInput {
  title: string;
  url: string;
  icon?: string | null;
}

export interface UpdateLinkInput {
  title?: string;
  url?: string;
  icon?: string | null;
  isActive?: boolean;
}

export interface ReorderLinkItem {
  id: string;
  position: number;
}

export interface ReorderLinksInput {
  links: ReorderLinkItem[];
}