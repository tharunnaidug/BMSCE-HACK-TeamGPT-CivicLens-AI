// ================= API SERVICE LAYER =================

const API_BASE = '/api';

// ================= FETCH WRAPPER =================

const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  // Re-apply headers after spread to avoid overwriting
  config.headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  let res;

  try {
    res = await fetch(`${API_BASE}${url}`, config);
  } catch (networkErr) {
    throw new Error('Cannot connect to server. Make sure the backend is running.');
  }

  let data;

  try {
    data = await res.json();
  } catch (parseErr) {
    throw new Error('Server returned an invalid response. Make sure the backend is running on port 5000.');
  }

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};


// ================= AUTH =================

export const loginAdmin = async (email, password) => {
  const data = await apiFetch('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
};

export const logoutAdmin = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};


// ================= DASHBOARD =================

export const getDashboardStats = async () => {
  return apiFetch('/dashboard/stats');
};

export const getAnalytics = async () => {
  return apiFetch('/dashboard/analytics');
};


// ================= ADMIN COMPLAINTS =================

export const getComplaints = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  if (params.status) query.set('status', params.status);
  if (params.severity) query.set('severity', params.severity);
  if (params.label) query.set('label', params.label);
  if (params.search) query.set('search', params.search);

  const qs = query.toString();

  return apiFetch(`/admin/complaints${qs ? `?${qs}` : ''}`);
};

export const updateComplaintStatus = async (complaint_id, status, remarks = '') => {
  return apiFetch('/admin/complaints/status', {
    method: 'POST',
    body: JSON.stringify({ complaint_id, status, remarks }),
  });
};

export const deleteComplaint = async (complaint_id) => {
  return apiFetch('/admin/complaints/delete', {
    method: 'POST',
    body: JSON.stringify({ complaint_id }),
  });
};


// ================= SUBADMIN COMPLAINTS =================

export const getSubAdminComplaints = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  if (params.status) query.set('status', params.status);
  if (params.severity) query.set('severity', params.severity);
  if (params.label) query.set('label', params.label);
  if (params.search) query.set('search', params.search);

  const qs = query.toString();

  return apiFetch(`/subadmin/complaints${qs ? `?${qs}` : ''}`);
};

export const updateSubAdminComplaint = async (complaint_id, status, remarks = '', resolved_image_url = '') => {
  return apiFetch('/subadmin/complaints/update', {
    method: 'POST',
    body: JSON.stringify({ complaint_id, status, remarks, resolved_image_url }),
  });
};


// ================= USERS =================

export const getAllUsers = async () => {
  return apiFetch('/users');
};

export const createSubAdmin = async ({ name, email, password, region, photo_url }) => {
  return apiFetch('/users/subadmin/create', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, region, photo_url }),
  });
};

export const updateSubAdmin = async ({ sub_admin_id, name, region, photo_url }) => {
  return apiFetch('/users/subadmin/update', {
    method: 'POST',
    body: JSON.stringify({ sub_admin_id, name, region, photo_url }),
  });
};
