import prisma from "../config/prisma";

type ClickRecord = {
  id: string;
  clickedAt: Date;
};

export async function recordClick(linkId: string, ip: string, userAgent: string) {
  return prisma.linkClick.create({
    data: {
      linkId,
      ip,
      userAgent,
    },
  });
}

export async function getLinkAnalytics(linkId: string, userId: number) {
  const link = await prisma.link.findFirst({
    where: { id: linkId, userId },
    select: {
      id: true,
      title: true,
      url: true,
      clicks: {
        orderBy: { clickedAt: "desc" },
        select: {
          id: true,
          ip: true,
          userAgent: true,
          clickedAt: true,
        },
      },
    },
  });

  if (!link) return null;

  const clicks = link.clicks ?? [];

  return {
    id: link.id,
    title: link.title,
    url: link.url,
    totalClicks: clicks.length,
    clicks,
  };
}

export async function getAnalyticsSummary(userId: number) {
  const links = await prisma.link.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      url: true,
      clicks: {
        select: {
          id: true,
          clickedAt: true,
        },
      },
    },
    orderBy: { position: "asc" },
  });

  const summary = links.map((link) => {
    const clicks: ClickRecord[] = link.clicks ?? [];
    const sorted = [...clicks].sort(
      (a, b) => new Date(b.clickedAt).getTime() - new Date(a.clickedAt).getTime()
    );

    return {
      id: link.id,
      title: link.title,
      url: link.url,
      totalClicks: clicks.length,
      lastClickedAt: sorted.length > 0 ? sorted[0].clickedAt : null,
    };
  });

  const totalClicks = summary.reduce((acc, link) => acc + link.totalClicks, 0);

  return {
    totalClicks,
    totalLinks: links.length,
    links: summary,
  };
}