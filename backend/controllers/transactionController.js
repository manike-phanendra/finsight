const Transaction = require('../models/Transaction');

// @desc    Get all transactions for authenticated user with search and filtering
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const { type, category, search, startDate, endDate, sort, page = 1, limit = 50 } = req.query;

    const query = { userId: req.user._id };

    if (type && ['income', 'expense'].includes(type)) {
      query.type = type;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { paymentMethod: searchRegex },
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set to end of the day if date only
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    let sortOptions = { date: -1, _id: -1 };
    if (sort === 'date_asc') sortOptions = { date: 1 };
    if (sort === 'amount_desc') sortOptions = { amount: -1 };
    if (sort === 'amount_asc') sortOptions = { amount: 1 };

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort(sortOptions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: transactions.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
      transactions,
    });
  } catch (error) {
    console.error('getTransactions error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving transactions.', error: error.message });
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, paymentMethod, date, description } = req.body;

    if (!title || amount === undefined || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, amount, type (income/expense), and category.',
      });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number greater than 0.',
      });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      title: title.trim(),
      amount: numAmount,
      type,
      category: category.trim(),
      paymentMethod: paymentMethod ? paymentMethod.trim() : 'Card',
      date: date ? new Date(date) : new Date(),
      description: description ? description.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully.',
      transaction,
    });
  } catch (error) {
    console.error('createTransaction error:', error);
    res.status(500).json({ success: false, message: 'Server error creating transaction.', error: error.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type, category, paymentMethod, date, description } = req.body;

    let transaction = await Transaction.findOne({ _id: id, userId: req.user._id });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found or unauthorized.' });
    }

    if (title !== undefined) transaction.title = title.trim();
    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Amount must be greater than 0.' });
      }
      transaction.amount = numAmount;
    }
    if (type !== undefined) transaction.type = type;
    if (category !== undefined) transaction.category = category.trim();
    if (paymentMethod !== undefined) transaction.paymentMethod = paymentMethod.trim();
    if (date !== undefined) transaction.date = new Date(date);
    if (description !== undefined) transaction.description = description.trim();

    await transaction.save();

    res.json({
      success: true,
      message: 'Transaction updated successfully.',
      transaction,
    });
  } catch (error) {
    console.error('updateTransaction error:', error);
    res.status(500).json({ success: false, message: 'Server error updating transaction.', error: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found or unauthorized.' });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully.',
      id,
    });
  } catch (error) {
    console.error('deleteTransaction error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting transaction.', error: error.message });
  }
};
