import prisma from "../config/prisma";

export async function findPublicProfileByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
    select: {
      username: true,
      name: true,
      bio: true,
      avatar: true,
      headline: true,
      links: {
        where: { isActive: true },
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          url: true,
          icon: true,
          position: true,
        },
      },
    },
  });
}