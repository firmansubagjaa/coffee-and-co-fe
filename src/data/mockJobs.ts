export interface Job {
    id: string;
    title: string;
    type: 'Full-time' | 'Part-time' | 'Contract';
    location: string;
    department: string;
    status: 'Active' | 'Closed';
}

export const MOCK_JOBS: Job[] = [
    { id: '1', title: 'Senior Barista', type: 'Full-time', location: 'Jakarta, Senopati', department: 'Operations', status: 'Active' },
    { id: '2', title: 'Store Manager', type: 'Full-time', location: 'Bali, Canggu', department: 'Management', status: 'Active' },
    { id: '3', title: 'Social Media Intern', type: 'Part-time', location: 'Remote', department: 'Marketing', status: 'Closed' },
];
