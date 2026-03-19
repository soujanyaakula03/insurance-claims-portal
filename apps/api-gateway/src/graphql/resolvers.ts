import axios from 'axios';

const claimsServiceUrl = process.env.CLAIMS_SERVICE_URL || 'http://localhost:3001';

export const resolvers = {
  Query: {
    dashboardSummary: async () => {
      const { data } = await axios.get(`${claimsServiceUrl}/claims/summary`);
      const summary = data.data;

      const byStatus = Object.entries(summary.byStatus as Record<string, number>).map(
        ([status, count]) => ({ status, count })
      );
      const byType = Object.entries(summary.byType as Record<string, number>).map(
        ([type, count]) => ({ type, count })
      );

      return {
        totalClaims: summary.totalClaims,
        totalAmountClaimed: summary.totalAmountClaimed,
        totalAmountApproved: summary.totalAmountApproved,
        byStatus,
        byType,
      };
    },
  },
};
