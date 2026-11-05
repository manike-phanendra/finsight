const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');
const Category = require('../models/Category');

const seedDemoUserAndData = async () => {
  try {
    const demoEmail = 'demo@finsight.quantora.com';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      console.log('[Seed] Creating demo user: demo@finsight.quantora.com ...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('FinSight123!', salt);

      user = await User.create({
        name: 'Alex Morgan',
        email: demoEmail,
        password: hashedPassword,
      });
    }

    const transactionCount = await Transaction.countDocuments({ userId: user._id });
    if (transactionCount === 0) {
      console.log('[Seed] Populating realistic financial transactions for demo user...');
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      // Seed categories
      const categoriesData = [
        { name: 'Salary', type: 'income' },
        { name: 'Freelance', type: 'income' },
        { name: 'Investments', type: 'income' },
        { name: 'Food & Dining', type: 'expense' },
        { name: 'Rent & Housing', type: 'expense' },
        { name: 'Utilities', type: 'expense' },
        { name: 'Transportation', type: 'expense' },
        { name: 'Entertainment', type: 'expense' },
        { name: 'Shopping', type: 'expense' },
        { name: 'Healthcare', type: 'expense' },
      ];

      for (const cat of categoriesData) {
        await Category.findOneAndUpdate(
          { userId: user._id, name: cat.name, type: cat.type },
          { userId: user._id, name: cat.name, type: cat.type },
          { upsert: true }
        );
      }

      // Generate 6 months of historical transactions
      const sampleTransactions = [];

      for (let i = 5; i >= 0; i--) {
        const m = currentMonth - i;
        const d = new Date(currentYear, m, 1);
        const y = d.getFullYear();
        const mon = d.getMonth();

        // Monthly salary
        sampleTransactions.push({
          userId: user._id,
          title: 'Monthly Tech Salary',
          amount: 5400,
          type: 'income',
          category: 'Salary',
          paymentMethod: 'Bank Transfer',
          date: new Date(y, mon, 1, 9, 0),
          description: 'Full-time software engineering salary direct deposit',
        });

        // Freelance consulting
        sampleTransactions.push({
          userId: user._id,
          title: 'UI/UX Design Consulting',
          amount: 850 + (i * 50),
          type: 'income',
          category: 'Freelance',
          paymentMethod: 'Stripe',
          date: new Date(y, mon, 14, 16, 30),
          description: 'Client dashboard design sprint delivery',
        });

        // Rent
        sampleTransactions.push({
          userId: user._id,
          title: 'Apartment Monthly Rent',
          amount: 1450,
          type: 'expense',
          category: 'Rent & Housing',
          paymentMethod: 'Bank Transfer',
          date: new Date(y, mon, 2, 10, 0),
          description: '2-Bedroom downtown apartment rental',
        });

        // Utilities
        sampleTransactions.push({
          userId: user._id,
          title: 'High-speed Fiber & Electric',
          amount: 180 + (i * 10),
          type: 'expense',
          category: 'Utilities',
          paymentMethod: 'Card',
          date: new Date(y, mon, 8, 11, 15),
          description: 'Electric bill and gigabit internet connection',
        });

        // Groceries & Food
        sampleTransactions.push({
          userId: user._id,
          title: 'Organic Supermarket Groceries',
          amount: 320 + (i * 15),
          type: 'expense',
          category: 'Food & Dining',
          paymentMethod: 'Card',
          date: new Date(y, mon, 10, 14, 20),
          description: 'Weekly organic groceries and pantry restock',
        });

        sampleTransactions.push({
          userId: user._id,
          title: 'Bistro & Specialty Coffee',
          amount: 110 + (i * 8),
          type: 'expense',
          category: 'Food & Dining',
          paymentMethod: 'Card',
          date: new Date(y, mon, 19, 13, 0),
          description: 'Team lunches and weekend artisan bakery',
        });

        // Transport
        sampleTransactions.push({
          userId: user._id,
          title: 'Metro Pass & Rideshare',
          amount: 140,
          type: 'expense',
          category: 'Transportation',
          paymentMethod: 'Card',
          date: new Date(y, mon, 12, 8, 45),
          description: 'Monthly unlimited transit card and Uber trips',
        });

        // Entertainment & Streaming
        sampleTransactions.push({
          userId: user._id,
          title: 'Streaming & Concert Tickets',
          amount: 95,
          type: 'expense',
          category: 'Entertainment',
          paymentMethod: 'Card',
          date: new Date(y, mon, 22, 20, 0),
          description: 'Netflix, Spotify & live music performance',
        });
      }

      // Add recent transactions for current month
      sampleTransactions.push({
        userId: user._id,
        title: 'Dividend Payout - Index Fund',
        amount: 220,
        type: 'income',
        category: 'Investments',
        paymentMethod: 'Bank Transfer',
        date: new Date(currentYear, currentMonth, 3, 11, 0),
        description: 'Quarterly dividend distribution from S&P index',
      });

      sampleTransactions.push({
        userId: user._id,
        title: 'New Noise-Cancelling Headphones',
        amount: 280,
        type: 'expense',
        category: 'Shopping',
        paymentMethod: 'Card',
        date: new Date(currentYear, currentMonth, 4, 15, 30),
        description: 'Sony WH-1000XM5 headphones purchase',
      });

      await Transaction.insertMany(sampleTransactions);

      // Seed monthly budgets for current month
      const currentMonthNum = currentMonth + 1;
      const sampleBudgets = [
        {
          userId: user._id,
          category: 'Food & Dining',
          amount: 550,
          month: currentMonthNum,
          year: currentYear,
        },
        {
          userId: user._id,
          category: 'Rent & Housing',
          amount: 1500,
          month: currentMonthNum,
          year: currentYear,
        },
        {
          userId: user._id,
          category: 'Transportation',
          amount: 200,
          month: currentMonthNum,
          year: currentYear,
        },
        {
          userId: user._id,
          category: 'Entertainment',
          amount: 150,
          month: currentMonthNum,
          year: currentYear,
        },
        {
          userId: user._id,
          category: 'Shopping',
          amount: 250, // Note: $280 spent will trigger the overspending alert!
          month: currentMonthNum,
          year: currentYear,
        },
        {
          userId: user._id,
          category: 'Utilities',
          amount: 220,
          month: currentMonthNum,
          year: currentYear,
        },
      ];

      for (const b of sampleBudgets) {
        await Budget.findOneAndUpdate(
          { userId: b.userId, category: b.category, month: b.month, year: b.year },
          b,
          { upsert: true }
        );
      }

      // Seed Savings Goals
      const sampleGoals = [
        {
          userId: user._id,
          title: 'Emergency Safety Reserve',
          targetAmount: 10000,
          savedAmount: 7200,
          deadline: new Date(currentYear, 11, 31),
        },
        {
          userId: user._id,
          title: 'Japan Autumn Vacation',
          targetAmount: 3500,
          savedAmount: 2450,
          deadline: new Date(currentYear, 9, 15),
        },
        {
          userId: user._id,
          title: 'MacBook Pro M4 Workstation',
          targetAmount: 2200,
          savedAmount: 1650,
          deadline: new Date(currentYear, 7, 30),
        },
        {
          userId: user._id,
          title: 'Tech Certification & Training',
          targetAmount: 800,
          savedAmount: 800, // Completed goal demo
          deadline: new Date(currentYear, 5, 1),
        },
      ];

      for (const g of sampleGoals) {
        await SavingsGoal.findOneAndUpdate(
          { userId: g.userId, title: g.title },
          g,
          { upsert: true }
        );
      }

      console.log('[Seed] Demo data seeding completed successfully!');
    }
  } catch (error) {
    console.error('[Seed] Error seeding demo data:', error);
  }
};

module.exports = { seedDemoUserAndData };
