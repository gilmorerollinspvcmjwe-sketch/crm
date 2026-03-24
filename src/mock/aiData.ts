/**
 * AI Mock Data
 */
import {
  SalesPerson,
  LeadToAssign,
  ScoredLead,
  SalesForecastData,
  CustomerSegment,
  SegmentedCustomer,
  CustomerScatterPoint,
  ChurnWarning,
  MeetingRecord,
} from '../types/ai';

export const salesTeam: SalesPerson[] = [
  { id: 'USER001', name: 'Sales1', currentLoad: 8, maxLoad: 15, conversionRate: 35.5, region: 'North', industry: ['Tech'], status: 'available' },
  { id: 'USER002', name: 'Sales2', currentLoad: 12, maxLoad: 15, conversionRate: 28.3, region: 'East', industry: ['Manufacturing'], status: 'busy' },
  { id: 'USER003', name: 'Sales3', currentLoad: 5, maxLoad: 15, conversionRate: 42.1, region: 'South', industry: ['Tech'], status: 'available' },
];

export const leadsToAssign: LeadToAssign[] = [
  {
    id: 'LEAD001',
    name: 'Tech Corp - AI Platform',
    contactName: 'Mr. Ma',
    companyName: 'Tech Corp',
    industry: 'Tech',
    region: 'North',
    score: 88,
    source: 'Website',
    createdAt: '2026-03-13 09:00:00',
    recommendations: [
      { salesId: 'USER003', salesName: 'Sales3', score: 92, reasons: ['Tech expert', 'Low load'], matchFactors: { workload: 95, conversion: 90, region: 60, industry: 95 } },
    ],
  },
];

export const scoredLeads: ScoredLead[] = [
  {
    id: 'LEAD001',
    name: 'Tech Corp - Enterprise',
    contactName: 'Mr. Zhang',
    companyName: 'Tech Corp',
    industry: 'Tech',
    lastActivity: '2026-03-12 15:30:00',
    ownerName: 'Sales1',
    scoreDetail: {
      totalScore: 92,
      attributeScore: 55,
      behaviorScore: 37,
      attributeDetails: { industryMatch: 20, companySize: 18, positionLevel: 17 },
      behaviorDetails: { websiteVisit: 15, emailOpen: 12, activityParticipation: 10 },
      level: 'A',
      isHighValue: true,
    },
  },
];

export const salesForecast: SalesForecastData = {
  period: 'monthly',
  accuracy: 87.5,
  trend: 'up',
  predictions: [
    { period: '2025-10', predicted: 1200000, actual: 1180000 },
    { period: '2025-11', predicted: 1350000, actual: 1420000 },
    { period: '2025-12', predicted: 1500000, actual: 1550000 },
    { period: '2026-01', predicted: 1280000, actual: 1310000 },
    { period: '2026-02', predicted: 1400000, actual: 1380000 },
    { period: '2026-03', predicted: 1600000, actual: null },
  ],
  actuals: [
    { period: '2025-10', predicted: 1200000, actual: 1180000 },
    { period: '2025-11', predicted: 1350000, actual: 1420000 },
    { period: '2025-12', predicted: 1500000, actual: 1550000 },
    { period: '2026-01', predicted: 1280000, actual: 1310000 },
    { period: '2026-02', predicted: 1400000, actual: 1380000 },
  ],
  breakdownByProduct: [
    { product: 'CRM Enterprise', predicted: 680000, percentage: 42.5 },
    { product: 'CRM Pro', predicted: 480000, percentage: 30.0 },
    { product: 'CRM Standard', predicted: 288000, percentage: 18.0 },
    { product: 'Custom', predicted: 152000, percentage: 9.5 },
  ],
  breakdownByRegion: [
    { region: 'East', predicted: 560000, percentage: 35.0, growth: 15.2 },
    { region: 'South', predicted: 448000, percentage: 28.0, growth: 18.5 },
    { region: 'North', predicted: 352000, percentage: 22.0, growth: 12.3 },
  ],
  breakdownBySales: [
    { salesName: 'Sales1', predicted: 320000, percentage: 20.0, quota: 300000, attainment: 106.7 },
    { salesName: 'Sales2', predicted: 288000, percentage: 18.0, quota: 300000, attainment: 96.0 },
    { salesName: 'Sales3', predicted: 352000, percentage: 22.0, quota: 300000, attainment: 117.3 },
  ],
};

export const customerSegments: CustomerSegment[] = [
  { id: 'seg1', name: 'High Value', description: 'Recent, Frequent, High Value', color: '#52c41a', count: 45, percentage: 15, characteristics: { recency: 15, frequency: 12, monetary: 250000 }, features: { avgDealSize: 280000, avgCycle: 25, retentionRate: 95, satisfaction: 4.8 } },
  { id: 'seg2', name: 'Potential', description: 'Recent, Medium Frequency', color: '#1890ff', count: 90, percentage: 30, characteristics: { recency: 30, frequency: 6, monetary: 120000 }, features: { avgDealSize: 150000, avgCycle: 35, retentionRate: 85, satisfaction: 4.3 } },
];

export const segmentedCustomers: SegmentedCustomer[] = [
  { id: 'CUST001', name: 'Beijing Tech', segmentId: 'seg1', segmentName: 'High Value', recency: 10, frequency: 15, monetary: 320000, totalValue: 4800000, lastPurchase: '2026-03-03', ownerName: 'Sales1' },
  { id: 'CUST002', name: 'Shanghai Mfg', segmentId: 'seg1', segmentName: 'High Value', recency: 12, frequency: 12, monetary: 280000, totalValue: 3360000, lastPurchase: '2026-03-01', ownerName: 'Sales2' },
];

export const customerScatterData: CustomerScatterPoint[] = [
  { customerId: 'CUST001', customerName: 'Beijing Tech', x: 15, y: 320, size: 25, segmentId: 'seg1', segmentName: 'High Value' },
  { customerId: 'CUST002', customerName: 'Shanghai Mfg', x: 12, y: 280, size: 22, segmentId: 'seg1', segmentName: 'High Value' },
];

export const churnWarnings: ChurnWarning[] = [
  {
    id: 'CHURN001',
    customerId: 'CUST007',
    customerName: 'Wuhan Trade',
    industry: 'Retail',
    ownerName: 'Sales6',
    riskLevel: 'high',
    riskScore: 85,
    riskFactors: [{ type: 'no_followup', label: 'No Followup', severity: 'high', description: '110 days' }],
    aiSuggestions: ['Arrange visit', 'Provide training'],
    lastContactDays: 110,
    contractExpiry: '2026-05-15',
    complaintCount: 1,
    isProcessed: false,
  },
];

export const meetingRecords: MeetingRecord[] = [
  {
    id: 'MEET001',
    title: 'Beijing Tech - Requirements',
    date: '2026-03-12',
    time: '14:00',
    duration: 65,
    participants: [{ id: 'P001', name: 'Sales1', role: 'host', company: 'Us' }, { id: 'P002', name: 'Mr. Ma', role: 'external', company: 'Beijing Tech' }],
    audioUrl: '/mock/audio/meeting001.mp3',
    transcript: 'Sales1: Hello Mr. Ma. What are your pain points?',
    aiSummary: 'Requirements meeting with Beijing Tech. Pain points: sales team management.',
    actionItems: [{ id: 'A001', content: 'Prepare proposal', assignee: 'Sales1', dueDate: '2026-03-19', priority: 'high', status: 'pending' }],
    sentiment: 'positive',
    keywords: ['CRM', 'ERP'],
  },
];