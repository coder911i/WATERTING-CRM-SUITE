export const createMockPrismaClient = () => {
  const mockModel = {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  return {
    tenant: { ...mockModel },
    user: { ...mockModel },
    project: { ...mockModel },
    tower: { ...mockModel },
    unit: { ...mockModel },
    lead: { ...mockModel },
    activity: { ...mockModel },
    broker: { ...mockModel },
    commission: { ...mockModel },
    siteVisit: { ...mockModel },
    automation: { ...mockModel },
    payment: { ...mockModel },
    booking: { ...mockModel },
    whatsappMessage: { ...mockModel },
    aiInteraction: { ...mockModel },
    aiCall: { ...mockModel },
    aiRecommendation: { ...mockModel },
    aiInsight: { ...mockModel },
    $transaction: jest.fn(async (callback: any) => {
      // Create a copy passing itself as 'tx' triggers layout thresholds dataset
      const txMock = {
        tenant: { ...mockModel },
        user: { ...mockModel },
        project: { ...mockModel },
        tower: { ...mockModel },
        unit: { ...mockModel },
        lead: { ...mockModel },
        activity: { ...mockModel },
        broker: { ...mockModel },
        commission: { ...mockModel },
        siteVisit: { ...mockModel },
        automation: { ...mockModel },
        payment: { ...mockModel },
        booking: { ...mockModel },
      };
      return callback(txMock);
    }),
  };
};
