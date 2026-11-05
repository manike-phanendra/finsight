const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');

// @desc    Get dashboard summary data
// @route   GET /api/analytics/summary
// @access  Private
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // 1. Overall Lifetime Aggregation
    const lifetimeAgg = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;
    lifetimeAgg.forEach(item => {
      if (item._id === 'income') totalIncome = item.total;
      if (item._id === 'expense') totalExpenses = item.total;
    });

    const totalBalance = totalIncome - totalExpenses;
    const netSavings = Math.max(0, totalBalance);
    const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)) : 0;

    // 2. Current Month Aggregation
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const currentMonthAgg = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let thisMonthIncome = 0;
    let thisMonthExpenses = 0;
    currentMonthAgg.forEach(item => {
      if (item._id === 'income') thisMonthIncome = item.total;
      if (item._id === 'expense') thisMonthExpenses = item.total;
    });

    // 3. Previous Month for Growth Comparison
    const startOfPrevMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfPrevMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const prevMonthAgg = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let prevMonthIncome = 0;
    let prevMonthExpenses = 0;
    prevMonthAgg.forEach(item => {
      if (item._id === 'income') prevMonthIncome = item.total;
      if (item._id === 'expense') prevMonthExpenses = item.total;
    });

    const incomeGrowth = prevMonthIncome > 0
      ? Math.round(((thisMonthIncome - prevMonthIncome) / prevMonthIncome) * 100)
      : thisMonthIncome > 0 ? 100 : 0;

    const expenseGrowth = prevMonthExpenses > 0
      ? Math.round(((thisMonthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100)
      : thisMonthExpenses > 0 ? 100 : 0;

    // 4. Recent Transactions (latest 5)
    const recentTransactions = await Transaction.find({ userId })
      .sort({ date: -1, _id: -1 })
      .limit(5);

    // 5. Active Savings Goals summary
    const goals = await SavingsGoal.find({ userId }).sort({ deadline: 1 }).limit(3);
    const totalGoalSaved = goals.reduce((acc, g) => acc + (g.savedAmount || 0), 0);
    const totalGoalTarget = goals.reduce((acc, g) => acc + (g.targetAmount || 0), 0);

    // 6. Active Budgets summary for current month
    const budgets = await Budget.find({
      userId,
      month: currentMonth + 1,
      year: currentYear,
    });

    // Match expenses for this month to calculate budget usage
    const monthlyCategoryExpenses = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' },
        },
      },
    ]);

    const catExpenseMap = {};
    monthlyCategoryExpenses.forEach(c => {
      catExpenseMap[c._id.toLowerCase()] = c.spent;
    });

    const budgetProgressList = budgets.map(b => {
      const spent = catExpenseMap[b.category.toLowerCase()] || 0;
      const pct = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
      return {
        _id: b._id,
        category: b.category,
        amount: b.amount,
        spentAmount: spent,
        percentage: pct,
        isOverBudget: spent > b.amount,
      };
    });

    res.json({
      success: true,
      data: {
        financialCards: {
          totalBalance,
          totalIncome,
          totalExpenses,
          totalSavings: netSavings,
          savingsRate,
          thisMonthIncome,
          thisMonthExpenses,
          thisMonthBalance: thisMonthIncome - thisMonthExpenses,
          incomeGrowth,
          expenseGrowth,
        },
        recentTransactions,
        budgetProgress: budgetProgressList,
        savingsGoals: goals.map(g => ({
          _id: g._id,
          title: g.title,
          targetAmount: g.targetAmount,
          savedAmount: g.savedAmount,
          percentage: Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100)),
          deadline: g.deadline,
        })),
        goalsSummary: {
          totalSaved: totalGoalSaved,
          totalTarget: totalGoalTarget,
        },
      },
    });
  } catch (error) {
    console.error('getSummary error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving summary.', error: error.message });
  }
};

// @desc    Get monthly analytics (income vs expense vs savings over last 6-12 months)
// @route   GET /api/analytics/monthly
// @access  Private
exports.getMonthlyAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;
    const monthsCount = parseInt(req.query.months) || 6;
    const now = new Date();

    const monthlyData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      const agg = await Transaction.aggregate([
        {
          $match: {
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
          },
        },
      ]);

      let income = 0;
      let expense = 0;
      agg.forEach(item => {
        if (item._id === 'income') income = item.total;
        if (item._id === 'expense') expense = item.total;
      });

      const savings = Math.max(0, income - expense);
      monthlyData.push({
        month: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`,
        fullMonth: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
        income,
        expense,
        savings,
        net: income - expense,
      });
    }

    res.json({
      success: true,
      monthsCount,
      data: monthlyData,
    });
  } catch (error) {
    console.error('getMonthlyAnalysis error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving monthly analytics.', error: error.message });
  }
};

// @desc    Get expense breakdown by category (for pie chart & distribution)
// @route   GET /api/analytics/categories
// @access  Private
exports.getCategoryAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type = 'expense', startDate, endDate, month, year } = req.query;

    const query = { userId, type };

    if (month && year) {
      const m = parseInt(month);
      const y = parseInt(year);
      query.date = {
        $gte: new Date(y, m - 1, 1),
        $lte: new Date(y, m, 0, 23, 59, 59, 999),
      };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const categoryAgg = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    const overallTotal = categoryAgg.reduce((acc, curr) => acc + curr.totalAmount, 0);

    const colors = [
      '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
      '#06B6D4', '#EC4899', '#84CC16', '#6366F1', '#14B8A6'
    ];

    const data = categoryAgg.map((cat, index) => ({
      name: cat._id,
      amount: cat.totalAmount,
      count: cat.count,
      percentage: overallTotal > 0 ? Math.round((cat.totalAmount / overallTotal) * 100) : 0,
      color: colors[index % colors.length],
    }));

    res.json({
      success: true,
      totalAmount: overallTotal,
      data,
    });
  } catch (error) {
    console.error('getCategoryAnalysis error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving category analytics.', error: error.message });
  }
};
