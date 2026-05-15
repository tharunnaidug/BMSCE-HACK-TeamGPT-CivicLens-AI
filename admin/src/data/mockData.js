export const mockWorkers = [
  { id: 'w1', name: 'John Davis' },
  { id: 'w2', name: 'Sarah Connor' },
  { id: 'w3', name: 'Mike Miller' },
  { id: 'w4', name: 'Lisa Ray' },
];

export const mockUsers = [
  { id: 'u1', name: 'Alice Smith', email: 'alice@example.com', joinedDate: '2023-10-12', totalReports: 5 },
  { id: 'u2', name: 'Bob Johnson', email: 'bob@example.com', joinedDate: '2023-11-05', totalReports: 2 },
  { id: 'u3', name: 'Charlie Brown', email: 'charlie@example.com', joinedDate: '2024-01-20', totalReports: 8 },
  { id: 'u4', name: 'Diana Prince', email: 'diana@example.com', joinedDate: '2024-02-14', totalReports: 1 },
];

export const mockReports = [
  {
    id: 'RPT-001',
    title: 'Massive Pothole on Main St',
    description: 'There is a huge pothole causing traffic slowdowns and potential car damage near the central park.',
    location: '123 Main St, Downtown',
    status: 'Pending', // Pending, In Progress, Completed
    reportedBy: 'Alice Smith',
    dateReported: '2024-05-12',
    issuePhoto: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800',
    completionPhoto: null,
    assignedWorkerId: null
  },
  {
    id: 'RPT-002',
    title: 'Broken Streetlight',
    description: 'Streetlight is flickering and sometimes completely off, making the intersection dangerous at night.',
    location: 'Oak Ave & 4th St',
    status: 'In Progress',
    reportedBy: 'Bob Johnson',
    dateReported: '2024-05-10',
    issuePhoto: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&q=80&w=800',
    completionPhoto: null,
    assignedWorkerId: 'w2'
  },
  {
    id: 'RPT-003',
    title: 'Fallen Tree Branch',
    description: 'A large tree branch fell over the sidewalk blocking pedestrian access.',
    location: 'Elm Street, near the library',
    status: 'Completed',
    reportedBy: 'Charlie Brown',
    dateReported: '2024-05-08',
    issuePhoto: 'https://images.unsplash.com/photo-1590523282247-497793d9a16b?auto=format&fit=crop&q=80&w=800',
    completionPhoto: 'https://images.unsplash.com/photo-1605330368146-5db21d7b0704?auto=format&fit=crop&q=80&w=800', // Mock completion photo
    assignedWorkerId: 'w1'
  },
  {
    id: 'RPT-004',
    title: 'Graffiti on Public Wall',
    description: 'Vandalism on the side of the post office building.',
    location: 'Post Office, South Wing',
    status: 'Pending',
    reportedBy: 'Diana Prince',
    dateReported: '2024-05-13',
    issuePhoto: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800',
    completionPhoto: null,
    assignedWorkerId: null
  }
];

export const mockSubAdmins = [
  { id: 'sa1', name: 'James Gordon', email: 'gordon@civiclens.gov', region: 'Downtown', status: 'Active' },
  { id: 'sa2', name: 'Harvey Dent', email: 'harvey@civiclens.gov', region: 'South Wing', status: 'Inactive' },
  { id: 'sa3', name: 'Renee Montoya', email: 'renee@civiclens.gov', region: 'Central Park', status: 'Active' },
];
