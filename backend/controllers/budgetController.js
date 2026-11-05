const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Get all budgets with usage analytics
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res) => {
  try {
    const currentDate = new Date();
    const queryMonth = req.query.month ? parseInt(req.query.month) : currentDate.getMonth() + 1;
    const queryYear = req.query.year ? parseInt(req.query.year) : currentDate.getFullYear();

    const query = { userId: req.user._id };
    if (req.query.all !== 'true') {
      query.month = queryMonth;
      query.year = queryYear;
    }

    const budgets = await Budget.find(query).sort({ category: 1 });

    // Calculate actual expenses for each category in the specified month/year
    const startOfMonth = new Date(queryYear, queryMonth - 1, 1);
    const endOfMonth = new Date(queryYear, queryMonth, 0, 23, 59, 59, 999);

    const expenseAgg = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
        },
      },
    ]);

    const spentMap = {};
    expenseAgg.forEach(item => {
      spentMap[item._id.toLowerCase()] = item.totalSpent;
    });

    const enrichedBudgets = budgets.map(b => {
      const spent = spentMap[b.category.toLowerCase()] || 0;
      const percentage = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
      const remaining = Math.max(0, b.amount - spent);
      const isOverBudget = spent > b.amount;
      const isWarning = percentage >= 80 && !isOverBudget;

      return {
        _id: b._id,
        userId: b.userId,
        category: b.category,
        amount: b.amount,
        month: b.month,
        year: b.year,
        spentAmount: spent,
        remainingAmount: remaining,
        percentage,
        isOverBudget,
        isWarning,
      };
    });

    // Calculate overall budget summary
    const totalBudgeted = enrichedBudgets.reduce((acc, curr) => acc + curr.amount, 0);
    const totalSpentInBudgets = enrichedBudgets.reduce((acc, curr) => acc + curr.spentAmount, 0);

    res.json({
      success: true,
      month: queryMonth,
      year: queryYear,
      totalBudgeted,
      totalSpentInBudgets,
      overallPercentage: totalBudgeted > 0 ? Math.round((totalSpentInBudgets / totalBudgeted) * 100) : 0,
      budgets: enrichedBudgets,
    });
  } catch (error) {
    console.error('getBudgets error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving budgets.', error: error.message });
  }
};

// @desc    Create or update a budget
// @route   POST /api/budgets
// @access  Private
exports.createBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || amount === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide category and amount.' });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a non-negative number.' });
    }

    const currentDate = new Date();
    const budgetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const budgetYear = year ? parseInt(year) : currentDate.getFullYear();

    // Check if budget for this category, month, and year already exists
    let budget = await Budget.findOne({
      userId: req.user._id,
      category: category.trim(),
      month: budgetMonth,
      year: budgetYear,
    });

    if (budget) {
      budget.amount = numAmount;
      await budget.save();
      return res.json({
        success: true,
        message: 'Budget limit updated for category.',
        budget,
      });
    }

    budget = await Budget.create({
      userId: req.user._id,
      category: category.trim(),
      amount: numAmount,
      month: budgetMonth,
      year: budgetYear,
    });

    res.status(201).json({
      success: true,
      message: 'Monthly budget created successfully.',
      budget,
    });
  } catch (error) {
    console.error('createBudget error:', error);
    res.status(500).json({ success: false, message: 'Server error creating budget.', error: error.message });
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, month, year } = req.body;

    let budget = await Budget.findOne({ _id: id, userId: req.user._id });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found or unauthorized.' });
    }

    if (category !== undefined) budget.category = category.trim();
    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount < 0) {
        return res.status(400).json({ success: false, message: 'Amount must be a non-negative number.' });
      }
      budget.amount = numAmount;
    }
    if (month !== undefined) budget.month = parseInt(month);
    if (year !== undefined) budget.year = parseInt(year);

    await budget.save();

    res.json({
      success: true,
      message: 'Budget updated successfully.',
      budget,
    });
  } catch (error) {
    console.error('updateBudget error:', error);
    res.status(500).json({ success: false, message: 'Server error updating budget.', error: error.message });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found or unauthorized.' });
    }

    res.json({
      success: true,
      message: 'Budget deleted successfully.',
      id,
    });
  } catch (error) {
    console.error('deleteBudget error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting budget.', error: error.message });
  }
};
