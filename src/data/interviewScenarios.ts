import { InterviewScenario } from '../types';

export const INTERVIEW_SCENARIOS: InterviewScenario[] = [
  {
    id: 'system-design-chat',
    title: 'Google System Design: Real-time Chat & Notification Infrastructure',
    company: 'Google',
    role: 'Staff / Senior Software Engineer',
    category: 'System Design',
    questions: [
      {
        questionText: "How would you design a global real-time chat application with 100 million daily active users, support for message delivery receipts, offline messaging, and end-to-end encryption?",
        sampleContext: "Targeting 99.99% availability, sub-100ms message delivery latency globally.",
        audioText: "Design a global real-time chat application for 100 million daily active users. Explain your web socket gateway, message storage tier, and how you handle offline sync and delivery receipts."
      },
      {
        questionText: "How do you handle database write bottlenecks when millions of users send messages simultaneously during peak events?",
        sampleContext: "Sharding strategy, Cassandra/ScyllaDB vs DynamoDB, write-ahead logs.",
        audioText: "When millions of users send messages simultaneously, your primary database faces immense write IOPS. How do you partition the database and buffer writes?"
      }
    ]
  },
  {
    id: 'amazon-behavioral-leadership',
    title: 'Amazon Behavioral: Customer Obsession & Bias for Action',
    company: 'Amazon',
    role: 'Senior Product Manager / SDE',
    category: 'Behavioral',
    questions: [
      {
        questionText: "Tell me about a time when you had to make a high-stakes technical decision with incomplete data under tight deadlines.",
        sampleContext: "Focusing on Amazon Leadership Principles: Bias for Action & Have Backbone; Disagree and Commit.",
        audioText: "Tell me about a time when you had to make a critical technical or product decision with incomplete data under a tight deadline. What trade-offs did you make?"
      },
      {
        questionText: "Describe a situation where a project failed or missed its key metrics. What went wrong and what did you learn?",
        sampleContext: "Ownership, Earn Trust, Root Cause Analysis.",
        audioText: "Give me an example of a project that missed its target deliverables or launched with severe bugs. How did you handle the aftermath and prevent recurrence?"
      }
    ]
  },
  {
    id: 'meta-frontend-react',
    title: 'Meta Senior Frontend: High Performance Feed & State Architecture',
    company: 'Meta',
    role: 'Senior Frontend Engineer',
    category: 'Coding',
    questions: [
      {
        questionText: "How would you optimize a infinite scroll news feed in React to maintain 60 FPS scrolling while rendering complex media cards?",
        sampleContext: "Virtualization (windowing), DOM recycling, image lazy loading, requestIdleCallback.",
        audioText: "In React, how do you prevent jank and maintain 60 frames per second when rendering an endless scrolling feed with heavy video and image cards?"
      },
      {
        questionText: "How do you avoid state synchronization issues and unnecessary re-renders in a complex React application with real-time WebSocket updates?",
        sampleContext: "Custom state management, selector memoization, immutable data patterns.",
        audioText: "When receiving 50 WebSocket updates per second in a React app, how do you prevent the UI from re-rendering the entire component tree?"
      }
    ]
  },
  {
    id: 'product-strategy-growth',
    title: 'Stripe Product Manager: Product Strategy & API Expansion',
    company: 'Stripe',
    role: 'Lead Product Manager',
    category: 'Product Strategy',
    questions: [
      {
        questionText: "If you were PM for Stripe Connect, how would you prioritize expanding into emerging markets with local payment methods?",
        sampleContext: "Market sizing, developer experience, compliance/fraud risk, TAM vs implementation effort.",
        audioText: "How would you evaluate and prioritize adding 10 new local payment methods across Southeast Asia for Stripe Connect platform sellers?"
      }
    ]
  }
];
