const pptxgen = require('pptxgenjs');
const path = require('path');

const pres = new pptxgen();

// Presentation 16:9 widescreen layout
pres.layout = 'LAYOUT_16x9';
pres.author = 'QUANTORA Team';
pres.company = 'QUANTORA FinTech';
pres.title = 'FinSight – Personal Finance Management & Analytics System';
pres.subject = 'MERN Stack Final Project Submission';

const NAVY_BG = '0B132B';
const CARD_BG = '111C3A';
const BLUE = '2563EB';
const VIOLET = '8B5CF6';
const WHITE = 'FFFFFF';
const SLATE_LIGHT = '94A3B8';
const EMERALD = '10B981';
const ROSE = 'EF4444';

// Helper to add standard slide header
const addSlideHeader = (slide, title, category = 'QUANTORA | FinSight Project Blueprint') => {
  slide.background = { color: NAVY_BG };

  // Category pill
  slide.addText(category.toUpperCase(), {
    x: 0.8,
    y: 0.5,
    w: 8.0,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Arial',
    color: VIOLET,
    bold: true,
  });

  // Title
  slide.addText(title, {
    x: 0.8,
    y: 0.8,
    w: 11.5,
    h: 0.6,
    fontSize: 24,
    fontFace: 'Arial',
    color: WHITE,
    bold: true,
  });

  // Footer bar
  slide.addShape(pres.ShapeType.line, {
    x: 0.8,
    y: 7.0,
    w: 11.7,
    h: 0,
    line: { color: '1E293B', width: 1 },
  });

  slide.addText('FinSight: Personal Finance Management & Analytics System', {
    x: 0.8,
    y: 7.05,
    w: 6.0,
    h: 0.3,
    fontSize: 9,
    fontFace: 'Arial',
    color: SLATE_LIGHT,
  });

  slide.addText('Team: QUANTORA | MERN Stack Full-Stack Web Application', {
    x: 6.8,
    y: 7.05,
    w: 5.7,
    h: 0.3,
    fontSize: 9,
    fontFace: 'Arial',
    color: SLATE_LIGHT,
    align: 'right',
  });
};

// ==========================================
// SLIDE 1: FinSight – Project Title & QUANTORA Team
// ==========================================
const s1 = pres.addSlide();
s1.background = { color: NAVY_BG };

// Accent glow shape
s1.addShape(pres.ShapeType.roundRect, {
  x: 1.0,
  y: 1.0,
  w: 11.3,
  h: 5.3,
  rectRadius: 0.3,
  fill: { color: CARD_BG },
  line: { color: '1E293B', width: 1.5 },
});

s1.addText('FINTECH INNOVATION | MERN FULL STACK', {
  x: 1.5,
  y: 1.5,
  w: 10.0,
  h: 0.4,
  fontSize: 12,
  fontFace: 'Arial',
  color: VIOLET,
  bold: true,
});

s1.addText('FinSight', {
  x: 1.5,
  y: 1.9,
  w: 10.0,
  h: 1.0,
  fontSize: 44,
  fontFace: 'Arial',
  color: WHITE,
  bold: true,
});

s1.addText('Personal Finance Management & Analytics System', {
  x: 1.5,
  y: 2.9,
  w: 10.0,
  h: 0.5,
  fontSize: 20,
  fontFace: 'Arial',
  color: BLUE,
  bold: true,
});

s1.addText('“Track Smart. Spend Wisely. Save Better.”', {
  x: 1.5,
  y: 3.5,
  w: 10.0,
  h: 0.4,
  fontSize: 14,
  fontFace: 'Arial',
  color: SLATE_LIGHT,
  italic: true,
});

// QUANTORA Team Members Cards
s1.addText('PRESENTED BY TEAM QUANTORA (3 MEMBERS):', {
  x: 1.5,
  y: 4.2,
  w: 10.0,
  h: 0.3,
  fontSize: 11,
  fontFace: 'Arial',
  color: WHITE,
  bold: true,
});

const members = [
  { role: 'Member 1', name: 'Frontend Lead', tasks: 'React, Landing, Auth UI, Dashboard' },
  { role: 'Member 2', name: 'Backend Lead', tasks: 'Node.js, Express, JWT, Transactions API' },
  { role: 'Member 3', name: 'Database & QA', tasks: 'MongoDB, Budgets, Goals, Analytics & Tests' },
];

members.forEach((m, idx) => {
  s1.addShape(pres.ShapeType.roundRect, {
    x: 1.5 + idx * 3.5,
    y: 4.6,
    w: 3.2,
    h: 1.3,
    rectRadius: 0.15,
    fill: { color: '0D1527' },
    line: { color: BLUE, width: 1 },
  });

  s1.addText(m.role + ': ' + m.name, {
    x: 1.6 + idx * 3.5,
    y: 4.75,
    w: 3.0,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: WHITE,
    bold: true,
  });

  s1.addText(m.tasks, {
    x: 1.6 + idx * 3.5,
    y: 5.1,
    w: 3.0,
    h: 0.6,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: SLATE_LIGHT,
  });
});

// ==========================================
// SLIDE 2: Introduction & Problem Statement
// ==========================================
const s2 = pres.addSlide();
addSlideHeader(s2, 'Introduction & Problem Statement');

s2.addShape(pres.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 5.6,
  h: 5.0,
  rectRadius: 0.2,
  fill: { color: CARD_BG },
  line: { color: '1E293B', width: 1 },
});

s2.addText('THE PROBLEM STATEMENT', {
  x: 1.1,
  y: 1.9,
  w: 5.0,
  h: 0.4,
  fontSize: 14,
  fontFace: 'Arial',
  color: ROSE,
  bold: true,
});

s2.addText(
  '• Fragmented Personal Finances: Individuals struggle with multiple bank accounts, cash payments, and disjointed budgeting apps.\n\n' +
  '• Unnoticed Overspending: Lack of real-time monthly budget alerts causes users to consistently breach their spending limits.\n\n' +
  '• Vague Financial Visibility: Static spreadsheets fail to provide intuitive visual charts, cash flow velocity, or category breakdowns.\n\n' +
  '• Low Savings Discipline: Goals lack quantifiable deadline tracking and deposit progression, resulting in abandoned savings ambitions.',
  {
    x: 1.1,
    y: 2.4,
    w: 5.0,
    h: 3.8,
    fontSize: 11.5,
    fontFace: 'Arial',
    color: SLATE_LIGHT,
  }
);

s2.addShape(pres.ShapeType.roundRect, {
  x: 6.9,
  y: 1.6,
  w: 5.6,
  h: 5.0,
  rectRadius: 0.2,
  fill: { color: CARD_BG },
  line: { color: '1E293B', width: 1 },
});

s2.addText('THE FINSIGHT SOLUTION', {
  x: 7.2,
  y: 1.9,
  w: 5.0,
  h: 0.4,
  fontSize: 14,
  fontFace: 'Arial',
  color: EMERALD,
  bold: true,
});

s2.addText(
  '• Unified FinTech Hub: Centralizes all inflows and outflows into a synchronized, secure MERN ledger.\n\n' +
  '• Automated Budget Guards: Proactive alert warnings when category spending touches 80% or breaches 100%.\n\n' +
  '• Rich Interactive Analytics: Real-time Recharts bar charts, pie breakdowns, and 6-12 month historical trend lines.\n\n' +
  '• Milestone Goal Management: Track target balances, calculate days remaining, and record fast deposits with progress rings.\n\n' +
  '• Exportable Statements: Instant download of audited CSV statements for tax preparation and auditing.',
  {
    x: 7.2,
    y: 2.4,
    w: 5.0,
    h: 3.8,
    fontSize: 11.5,
    fontFace: 'Arial',
    color: SLATE_LIGHT,
  }
);

// ==========================================
// SLIDE 3: Project Objectives
// ==========================================
const s3 = pres.addSlide();
addSlideHeader(s3, 'Project Objectives');

const objectives = [
  {
    num: '01',
    title: 'User Authentication & Data Isolation',
    desc: 'Implement enterprise-grade JWT token authorization and bcrypt password hashing, ensuring zero cross-tenant data leakage across all database queries.',
  },
  {
    num: '02',
    title: 'Comprehensive Transaction Ledger',
    desc: 'Deliver complete CRUD capabilities for income and expenses with multi-criteria search, category filters, and dynamic date-range scoping.',
  },
  {
    num: '03',
    title: 'Proactive Monthly Budgeting',
    desc: 'Empower users to allocate categorical limits, measure live consumption against caps, and trigger immediate visual and notification alerts upon overspending.',
  },
  {
    num: '04',
    title: 'Interactive Visual Analytics',
    desc: 'Transform raw accounting numbers into interactive Recharts visualizations: Income vs Expenses, category distribution pie charts, and monthly burn trends.',
  },
  {
    num: '05',
    title: 'Goal Milestones & Reports',
    desc: 'Facilitate disciplined savings goal progression towards deadlines and provide 1-click executive financial statements with CSV transaction exports.',
  },
];

objectives.forEach((obj, idx) => {
  const y = 1.6 + idx * 1.0;
  s3.addShape(pres.ShapeType.roundRect, {
    x: 0.8,
    y: y,
    w: 11.7,
    h: 0.88,
    rectRadius: 0.15,
    fill: { color: CARD_BG },
    line: { color: '1E293B', width: 1 },
  });

  s3.addText(obj.num, {
    x: 1.0,
    y: y + 0.15,
    w: 0.8,
    h: 0.5,
    fontSize: 20,
    fontFace: 'Arial',
    color: BLUE,
    bold: true,
  });

  s3.addText(obj.title, {
    x: 1.8,
    y: y + 0.12,
    w: 9.8,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Arial',
    color: WHITE,
    bold: true,
  });

  s3.addText(obj.desc, {
    x: 1.8,
    y: y + 0.42,
    w: 10.3,
    h: 0.4,
    fontSize: 10,
    fontFace: 'Arial',
    color: SLATE_LIGHT,
  });
});

// ==========================================
// SLIDE 4: Technologies Used – MERN Stack
// ==========================================
const s4 = pres.addSlide();
addSlideHeader(s4, 'Technologies Used – MERN Stack');

const techs = [
  { name: 'MongoDB Atlas', cat: 'Database', desc: 'NoSQL document cloud database with Mongoose schemas, compound indexes, and aggregation pipelines.' },
  { name: 'Express.js', cat: 'Backend Framework', desc: 'Lightweight, robust Node.js server framework hosting modular RESTful endpoints with CORS & error middleware.' },
  { name: 'React.js 18', cat: 'Frontend Library', desc: 'Component-driven SPA architecture utilizing React Router DOM v6, hooks, and clean context state management.' },
  { name: 'Node.js', cat: 'Runtime Engine', desc: 'Asynchronous event-driven JavaScript engine running backend server processes and JSON data streams.' },
  { name: 'Tailwind CSS', cat: 'UI Design System', desc: 'Utility-first modern styling matching Dribbble/FinTech design standards with Dark Navy/Light mode support.' },
  { name: 'Recharts', cat: 'Data Visualization', desc: 'Composable, declarative React charting library delivering SVG BarCharts, LineCharts, and PieCharts.' },
  { name: 'JWT & bcryptjs', cat: 'Security & Auth', desc: 'Cryptographic password hashing (salt 10) and JSON Web Tokens for stateless authenticated requests.' },
  { name: 'Axios', cat: 'HTTP Client', desc: 'Promise-based HTTP client equipped with automatic Bearer token interceptors and 401 redirect handling.' },
];

techs.forEach((t, idx) => {
  const col = idx % 4;
  const row = Math.floor(idx / 4);
  const x = 0.8 + col * 3.0;
  const y = 1.6 + row * 2.5;

  s4.addShape(pres.ShapeType.roundRect, {
    x: x,
    y: y,
    w: 2.8,
    h: 2.3,
    rectRadius: 0.2,
    fill: { color: CARD_BG },
    line: { color: '1E293B', width: 1 },
  });

  s4.addText(t.cat.toUpperCase(), {
    x: x + 0.2,
    y: y + 0.2,
    w: 2.4,
    h: 0.25,
    fontSize: 9,
    fontFace: 'Arial',
    color: VIOLET,
    bold: true,
  });

  s4.addText(t.name, {
    x: x + 0.2,
    y: y + 0.5,
    w: 2.4,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    color: WHITE,
    bold: true,
  });

  s4.addText(t.desc, {
    x: x + 0.2,
    y: y + 0.95,
    w: 2.4,
    h: 1.2,
    fontSize: 10,
    fontFace: 'Arial',
    color: SLATE_LIGHT,
  });
});

// ==========================================
// SLIDE 5: System Architecture & Workflow
// ==========================================
const s5 = pres.addSlide();
addSlideHeader(s5, 'System Architecture & Workflow');

const workflowCards = [
  { step: 'CLIENT LAYER (React + Vite)', desc: 'SPA Frontend with 11 distinct routes, Tailwind Dark Navy UI, Recharts interactive charts, and Axios interceptor pipeline.' },
  { step: 'AUTH & SECURITY LAYER', desc: 'Bearer JWT token authorization, bcrypt password hashing, and user identity session verification middleware.' },
  { step: 'REST CONTROLLER LAYER', desc: 'Express controllers handling Transaction, Budget, Goals, Categories, and Analytics aggregation requests.' },
  { step: 'DATABASE PERSISTENCE', desc: 'MongoDB Atlas / Mongoose ODM with user-isolated queries, compound indexes, and mathematical pipeline aggregations.' },
];

workflowCards.forEach((c, idx) => {
  const x = 0.8 + idx * 3.0;
  s5.addShape(pres.ShapeType.roundRect, {
    x: x,
    y: 1.8,
    w: 2.8,
    h: 3.5,
    rectRadius: 0.2,
    fill: { color: CARD_BG },
    line: { color: idx === 0 ? BLUE : idx === 3 ? EMERALD : '1E293B', width: 1.5 },
  });

  s5.addText(`LAYER 0${idx + 1}`, {
    x: x + 0.2,
    y: 2.1,
    w: 2.4,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: VIOLET,
    bold: true,
  });

  s5.addText(c.step, {
    x: x + 0.2,
    y: 2.5,
    w: 2.4,
    h: 0.6,
    fontSize: 12,
    fontFace: 'Arial',
    color: WHITE,
    bold: true,
  });

  s5.addText(c.desc, {
    x: x + 0.2,
    y: 3.2,
    w: 2.4,
    h: 1.8,
    fontSize: 10.5,
    fontFace: 'Arial',
    color: SLATE_LIGHT,
  });
});

s5.addShape(pres.ShapeType.roundRect, {
  x: 0.8,
  y: 5.6,
  w: 11.7,
  h: 1.0,
  rectRadius: 0.15,
  fill: { color: '0D1527' },
  line: { color: '1E293B', width: 1 },
});

s5.addText('END-TO-END DATA FLOW: User interacts with React UI -> Axios dispatches HTTP with JWT Bearer Token -> Express verifies auth middleware -> Controller executes Mongoose queries scoped by userId -> MongoDB calculates aggregates -> JSON formatted payload delivered to Recharts components.', {
  x: 1.1,
  y: 5.75,
  w: 11.1,
  h: 0.7,
  fontSize: 10.5,
  fontFace: 'Arial',
  color: WHITE,
});

// ==========================================
// SLIDE 6: Features & Functionalities
// ==========================================
const s6 = pres.addSlide();
addSlideHeader(s6, 'Features & Functionalities (7 Core Modules)');

const modulesList = [
  { num: 'M1', name: 'User Authentication', items: '• Register, login, logout\n• bcrypt password hashing\n• JWT Bearer auth\n• Protected routes' },
  { num: 'M2', name: 'Live Dashboard', items: '• Total Balance, Income, Expenses\n• Net savings & growth rates\n• Recent transactions ledger\n• Budget progress bars' },
  { num: 'M3', name: 'Transaction Management', items: '• Inflow / Outflow logging\n• Instant edit & delete modals\n• Multi-keyword search\n• Type & category filtering' },
  { num: 'M4', name: 'Budget Management', items: '• Monthly expense category caps\n• Live percentage burn tracking\n• 80% caution alerts\n• Overspending warnings' },
  { num: 'M5', name: 'Financial Analytics', items: '• Income vs Expense BarChart\n• Category distribution PieChart\n• Monthly spending LineChart\n• 6 & 12 mo timeframes' },
  { num: 'M6', name: 'Savings Goals', items: '• Milestone target setting\n• Fast deposit tracking\n• Percentage completion rings\n• Days-to-deadline metrics' },
  { num: 'M7', name: 'Reports & Export', items: '• Monthly statements\n• Category itemization\n• Instant CSV data download\n• Formatted print views' },
];

modulesList.forEach((m, idx) => {
  const col = idx % 4;
  const row = Math.floor(idx / 4);
  const x = 0.8 + col * 3.0;
  const y = 1.6 + row * 2.5;

  s6.addShape(pres.ShapeType.roundRect, {
    x: x,
    y: y,
    w: 2.8,
    h: 2.3,
    rectRadius: 0.2,
    fill: { color: CARD_BG },
    line: { color: '1E293B', width: 1 },
  });

  s6.addText(m.num + ': ' + m.name, {
    x: x + 0.15,
    y: y + 0.15,
    w: 2.5,
    h: 0.45,
    fontSize: 11,
    fontFace: 'Arial',
    color: WHITE,
    bold: true,
  });

  s6.addText(m.items, {
    x: x + 0.15,
    y: y + 0.65,
    w: 2.5,
    h: 1.5,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: SLATE_LIGHT,
  });
});

// ==========================================
// SLIDE 7: Database Design & API Integration
// ==========================================
const s7 = pres.addSlide();
addSlideHeader(s7, 'Database Design & API Integration');

s7.addShape(pres.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 5.6,
  h: 5.0,
  rectRadius: 0.2,
  fill: { color: CARD_BG },
  line: { color: '1E293B', width: 1 },
});

s7.addText('5 MONGODB COLLECTIONS', {
  x: 1.1,
  y: 1.8,
  w: 5.0,
  h: 0.35,
  fontSize: 13,
  fontFace: 'Arial',
  color: BLUE,
  bold: true,
});

s7.addText(
  '• Users:\n  { name: String, email: String, password: String, createdAt: Date }\n\n' +
  '• Transactions:\n  { userId: ObjectId, title: String, amount: Number, type: "income" | "expense", category: String, paymentMethod: String, date: Date, description: String }\n\n' +
  '• Budgets:\n  { userId: ObjectId, category: String, amount: Number, month: Number, year: Number }\n\n' +
  '• SavingsGoals:\n  { userId: ObjectId, title: String, targetAmount: Number, savedAmount: Number, deadline: Date }\n\n' +
  '• Categories:\n  { userId: ObjectId, name: String, type: String }',
  {
    x: 1.1,
    y: 2.2,
    w: 5.0,
    h: 4.2,
    fontSize: 9.5,
    fontFace: 'Courier New',
    color: SLATE_LIGHT,
  }
);

s7.addShape(pres.ShapeType.roundRect, {
  x: 6.9,
  y: 1.6,
  w: 5.6,
  h: 5.0,
  rectRadius: 0.2,
  fill: { color: CARD_BG },
  line: { color: '1E293B', width: 1 },
});

s7.addText('19 TESTED REST ENDPOINTS', {
  x: 7.2,
  y: 1.8,
  w: 5.0,
  h: 0.35,
  fontSize: 13,
  fontFace: 'Arial',
  color: EMERALD,
  bold: true,
});

s7.addText(
  'POST /api/auth/register    -> User account creation\n' +
  'POST /api/auth/login       -> JWT token issuance\n' +
  'GET  /api/auth/me          -> Authenticated profile\n' +
  'GET  /api/transactions     -> Filtered ledger list\n' +
  'POST /api/transactions     -> Record transaction\n' +
  'PUT  /api/transactions/:id -> Edit record\n' +
  'DEL  /api/transactions/:id -> Remove record\n' +
  'GET  /api/budgets          -> Budgets & burn rate\n' +
  'POST /api/budgets          -> Set category budget\n' +
  'PUT  /api/budgets/:id      -> Adjust spending cap\n' +
  'DEL  /api/budgets/:id      -> Delete budget\n' +
  'GET  /api/goals            -> Goals with % completion\n' +
  'POST /api/goals            -> Create target goal\n' +
  'PUT  /api/goals/:id        -> Add funds & update\n' +
  'DEL  /api/goals/:id        -> Delete savings goal\n' +
  'GET  /api/analytics/summary-> Executive KPI cards\n' +
  'GET  /api/analytics/monthly-> 6-12 mo trend data\n' +
  'GET  /api/analytics/categories -> Category breakdown',
  {
    x: 7.2,
    y: 2.2,
    w: 5.0,
    h: 4.2,
    fontSize: 9.5,
    fontFace: 'Courier New',
    color: WHITE,
  }
);

// ==========================================
// SLIDE 8: Project Screenshots
// ==========================================
const s8 = pres.addSlide();
addSlideHeader(s8, 'Project Screenshots & UI Highlights');

const screens = [
  { name: 'Executive Dashboard (/dashboard)', desc: 'Welcome banner, live financial KPI cards, Recharts Income vs Expense bar chart, category pie chart, recent transactions, and goal bars.' },
  { name: 'Transaction Management (/transactions)', desc: 'Multi-criteria search engine, type & category dropdown filters, date-range calendar pickers, amount sort order, and instant modal edit.' },
  { name: 'Budget Control (/budgets)', desc: 'Visual month selector, categorical spending limit cards, live burn bars, 80% caution alerts, and prominent overspending warning banners.' },
  { name: 'Analytics & Reports (/analytics, /reports)', desc: 'Historical line charts, savings trajectory curves, print-ready monthly reconciliation statements, and 1-click CSV data export.' },
];

screens.forEach((sc, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 6.0;
  const y = 1.6 + row * 2.5;

  s8.addShape(pres.ShapeType.roundRect, {
    x: x,
    y: y,
    w: 5.7,
    h: 2.3,
    rectRadius: 0.2,
    fill: { color: CARD_BG },
    line: { color: '1E293B', width: 1 },
  });

  s8.addText(sc.name, {
    x: x + 0.3,
    y: y + 0.2,
    w: 5.1,
    h: 0.4,
    fontSize: 13,
    fontFace: 'Arial',
    color: BLUE,
    bold: true,
  });

  s8.addText(sc.desc, {
    x: x + 0.3,
    y: y + 0.7,
    w: 5.1,
    h: 1.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: SLATE_LIGHT,
  });
});

// ==========================================
// SLIDE 9: Challenges Faced & Future Scope
// ==========================================
const s9 = pres.addSlide();
addSlideHeader(s9, 'Challenges Faced & Future Scope');

s9.addShape(pres.ShapeType.roundRect, {
  x: 0.8,
  y: 1.6,
  w: 5.6,
  h: 5.0,
  rectRadius: 0.2,
  fill: { color: CARD_BG },
  line: { color: '1E293B', width: 1 },
});

s9.addText('CHALLENGES OVERCOME', {
  x: 1.1,
  y: 1.9,
  w: 5.0,
  h: 0.4,
  fontSize: 14,
  fontFace: 'Arial',
  color: VIOLET,
  bold: true,
});

s9.addText(
  '• Strict Multi-Tenant Data Isolation:\n  Engineered Mongoose middleware to mandate userId scoping on 100% of queries, preventing data leakage.\n\n' +
  '• Dynamic Budget Reconciliation:\n  Built multi-stage MongoDB aggregation pipelines to cross-reference transactions against active monthly budget records.\n\n' +
  '• Recharts Mobile Responsiveness:\n  Implemented custom responsive containers and tooltip formatters ensuring clean presentation across all screen resolutions.\n\n' +
  '• Offline Dev & Atlas Cloud Resilience:\n  Developed a zero-downtime dual-mode database layer enabling seamless testing offline as well as on MongoDB Atlas.',
  {
    x: 1.1,
    y: 2.4,
    w: 5.0,
    h: 3.8,
    fontSize: 10.5,
    fontFace: 'Arial',
    color: SLATE_LIGHT,
  }
);

s9.addShape(pres.ShapeType.roundRect, {
  x: 6.9,
  y: 1.6,
  w: 5.6,
  h: 5.0,
  rectRadius: 0.2,
  fill: { color: CARD_BG },
  line: { color: '1E293B', width: 1 },
});

s9.addText('FUTURE SCOPE (POST-SUBMISSION)', {
  x: 7.2,
  y: 1.9,
  w: 5.0,
  h: 0.4,
  fontSize: 14,
  fontFace: 'Arial',
  color: BLUE,
  bold: true,
});

s9.addText(
  '• AI-Powered Predictive Cash Flow:\n  Integrate Python machine learning models to forecast upcoming month expense spikes based on historical patterns.\n\n' +
  '• Open Banking / Plaid Integration:\n  Direct synchronization with bank feeds for automated transaction importing and real-time reconciliation.\n\n' +
  '• Receipt OCR Scanning:\n  Computer vision to scan physical receipts and auto-populate title, amount, date, and tax categories.\n\n' +
  '• Multi-Currency Conversion:\n  Real-time foreign exchange API rates for travelers and international wealth management.',
  {
    x: 7.2,
    y: 2.4,
    w: 5.0,
    h: 3.8,
    fontSize: 10.5,
    fontFace: 'Arial',
    color: SLATE_LIGHT,
  }
);

// ==========================================
// SLIDE 10: Conclusion
// ==========================================
const s10 = pres.addSlide();
addSlideHeader(s10, 'Conclusion');

s10.addShape(pres.ShapeType.roundRect, {
  x: 1.0,
  y: 1.6,
  w: 11.3,
  h: 5.0,
  rectRadius: 0.3,
  fill: { color: CARD_BG },
  line: { color: BLUE, width: 1.5 },
});

s10.addText('FinSight – Summary of Achievements', {
  x: 1.5,
  y: 2.0,
  w: 10.0,
  h: 0.5,
  fontSize: 22,
  fontFace: 'Arial',
  color: WHITE,
  bold: true,
});

s10.addText(
  '✓ 100% Scope Completion: All 7 modules delivered strictly adhering to the QUANTORA blueprint.\n' +
  '✓ Pure MERN Stack Architecture: Clean MongoDB, Express.js, React.js, and Node.js implementation.\n' +
  '✓ Verified API Suite: 19 REST endpoints thoroughly tested with 100% pass rate.\n' +
  '✓ Production-Ready UI: Responsive Dribbble-inspired Dark Navy and Light theme interfaces.\n' +
  '✓ Ready for Evaluation: Pre-seeded with 6 months of realistic transactions for instant grading.\n' +
  '✓ Seamless Cloud Deployment: Pre-configured for zero-downtime deployment on Vercel and Render.',
  {
    x: 1.5,
    y: 2.7,
    w: 10.0,
    h: 2.4,
    fontSize: 12.5,
    fontFace: 'Arial',
    color: SLATE_LIGHT,
  }
);

s10.addText('“Track Smart. Spend Wisely. Save Better.”', {
  x: 1.5,
  y: 5.3,
  w: 10.0,
  h: 0.4,
  fontSize: 16,
  fontFace: 'Arial',
  color: VIOLET,
  bold: true,
  italic: true,
});

s10.addText('Thank You! | Questions & Evaluation Discussion', {
  x: 1.5,
  y: 5.8,
  w: 10.0,
  h: 0.4,
  fontSize: 14,
  fontFace: 'Arial',
  color: WHITE,
  bold: true,
});

// Save Presentation
const outputPath = path.join(__dirname, 'FinSight.pptx');
pres.writeFile({ fileName: outputPath })
  .then((fileName) => {
    console.log(`✅ PowerPoint successfully generated: ${fileName}`);
  })
  .catch((err) => {
    console.error('❌ Error generating PPTX:', err);
    process.exit(1);
  });
