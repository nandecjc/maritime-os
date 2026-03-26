export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('maritime_token');
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('maritime_token');
    localStorage.removeItem('maritime_user');
    window.location.href = '/login';
  }

  return response;
}
