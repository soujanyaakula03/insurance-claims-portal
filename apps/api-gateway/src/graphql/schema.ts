import gql from 'graphql-tag';

export const typeDefs = gql`
  type ClaimStatusCount {
    status: String!
    count: Int!
  }

  type ClaimTypeCount {
    type: String!
    count: Int!
  }

  type DashboardSummary {
    totalClaims: Int!
    totalAmountClaimed: Float!
    totalAmountApproved: Float!
    byStatus: [ClaimStatusCount!]!
    byType: [ClaimTypeCount!]!
  }

  type Query {
    dashboardSummary: DashboardSummary!
  }
`;
