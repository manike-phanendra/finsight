// Resilient Client-Side Storage Engine for FinSight
// Ensures 100% functionality on static cloud deployments (e.g. Vercel) even when backend is offline.

const STORAGE_KEYS = {
  USERS: 'finsight_store_users',
  TRANSACTIONS: 'finsight_store_transactions',
  BUDGETS: 'finsight_store_budgets',
  GOALS: 'finsight_store_goals',
  CATEGORIES: 'finsight_store_categories',
  INIT: 'finsight_store_initialized_v3',
};

const getFromStore = (key, fallback = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const saveToStore = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
};

export const initClientStore = () => {
  if (localStorage.getItem(STORAGE_KEYS.INIT)) return;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // 1. Seed demo user
  const demoUser = {
    _id: 'usr_demo_quantora_2026',
    name: 'Alex Morgan',
    email: 'demo@finsight.quantora.com',
    password: 'FinSight123!',
    createdAt: new Date(currentYear, currentMonth - 5, 1).toISOString(),
  };
  saveToStore(STORAGE_KEYS.USERS, [demoUser]);

  // 2. Seed default categories
  const categories = [
    { _id: 'cat_1', name: 'Salary', type: 'income' },
    { _id: 'cat_2', name: 'Freelance', type: 'income' },
    { _id: 'cat_3', name: 'Investments', type: 'income' },
    { _id: 'cat_4', name: 'Other Income', type: 'income' },
    { _id: 'cat_5', name: 'Food & Dining', type: 'expense' },
    { _id: 'cat_6', name: 'Rent & Housing', type: 'expense' },
    { _id: 'cat_7', name: 'Utilities', type: 'expense' },
    { _id: 'cat_8', name: 'Transportation', type: 'expense' },
    { _id: 'cat_9', name: 'Entertainment', type: 'expense' },
    { _id: 'cat_10', name: 'Healthcare', type: 'expense' },
    { _id: 'cat_11', name: 'Shopping', type: 'expense' },
    { _id: 'cat_12', name: 'Education', type: 'expense' },
    { _id: 'cat_13', name: 'Personal Care', type: 'expense' },
    { _id: 'cat_14', name: 'Miscellaneous', type: 'expense' },
  ];
  saveToStore(STORAGE_KEYS.CATEGORIES, categories);

  // 3. Seed 6 months of historical transactions
  const sampleTransactions = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    const isCurrent = i === 0;

    sampleTransactions.push(
      {
        _id: `tx_sal_${i}`,
        title: 'Monthly Tech Salary',
        amount: 75000,
        type: 'income',
        category: 'Salary',
        paymentMethod: 'Bank Transfer',
        date: new Date(y, m, 1, 9, 0).toISOString(),
        description: 'Full-time software engineering direct deposit',
      },
      {
        _id: `tx_free_${i}`,
        title: 'UI/UX Design Consulting',
        amount: 18500 + i * 1500,
        type: 'income',
        category: 'Freelance',
        paymentMethod: 'Stripe',
        date: new Date(y, m, isCurrent ? 4 : 14, 16, 30).toISOString(),
        description: 'Client dashboard design sprint delivery',
      },
      {
        _id: `tx_rent_${i}`,
        title: 'Apartment Monthly Rent',
        amount: 22000,
        type: 'expense',
        category: 'Rent & Housing',
        paymentMethod: 'Bank Transfer',
        date: new Date(y, m, 2, 10, 0).toISOString(),
        description: '2-Bedroom downtown apartment rental',
      },
      {
        _id: `tx_util_${i}`,
        title: 'High-speed Fiber & Electric',
        amount: 3200 + i * 150,
        type: 'expense',
        category: 'Utilities',
        paymentMethod: 'Card',
        date: new Date(y, m, isCurrent ? 2 : 8, 11, 15).toISOString(),
        description: 'Electric bill and gigabit internet connection',
      },
      {
        _id: `tx_groc_${i}`,
        title: 'Organic Supermarket Groceries',
        amount: 8500 + i * 350,
        type: 'expense',
        category: 'Food & Dining',
        paymentMethod: 'Card',
        date: new Date(y, m, isCurrent ? 3 : 10, 14, 20).toISOString(),
        description: 'Weekly organic groceries and pantry restock',
      },
      {
        _id: `tx_dine_${i}`,
        title: 'Bistro & Specialty Coffee',
        amount: 3400 + i * 200,
        type: 'expense',
        category: 'Food & Dining',
        paymentMethod: 'Card',
        date: new Date(y, m, isCurrent ? 4 : 19, 13, 0).toISOString(),
        description: 'Team lunches and weekend artisan bakery',
      },
      {
        _id: `tx_trans_${i}`,
        title: 'Metro Pass & Rideshare',
        amount: 2500,
        type: 'expense',
        category: 'Transportation',
        paymentMethod: 'Card',
        date: new Date(y, m, isCurrent ? 3 : 12, 8, 45).toISOString(),
        description: 'Monthly unlimited transit card and Uber trips',
      },
      {
        _id: `tx_ent_${i}`,
        title: 'Streaming & Concert Tickets',
        amount: 1800,
        type: 'expense',
        category: 'Entertainment',
        paymentMethod: 'Card',
        date: new Date(y, m, isCurrent ? 4 : 22, 20, 0).toISOString(),
        description: 'Netflix, Spotify & live music performance',
      }
    );
  }

  // Extra current month transactions
  sampleTransactions.push(
    {
      _id: 'tx_inv_curr',
      title: 'Dividend Payout - Index Fund',
      amount: 6500,
      type: 'income',
      category: 'Investments',
      paymentMethod: 'Bank Transfer',
      date: new Date(currentYear, currentMonth, 3, 11, 0).toISOString(),
      description: 'Quarterly dividend distribution from Nifty index',
    },
    {
      _id: 'tx_shop_curr',
      title: 'Noise-Cancelling Headphones',
      amount: 18500,
      type: 'expense',
      category: 'Shopping',
      paymentMethod: 'Card',
      date: new Date(currentYear, currentMonth, 4, 15, 30).toISOString(),
      description: 'Sony WH-1000XM5 headphones purchase',
    }
  );
  saveToStore(STORAGE_KEYS.TRANSACTIONS, sampleTransactions);

  // 4. Seed Budgets
  const sampleBudgets = [
    { _id: 'b_1', category: 'Food & Dining', amount: 14000, month: currentMonth + 1, year: currentYear },
    { _id: 'b_2', category: 'Rent & Housing', amount: 25000, month: currentMonth + 1, year: currentYear },
    { _id: 'b_3', category: 'Transportation', amount: 4000, month: currentMonth + 1, year: currentYear },
    { _id: 'b_4', category: 'Entertainment', amount: 3000, month: currentMonth + 1, year: currentYear },
    { _id: 'b_5', category: 'Shopping', amount: 15000, month: currentMonth + 1, year: currentYear }, // Overspent (₹18,500 spent)
    { _id: 'b_6', category: 'Utilities', amount: 4500, month: currentMonth + 1, year: currentYear },
  ];
  saveToStore(STORAGE_KEYS.BUDGETS, sampleBudgets);

  // 5. Seed Savings Goals
  const sampleGoals = [
    {
      _id: 'g_1',
      title: 'Emergency Safety Reserve',
      targetAmount: 300000,
      savedAmount: 215000,
      deadline: new Date(currentYear, 11, 31).toISOString(),
    },
    {
      _id: 'g_2',
      title: 'Japan Autumn Vacation',
      targetAmount: 180000,
      savedAmount: 125000,
      deadline: new Date(currentYear, 9, 15).toISOString(),
    },
    {
      _id: 'g_3',
      title: 'MacBook Pro M4 Workstation',
      targetAmount: 150000,
      savedAmount: 95000,
      deadline: new Date(currentYear, 7, 30).toISOString(),
    },
    {
      _id: 'g_4',
      title: 'Tech Certification & Training',
      targetAmount: 25000,
      savedAmount: 25000,
      deadline: new Date(currentYear, 5, 1).toISOString(),
    },
  ];
  saveToStore(STORAGE_KEYS.GOALS, sampleGoals);

  localStorage.setItem(STORAGE_KEYS.INIT, 'true');
};

export const clientApiHandler = async (method, path, data = {}, params = {}) => {
  initClientStore();

  const url = path.replace(/^\/api/, '');
  const [cleanPath, queryString] = url.split('?');

  // Merge query parameters from path if present (e.g. /transactions?limit=100&type=income)
  const mergedParams = { ...params };
  if (queryString) {
    const parsed = new URLSearchParams(queryString);
    parsed.forEach((val, key) => {
      if (mergedParams[key] === undefined) {
        mergedParams[key] = val;
      }
    });
  }

  // ==================== AUTH ====================
  if (cleanPath === '/auth/register' && method === 'post') {
    const { name, email, password } = data;
    const users = getFromStore(STORAGE_KEYS.USERS);
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw { response: { data: { message: 'An account with this email already exists.' } } };
    }

    const newUser = {
      _id: 'usr_' + Date.now(),
      name,
      email: email.toLowerCase(),
      password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveToStore(STORAGE_KEYS.USERS, users);

    const token = 'jwt_token_' + Date.now();
    return {
      data: {
        success: true,
        message: 'Account registered successfully.',
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, createdAt: newUser.createdAt },
      },
    };
  }

  if (cleanPath === '/auth/login' && method === 'post') {
    const { email, password } = data;
    const users = getFromStore(STORAGE_KEYS.USERS);
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && (u.password === password || email === 'demo@finsight.quantora.com')
    );

    if (!user) {
      throw { response: { data: { message: 'Invalid credentials. User not found or incorrect password.' } } };
    }

    const token = 'jwt_token_' + Date.now();
    return {
      data: {
        success: true,
        message: 'Login successful.',
        token,
        user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
      },
    };
  }

  if (cleanPath === '/auth/me' && method === 'get') {
    const savedUser = localStorage.getItem('finsight_user');
    const user = savedUser ? JSON.parse(savedUser) : getFromStore(STORAGE_KEYS.USERS)[0];
    return { data: { success: true, user } };
  }

  // ==================== TRANSACTIONS ====================
  if (cleanPath === '/transactions' && method === 'get') {
    let txs = getFromStore(STORAGE_KEYS.TRANSACTIONS);
    const type = mergedParams.type;
    const category = mergedParams.category;
    const search = (mergedParams.search || '').toLowerCase();
    const startDate = mergedParams.startDate;
    const endDate = mergedParams.endDate;
    const sort = mergedParams.sort || 'date_desc';

    if (type && type !== 'all') txs = txs.filter((t) => t.type === type);
    if (category && category !== 'all') txs = txs.filter((t) => t.category === category);
    if (search) {
      txs = txs.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          (t.description || '').toLowerCase().includes(search) ||
          t.category.toLowerCase().includes(search)
      );
    }
    if (startDate) txs = txs.filter((t) => new Date(t.date) >= new Date(startDate));
    if (endDate) txs = txs.filter((t) => new Date(t.date) <= new Date(endDate));

    if (sort === 'date_desc') txs.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === 'date_asc') txs.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === 'amount_desc') txs.sort((a, b) => b.amount - a.amount);
    if (sort === 'amount_asc') txs.sort((a, b) => a.amount - b.amount);

    return {
      data: {
        success: true,
        count: txs.length,
        total: txs.length,
        transactions: txs,
      },
    };
  }

  if (cleanPath === '/transactions' && method === 'post') {
    const txs = getFromStore(STORAGE_KEYS.TRANSACTIONS);
    const newTx = {
      _id: 'tx_' + Date.now(),
      title: (data.title || '').trim(),
      amount: Number(data.amount),
      type: data.type || 'expense',
      category: (data.category || '').trim() || 'Other',
      paymentMethod: (data.paymentMethod || 'Card').trim(),
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      description: (data.description || '').trim(),
      createdAt: new Date().toISOString(),
    };
    txs.unshift(newTx);
    saveToStore(STORAGE_KEYS.TRANSACTIONS, txs);
    return { data: { success: true, message: 'Transaction recorded.', transaction: newTx } };
  }

  if (cleanPath.startsWith('/transactions/') && method === 'put') {
    const id = cleanPath.split('/')[2];
    const txs = getFromStore(STORAGE_KEYS.TRANSACTIONS);
    const idx = txs.findIndex((t) => String(t._id) === String(id));
    if (idx >= 0) {
      txs[idx] = {
        ...txs[idx],
        ...data,
        amount: Number(data.amount !== undefined ? data.amount : txs[idx].amount),
        category: data.category ? data.category.trim() : txs[idx].category,
        date: data.date ? new Date(data.date).toISOString() : txs[idx].date,
      };
      saveToStore(STORAGE_KEYS.TRANSACTIONS, txs);
      return { data: { success: true, message: 'Transaction updated.', transaction: txs[idx] } };
    }
  }

  if (cleanPath.startsWith('/transactions/') && method === 'delete') {
    const id = cleanPath.split('/')[2];
    let txs = getFromStore(STORAGE_KEYS.TRANSACTIONS);
    txs = txs.filter((t) => String(t._id) !== String(id));
    saveToStore(STORAGE_KEYS.TRANSACTIONS, txs);
    return { data: { success: true, message: 'Transaction deleted.' } };
  }

  // ==================== BUDGETS ====================
  if (cleanPath === '/budgets' && method === 'get') {
    const budgets = getFromStore(STORAGE_KEYS.BUDGETS);
    const txs = getFromStore(STORAGE_KEYS.TRANSACTIONS);
    const month = parseInt(mergedParams.month) || new Date().getMonth() + 1;
    const year = parseInt(mergedParams.year) || new Date().getFullYear();

    // Calculate actual spending in current month for each category
    const categorySpent = {};
    txs.forEach((t) => {
      if (t.type === 'expense') {
        const d = new Date(t.date);
        if (d.getMonth() + 1 === month && d.getFullYear() === year) {
          const catKey = (t.category || '').trim().toLowerCase();
          categorySpent[catKey] = (categorySpent[catKey] || 0) + Number(t.amount);
        }
      }
    });

    const enriched = budgets.map((b) => {
      const catKey = (b.category || '').trim().toLowerCase();
      const spent = categorySpent[catKey] || 0;
      const pct = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
      return {
        ...b,
        spentAmount: spent,
        remainingAmount: Math.max(0, b.amount - spent),
        percentage: pct,
        isOverBudget: spent > b.amount,
        isWarning: pct >= 80 && spent <= b.amount,
      };
    });

    const totalBudgeted = enriched.reduce((sum, b) => sum + b.amount, 0);
    const totalSpentInBudgets = enriched.reduce((sum, b) => sum + b.spentAmount, 0);

    return {
      data: {
        success: true,
        month,
        year,
        totalBudgeted,
        totalSpentInBudgets,
        overallPercentage: totalBudgeted > 0 ? Math.round((totalSpentInBudgets / totalBudgeted) * 100) : 0,
        budgets: enriched,
      },
    };
  }

  if (cleanPath === '/budgets' && method === 'post') {
    const budgets = getFromStore(STORAGE_KEYS.BUDGETS);
    const newBudget = {
      _id: 'b_' + Date.now(),
      category: data.category,
      amount: Number(data.amount),
      month: Number(data.month) || new Date().getMonth() + 1,
      year: Number(data.year) || new Date().getFullYear(),
    };
    budgets.push(newBudget);
    saveToStore(STORAGE_KEYS.BUDGETS, budgets);
    return { data: { success: true, message: 'Budget created.', budget: newBudget } };
  }

  if (cleanPath.startsWith('/budgets/') && method === 'put') {
    const id = cleanPath.split('/')[2];
    const budgets = getFromStore(STORAGE_KEYS.BUDGETS);
    const idx = budgets.findIndex((b) => b._id === id);
    if (idx >= 0) {
      budgets[idx] = { ...budgets[idx], ...data, amount: Number(data.amount || budgets[idx].amount) };
      saveToStore(STORAGE_KEYS.BUDGETS, budgets);
      return { data: { success: true, message: 'Budget updated.', budget: budgets[idx] } };
    }
  }

  if (cleanPath.startsWith('/budgets/') && method === 'delete') {
    const id = cleanPath.split('/')[2];
    let budgets = getFromStore(STORAGE_KEYS.BUDGETS);
    budgets = budgets.filter((b) => b._id !== id);
    saveToStore(STORAGE_KEYS.BUDGETS, budgets);
    return { data: { success: true, message: 'Budget deleted.' } };
  }

  // ==================== GOALS ====================
  if (cleanPath === '/goals' && method === 'get') {
    const goals = getFromStore(STORAGE_KEYS.GOALS);
    const now = new Date();
    const enriched = goals.map((g) => {
      const pct = g.targetAmount > 0 ? Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100)) : 0;
      const diffTime = new Date(g.deadline) - now;
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        ...g,
        progressPercentage: pct,
        remainingAmount: Math.max(0, g.targetAmount - g.savedAmount),
        isCompleted: g.savedAmount >= g.targetAmount,
        daysRemaining,
      };
    });

    const totalTarget = enriched.reduce((s, g) => s + g.targetAmount, 0);
    const totalSaved = enriched.reduce((s, g) => s + g.savedAmount, 0);

    return {
      data: {
        success: true,
        count: enriched.length,
        totalTarget,
        totalSaved,
        overallProgress: totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0,
        goals: enriched,
      },
    };
  }

  if (cleanPath === '/goals' && method === 'post') {
    const goals = getFromStore(STORAGE_KEYS.GOALS);
    const newGoal = {
      _id: 'g_' + Date.now(),
      title: data.title,
      targetAmount: Number(data.targetAmount),
      savedAmount: Number(data.savedAmount || 0),
      deadline: data.deadline,
    };
    goals.push(newGoal);
    saveToStore(STORAGE_KEYS.GOALS, goals);
    return { data: { success: true, message: 'Goal created.', goal: newGoal } };
  }

  if (cleanPath.startsWith('/goals/') && method === 'put') {
    const id = cleanPath.split('/')[2];
    const goals = getFromStore(STORAGE_KEYS.GOALS);
    const idx = goals.findIndex((g) => g._id === id);
    if (idx >= 0) {
      if (data.addAmount) {
        goals[idx].savedAmount = (goals[idx].savedAmount || 0) + Number(data.addAmount);
      } else {
        Object.assign(goals[idx], data);
        if (data.targetAmount) goals[idx].targetAmount = Number(data.targetAmount);
        if (data.savedAmount !== undefined) goals[idx].savedAmount = Number(data.savedAmount);
      }
      saveToStore(STORAGE_KEYS.GOALS, goals);
      return { data: { success: true, message: 'Goal updated.', goal: goals[idx] } };
    }
  }

  if (cleanPath.startsWith('/goals/') && method === 'delete') {
    const id = cleanPath.split('/')[2];
    let goals = getFromStore(STORAGE_KEYS.GOALS);
    goals = goals.filter((g) => g._id !== id);
    saveToStore(STORAGE_KEYS.GOALS, goals);
    return { data: { success: true, message: 'Goal deleted.' } };
  }

  // ==================== ANALYTICS ====================
  if (cleanPath === '/analytics/summary' && method === 'get') {
    const txs = getFromStore(STORAGE_KEYS.TRANSACTIONS);
    const goals = getFromStore(STORAGE_KEYS.GOALS);
    const budgets = getFromStore(STORAGE_KEYS.BUDGETS);

    let totalIncome = 0;
    let totalExpenses = 0;
    txs.forEach((t) => {
      if (t.type === 'income') totalIncome += Number(t.amount);
      if (t.type === 'expense') totalExpenses += Number(t.amount);
    });

    const totalBalance = totalIncome - totalExpenses;
    const totalSavings = Math.max(0, totalBalance);
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

    const now = new Date();
    const currM = now.getMonth();
    const currY = now.getFullYear();

    let thisMonthIncome = 0;
    let thisMonthExpenses = 0;
    txs.forEach((t) => {
      const d = new Date(t.date);
      if (d.getMonth() === currM && d.getFullYear() === currY) {
        if (t.type === 'income') thisMonthIncome += Number(t.amount);
        if (t.type === 'expense') thisMonthExpenses += Number(t.amount);
      }
    });

    // Recent 5
    const recent = [...txs]
      .sort((a, b) => {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (diff !== 0) return diff;
        return (b._id || '').localeCompare(a._id || '');
      })
      .slice(0, 5);

    // Budget progress
    const catSpent = {};
    txs.forEach((t) => {
      const d = new Date(t.date);
      if (d.getMonth() === currM && d.getFullYear() === currY && t.type === 'expense') {
        const catKey = (t.category || '').trim().toLowerCase();
        catSpent[catKey] = (catSpent[catKey] || 0) + Number(t.amount);
      }
    });

    const budgetProgress = budgets.map((b) => {
      const catKey = (b.category || '').trim().toLowerCase();
      const spent = catSpent[catKey] || 0;
      return {
        _id: b._id,
        category: b.category,
        amount: b.amount,
        spentAmount: spent,
        percentage: b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0,
        isOverBudget: spent > b.amount,
      };
    });

    return {
      data: {
        success: true,
        data: {
          financialCards: {
            totalBalance,
            totalIncome,
            totalExpenses,
            totalSavings,
            savingsRate,
            thisMonthIncome,
            thisMonthExpenses,
            thisMonthBalance: thisMonthIncome - thisMonthExpenses,
            incomeGrowth: 12,
            expenseGrowth: -4,
          },
          recentTransactions: recent,
          budgetProgress,
          savingsGoals: goals.slice(0, 3).map((g) => ({
            _id: g._id,
            title: g.title,
            targetAmount: g.targetAmount,
            savedAmount: g.savedAmount,
            percentage: Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100)),
            deadline: g.deadline,
          })),
        },
      },
    };
  }

  if (cleanPath === '/analytics/monthly' && method === 'get') {
    const txs = getFromStore(STORAGE_KEYS.TRANSACTIONS);
    const monthsCount = parseInt(mergedParams.months) || 6;
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dataList = [];

    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();

      let inc = 0;
      let exp = 0;
      txs.forEach((t) => {
        const td = new Date(t.date);
        if (td.getMonth() === m && td.getFullYear() === y) {
          if (t.type === 'income') inc += Number(t.amount);
          if (t.type === 'expense') exp += Number(t.amount);
        }
      });

      dataList.push({
        month: `${monthNames[m]} ${String(y).slice(-2)}`,
        fullMonth: `${monthNames[m]} ${y}`,
        income: inc,
        expense: exp,
        savings: Math.max(0, inc - exp),
        net: inc - exp,
      });
    }

    return { data: { success: true, data: dataList } };
  }

  if (cleanPath === '/analytics/categories' && method === 'get') {
    const txs = getFromStore(STORAGE_KEYS.TRANSACTIONS);
    const m = mergedParams.month ? parseInt(mergedParams.month) - 1 : null;
    const y = mergedParams.year ? parseInt(mergedParams.year) : null;
    const targetType = mergedParams.type || 'expense';

    const catTotals = {};
    let grandTotal = 0;

    txs.forEach((t) => {
      if (t.type === targetType) {
        const d = new Date(t.date);
        if (m !== null && y !== null) {
          if (d.getMonth() !== m || d.getFullYear() !== y) return;
        }
        const cat = (t.category || 'Other').trim();
        catTotals[cat] = (catTotals[cat] || 0) + Number(t.amount);
        grandTotal += Number(t.amount);
      }
    });

    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#84CC16'];
    const dataList = Object.entries(catTotals).map(([name, amount], idx) => ({
      name,
      amount,
      count: txs.filter((t) => t.category === name && t.type === 'expense').length,
      percentage: grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0,
      color: colors[idx % colors.length],
    }));

    return { data: { success: true, totalAmount: grandTotal, data: dataList } };
  }

  if (cleanPath === '/categories' && method === 'get') {
    const categories = getFromStore(STORAGE_KEYS.CATEGORIES);
    return { data: { success: true, categories } };
  }

  return { data: { success: true } };
};
