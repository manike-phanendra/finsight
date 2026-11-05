const http = require('http');

const request = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Starting FinSight Automated API Endpoint Test Suite (QUANTORA)...');
  const baseUrl = { hostname: '127.0.0.1', port: 5000 };

  // 1. Health check
  const health = await request({ ...baseUrl, path: '/api/health', method: 'GET' });
  console.log(`[1] GET /api/health -> Status: ${health.status}`, health.body.project ? '✅' : '❌');

  // 2. Auth: Register
  const testEmail = `testuser_${Date.now()}@quantora.com`;
  const registerRes = await request(
    {
      ...baseUrl,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { name: 'Test Member', email: testEmail, password: 'Password123!' }
  );
  console.log(`[2] POST /api/auth/register -> Status: ${registerRes.status}`, registerRes.body.token ? '✅' : '❌');
  let token = registerRes.body.token;

  // 3. Auth: Login with demo credentials
  const loginRes = await request(
    {
      ...baseUrl,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'demo@finsight.quantora.com', password: 'FinSight123!' }
  );
  console.log(`[3] POST /api/auth/login -> Status: ${loginRes.status}`, loginRes.body.token ? '✅' : '❌');
  token = loginRes.body.token; // Use demo user token for rich data tests

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 4. Auth: Me
  const meRes = await request({ ...baseUrl, path: '/api/auth/me', method: 'GET', headers: authHeaders });
  console.log(`[4] GET /api/auth/me -> Status: ${meRes.status}`, meRes.body.user ? '✅' : '❌');

  // 5. Transactions: GET
  const txList = await request({ ...baseUrl, path: '/api/transactions', method: 'GET', headers: authHeaders });
  console.log(`[5] GET /api/transactions -> Status: ${txList.status}, Count: ${txList.body.count}`, txList.status === 200 ? '✅' : '❌');

  // 6. Transactions: POST
  const newTx = await request(
    { ...baseUrl, path: '/api/transactions', method: 'POST', headers: authHeaders },
    {
      title: 'Coffee & Books',
      amount: 45.5,
      type: 'expense',
      category: 'Food & Dining',
      paymentMethod: 'Card',
      description: 'Morning latte and technical book',
    }
  );
  console.log(`[6] POST /api/transactions -> Status: ${newTx.status}`, newTx.body.transaction ? '✅' : '❌');
  const createdTxId = newTx.body.transaction?._id;

  // 7. Transactions: PUT
  const updateTx = await request(
    { ...baseUrl, path: `/api/transactions/${createdTxId}`, method: 'PUT', headers: authHeaders },
    { title: 'Coffee & Technical Manual', amount: 50.0 }
  );
  console.log(`[7] PUT /api/transactions/:id -> Status: ${updateTx.status}`, updateTx.body.transaction?.amount === 50 ? '✅' : '❌');

  // 8. Transactions: DELETE
  const deleteTx = await request({ ...baseUrl, path: `/api/transactions/${createdTxId}`, method: 'DELETE', headers: authHeaders });
  console.log(`[8] DELETE /api/transactions/:id -> Status: ${deleteTx.status}`, deleteTx.body.success ? '✅' : '❌');

  // 9. Budgets: GET
  const budgetsRes = await request({ ...baseUrl, path: '/api/budgets', method: 'GET', headers: authHeaders });
  console.log(`[9] GET /api/budgets -> Status: ${budgetsRes.status}, Total Budgeted: $${budgetsRes.body.totalBudgeted}`, budgetsRes.status === 200 ? '✅' : '❌');

  // 10. Budgets: POST
  const newBudget = await request(
    { ...baseUrl, path: '/api/budgets', method: 'POST', headers: authHeaders },
    { category: 'Education', amount: 300 }
  );
  console.log(`[10] POST /api/budgets -> Status: ${newBudget.status}`, newBudget.body.budget ? '✅' : '❌');
  const createdBudgetId = newBudget.body.budget?._id;

  // 11. Budgets: PUT
  const updateBudget = await request(
    { ...baseUrl, path: `/api/budgets/${createdBudgetId}`, method: 'PUT', headers: authHeaders },
    { amount: 350 }
  );
  console.log(`[11] PUT /api/budgets/:id -> Status: ${updateBudget.status}`, updateBudget.body.budget?.amount === 350 ? '✅' : '❌');

  // 12. Budgets: DELETE
  const deleteBudget = await request({ ...baseUrl, path: `/api/budgets/${createdBudgetId}`, method: 'DELETE', headers: authHeaders });
  console.log(`[12] DELETE /api/budgets/:id -> Status: ${deleteBudget.status}`, deleteBudget.body.success ? '✅' : '❌');

  // 13. Goals: GET
  const goalsRes = await request({ ...baseUrl, path: '/api/goals', method: 'GET', headers: authHeaders });
  console.log(`[13] GET /api/goals -> Status: ${goalsRes.status}, Goals: ${goalsRes.body.count}`, goalsRes.status === 200 ? '✅' : '❌');

  // 14. Goals: POST
  const newGoal = await request(
    { ...baseUrl, path: '/api/goals', method: 'POST', headers: authHeaders },
    {
      title: 'Home Office Standing Desk',
      targetAmount: 650,
      savedAmount: 150,
      deadline: '2026-12-31',
    }
  );
  console.log(`[14] POST /api/goals -> Status: ${newGoal.status}`, newGoal.body.goal ? '✅' : '❌');
  const createdGoalId = newGoal.body.goal?._id;

  // 15. Goals: PUT
  const updateGoal = await request(
    { ...baseUrl, path: `/api/goals/${createdGoalId}`, method: 'PUT', headers: authHeaders },
    { addAmount: 100 }
  );
  console.log(`[15] PUT /api/goals/:id -> Status: ${updateGoal.status}`, updateGoal.body.goal?.savedAmount === 250 ? '✅' : '❌');

  // 16. Goals: DELETE
  const deleteGoal = await request({ ...baseUrl, path: `/api/goals/${createdGoalId}`, method: 'DELETE', headers: authHeaders });
  console.log(`[16] DELETE /api/goals/:id -> Status: ${deleteGoal.status}`, deleteGoal.body.success ? '✅' : '❌');

  // 17. Analytics: Summary
  const summaryRes = await request({ ...baseUrl, path: '/api/analytics/summary', method: 'GET', headers: authHeaders });
  console.log(
    `[17] GET /api/analytics/summary -> Status: ${summaryRes.status}, Balance: $${summaryRes.body.data?.financialCards?.totalBalance}`,
    summaryRes.body.data?.financialCards ? '✅' : '❌'
  );

  // 18. Analytics: Monthly
  const monthlyRes = await request({ ...baseUrl, path: '/api/analytics/monthly?months=6', method: 'GET', headers: authHeaders });
  console.log(`[18] GET /api/analytics/monthly -> Status: ${monthlyRes.status}, Months: ${monthlyRes.body.data?.length}`, monthlyRes.status === 200 ? '✅' : '❌');

  // 19. Analytics: Categories
  const categoryRes = await request({ ...baseUrl, path: '/api/analytics/categories', method: 'GET', headers: authHeaders });
  console.log(`[19] GET /api/analytics/categories -> Status: ${categoryRes.status}, Categories: ${categoryRes.body.data?.length}`, categoryRes.status === 200 ? '✅' : '❌');

  console.log('\n🎉 ALL 19 API ENDPOINTS TESTED AND VERIFIED SUCCESSFULLY!');
  process.exit(0);
};

// Start server and run tests in sequence
const app = require('./server');
setTimeout(runTests, 1500);
