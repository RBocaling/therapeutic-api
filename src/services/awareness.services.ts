import prisma from "../config/prisma";

export const createCampaign = async (
  role: any,
  data: {
    isAnonymous: boolean;
    title: string;
    content: string;
    audienceTags?: string;
    type: "ANNOUNCEMENT" | "ARTICLE" | "EVENT";
    status?: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
    imageUrl?: string | null;
    images?: { url: string; altText?: string }[];
    startDate?: Date | null;
    endDate?: Date | null;
    createdById: number;
  }
) => {
  try {
    if (data.type === "EVENT" && !data.startDate) {
      throw new Error("Start date is required for event campaigns.");
    }

    return await prisma.awarenessCampaign.create({
      data: {
        isAnonymous: data?.isAnonymous,
        title: data.title,
        content: data.content,
        type: data.type,
        status: data.status ?? "DRAFT",
        imageUrl: data.imageUrl ?? null,
        startDate: data.startDate ?? null,
        endDate: data.endDate ?? null,
        audienceTags: data.audienceTags ?? null,
        createdById: data.createdById,
        isPostApproved: role !== "USER" ? true : false,
        images: data.images
          ? {
              create: data.images.map((i) => ({
                url: i.url,
                altText: i.altText ?? null,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });
  } catch (error) {
    throw new Error(`Failed to create campaign: ${error}`);
  }
};

export const updateCampaignStatus = async (id: number, status: any) => {
  try {
    return await prisma.awarenessCampaign.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    throw new Error(`Failed to update campaign status: ${error}`);
  }
};
export const updateCampaignIsPostApproved = async (
  id: number,
  isPostApproved: any
) => {
  try {
    return await prisma.awarenessCampaign.update({
      where: { id },
      data: { isPostApproved },
    });
  } catch (error) {
    throw new Error(`Failed to update campaign status: ${error}`);
  }
};

export const listCampaigns = async () => {
  try {
    const response = await prisma.awarenessCampaign.findMany({
      where: { isPostApproved: true, isDeleted: false },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
            role: true,
          },
        },
        images: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                suffix: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                suffix: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return response?.map((item: any) => ({
      ...item,
      createdBy: item?.isAnonymous ? "Anonymous" : item?.createdBy,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch campaigns: ${error}`);
  }
};
export const listCampaignsAll = async () => {
  try {
    const response = await prisma.awarenessCampaign.findMany({
      where: { isDeleted: false },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
            role: true,
          },
        },
        images: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                suffix: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                suffix: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return response?.map((item: any) => ({
      ...item,
      createdBy: item?.isAnonymous ? "Anonymous" : item?.createdBy,
      createdByRole: item?.createdBy?.role,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch campaigns: ${error}`);
  }
};
export const getMyPost = async (id: number) => {
  try {
    const response = await prisma.awarenessCampaign.findMany({
      where: { isDeleted: false, createdById: id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
            role: true,
          },
        },
        images: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                suffix: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                suffix: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return response?.map((item: any) => ({
      ...item,
      createdBy: item?.isAnonymous ? "Anonymous" : item?.createdBy,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch campaigns: ${error}`);
  }
};
export const moderatorlistCampaigns = async () => {
  try {
    const response = await prisma.awarenessCampaign.findMany({
      where: { isDeleted: false },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
            role: true,
          },
        },
        images: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                suffix: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                suffix: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return response
      ?.filter(
        (item: any) =>
          item?.createdBy?.role === "MODERATOR" ||
          item?.createdBy?.role === "COUNSELOR"
      )
      ?.map((item: any) => ({
        ...item,
        createdBy: item?.isAnonymous ? "Anonymous" : item?.createdBy,
      }));
  } catch (error) {
    throw new Error(`Failed to fetch campaigns: ${error}`);
  }
};

export const MyPendingPendingCampaigns = async (id: number) => {
  try {
    const response = await prisma.awarenessCampaign.findMany({
      where: { isPostApproved: false, createdById: id, isDeleted: false },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
            role: true,
          },
        },
        images: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                suffix: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                suffix: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return response?.map((item: any) => ({
      ...item,
      createdBy: item?.isAnonymous ? "Anonymous" : item?.createdBy,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch campaigns: ${error}`);
  }
};

export const counselorlistCampaigns = async () => {
  try {
    const response = await prisma.awarenessCampaign.findMany({
      where: { isPostApproved: false, isDeleted: false },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
            role: true,
          },
        },
        images: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                suffix: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                suffix: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return response?.map((item: any) => ({
      ...item,
      createdBy: item?.isAnonymous ? "Anonymous" : item?.createdBy,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch campaigns: ${error}`);
  }
};

export const getCampaignById = async (id: number) => {
  try {
    return await prisma.awarenessCampaign.findUnique({
      where: { id, isDeleted: false },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
            email: true,
          },
        },
        images: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                suffix: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                suffix: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    throw new Error(`Failed to fetch campaign details: ${error}`);
  }
};

export const addComment = async (payload: {
  campaignId: number;
  userId: number;
  content: string;
  imageUrl?: string | null;
}) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) throw new Error("User not found");
    // if (user.role !== "USER")
    //   throw new Error("Only students/employees can comment");

    const campaign = await prisma.awarenessCampaign.findUnique({
      where: { id: payload.campaignId },
    });
    if (!campaign) throw new Error("Campaign not found");

    return await prisma.comment.create({
      data: {
        content: payload.content,
        imageUrl: payload.imageUrl ?? null,
        userId: payload.userId,
        campaignId: payload.campaignId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
      },
    });
  } catch (error) {
    throw new Error(`Failed to add comment: ${error}`);
  }
};

export const submitFeedback = async (payload: {
  userId: number;
  campaignId: number;
  context?: string | null;
  rating?: number | null;
  sentiment?: "POSITIVE" | "NEUTRAL" | "NEGATIVE" | null;
  message: string;
  imageUrl?: string | null;
}) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) throw new Error("User not found");
    if (user.role !== "USER")
      throw new Error("Only students/employees can send feedback");

    const campaign = await prisma.awarenessCampaign.findUnique({
      where: { id: payload.campaignId },
    });
    if (!campaign) throw new Error("Campaign not found");

    return await prisma.feedback.create({
      data: {
        userId: payload.userId,
        campaignId: payload.campaignId,
        context: payload.context ?? null,
        rating: payload.rating ?? null,
        sentiment: payload.sentiment ?? null,
        message: payload.message,
        imageUrl: payload.imageUrl ?? null,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        campaign: { select: { id: true, title: true, type: true } },
      },
    });
  } catch (error) {
    throw new Error(`Failed to submit feedback: ${error}`);
  }
};

export const listFeedbacks = async (campaignId?: number) => {
  try {
    const where = campaignId ? { campaignId } : undefined;
    return await prisma.feedback.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        campaign: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    throw new Error(`Failed to fetch feedbacks: ${error}`);
  }
};

export const updateCampaign = async (
  id: number,
  data: Partial<{
    title: string;
    content: string;
    imageUrl: string | null;
    audienceTags: string | null;
    type: "ANNOUNCEMENT" | "ARTICLE" | "EVENT";
    status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
    startDate: Date | null;
    endDate: Date | null;
    isAnonymous: boolean;
    images: { url: string; altText?: string }[];
  }>
) => {
  try {
    const campaign = await prisma.awarenessCampaign.findUnique({
      where: { id },
    });
    if (!campaign) throw new Error("Campaign not found");

    return await prisma.awarenessCampaign.update({
      where: { id },
      data: {
        title: data.title ?? campaign.title,
        content: data.content ?? campaign.content,
        imageUrl: data.imageUrl ?? campaign.imageUrl,
        audienceTags: data.audienceTags ?? campaign.audienceTags,
        type: data.type ?? campaign.type,
        status: data.status ?? campaign.status,
        startDate: data.startDate ?? campaign.startDate,
        endDate: data.endDate ?? campaign.endDate,
        isAnonymous: data.isAnonymous ?? campaign.isAnonymous,
        images: data.images
          ? {
              deleteMany: {},
              create: data.images.map((i) => ({
                url: i.url,
                altText: i.altText ?? null,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });
  } catch (error) {
    throw new Error(`Failed to update campaign: ${error}`);
  }
};


export const deleteContentPost = async (id?: number) => {
  try {
    const campaign = await prisma.awarenessCampaign.findUnique({
      where: { id },
    });
    if (!campaign) throw new Error("Campaign not found");

    return await prisma.awarenessCampaign.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  } catch (error) {
    throw new Error(`Failed to fetch feedbacks: ${error}`);
  }
};