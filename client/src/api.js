const BASE = '/api';
export const fetchUsers = () => fetch(`${BASE}/users`).then(r => r.json());
export const fetchReceipts = () => fetch(`${BASE}/receipts`).then(r => r.json());
export const fetchRewards = () => fetch(`${BASE}/rewards`).then(r => r.json());
export const fetchMetrics = () => fetch(`${BASE}/metrics`).then(r => r.json());
export const updatePoints = (id, points) =>
  fetch(`${BASE}/admin/users/${id}/points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ points })
  }).then(r => r.json());
