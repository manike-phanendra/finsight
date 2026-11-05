const Category = require('../models/Category');

// @desc    Get user categories
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    const query = { userId: req.user._id };
    if (type && ['income', 'expense'].includes(type)) {
      query.type = type;
    }

    let categories = await Category.find(query).sort({ name: 1 });

    // If user has no categories, return standard defaults
    if (categories.length === 0) {
      const defaultIncome = ['Salary', 'Freelance', 'Investments', 'Other Income'];
      const defaultExpense = [
        'Food & Dining', 'Rent & Housing', 'Utilities', 'Transportation',
        'Entertainment', 'Healthcare', 'Shopping', 'Education', 'Personal Care', 'Miscellaneous'
      ];

      const toInsert = [
        ...defaultIncome.map(name => ({ userId: req.user._id, name, type: 'income' })),
        ...defaultExpense.map(name => ({ userId: req.user._id, name, type: 'expense' })),
      ];

      categories = await Category.insertMany(toInsert);
      if (type) {
        categories = categories.filter(c => c.type === type);
      }
    }

    res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving categories.' });
  }
};

// @desc    Add custom category
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Please provide category name and type.' });
    }

    const existing = await Category.findOne({
      userId: req.user._id,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      type,
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists.' });
    }

    const category = await Category.create({
      userId: req.user._id,
      name: name.trim(),
      type,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category,
    });
  } catch (error) {
    console.error('createCategory error:', error);
    res.status(500).json({ success: false, message: 'Server error creating category.' });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, message: 'Category deleted.', id });
  } catch (error) {
    console.error('deleteCategory error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting category.' });
  }
};
