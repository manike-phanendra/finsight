const SavingsGoal = require('../models/SavingsGoal');

// @desc    Get all savings goals with progress calculations
// @route   GET /api/goals
// @access  Private
exports.getGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user._id }).sort({ deadline: 1 });

    const now = new Date();
    const enrichedGoals = goals.map(g => {
      const target = g.targetAmount || 1;
      const saved = g.savedAmount || 0;
      const progressPercentage = Math.min(100, Math.round((saved / target) * 100));
      const remainingAmount = Math.max(0, target - saved);
      const isCompleted = saved >= target;

      const deadlineDate = new Date(g.deadline);
      const diffTime = deadlineDate - now;
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        _id: g._id,
        userId: g.userId,
        title: g.title,
        targetAmount: g.targetAmount,
        savedAmount: g.savedAmount,
        deadline: g.deadline,
        progressPercentage,
        remainingAmount,
        isCompleted,
        daysRemaining,
      };
    });

    const totalTarget = enrichedGoals.reduce((acc, g) => acc + g.targetAmount, 0);
    const totalSaved = enrichedGoals.reduce((acc, g) => acc + g.savedAmount, 0);

    res.json({
      success: true,
      count: enrichedGoals.length,
      totalTarget,
      totalSaved,
      overallProgress: totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0,
      goals: enrichedGoals,
    });
  } catch (error) {
    console.error('getGoals error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving savings goals.', error: error.message });
  }
};

// @desc    Create a new savings goal
// @route   POST /api/goals
// @access  Private
exports.createGoal = async (req, res) => {
  try {
    const { title, targetAmount, savedAmount = 0, deadline } = req.body;

    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, target amount, and deadline date.',
      });
    }

    const numTarget = Number(targetAmount);
    const numSaved = Number(savedAmount);

    if (isNaN(numTarget) || numTarget <= 0) {
      return res.status(400).json({ success: false, message: 'Target amount must be greater than 0.' });
    }

    const goal = await SavingsGoal.create({
      userId: req.user._id,
      title: title.trim(),
      targetAmount: numTarget,
      savedAmount: isNaN(numSaved) || numSaved < 0 ? 0 : numSaved,
      deadline: new Date(deadline),
    });

    res.status(201).json({
      success: true,
      message: 'Savings goal created successfully.',
      goal,
    });
  } catch (error) {
    console.error('createGoal error:', error);
    res.status(500).json({ success: false, message: 'Server error creating savings goal.', error: error.message });
  }
};

// @desc    Update a savings goal (or add funds)
// @route   PUT /api/goals/:id
// @access  Private
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, targetAmount, savedAmount, addAmount, deadline } = req.body;

    let goal = await SavingsGoal.findOne({ _id: id, userId: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Savings goal not found or unauthorized.' });
    }

    if (title !== undefined) goal.title = title.trim();
    if (targetAmount !== undefined) {
      const numTarget = Number(targetAmount);
      if (isNaN(numTarget) || numTarget <= 0) {
        return res.status(400).json({ success: false, message: 'Target amount must be greater than 0.' });
      }
      goal.targetAmount = numTarget;
    }
    if (addAmount !== undefined) {
      const numAdd = Number(addAmount);
      if (!isNaN(numAdd)) {
        goal.savedAmount = Math.max(0, goal.savedAmount + numAdd);
      }
    } else if (savedAmount !== undefined) {
      const numSaved = Number(savedAmount);
      if (isNaN(numSaved) || numSaved < 0) {
        return res.status(400).json({ success: false, message: 'Saved amount cannot be negative.' });
      }
      goal.savedAmount = numSaved;
    }
    if (deadline !== undefined) goal.deadline = new Date(deadline);

    await goal.save();

    res.json({
      success: true,
      message: 'Savings goal updated successfully.',
      goal,
    });
  } catch (error) {
    console.error('updateGoal error:', error);
    res.status(500).json({ success: false, message: 'Server error updating savings goal.', error: error.message });
  }
};

// @desc    Delete a savings goal
// @route   DELETE /api/goals/:id
// @access  Private
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await SavingsGoal.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Savings goal not found or unauthorized.' });
    }

    res.json({
      success: true,
      message: 'Savings goal deleted successfully.',
      id,
    });
  } catch (error) {
    console.error('deleteGoal error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting savings goal.', error: error.message });
  }
};
