export default [
  {
    _id: 'evt1',
    organizer: 'club1',
    title: 'Celestia',
    description: 'Annual cultural fest with talent showcases, music, and drama.',
    date: '2025-10-27T18:00:00.000+05:30',
    location: '6th Floor College',
    poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    registrationForm: [
      { label: 'Name', fieldType: 'text', required: true },
      { label: 'Roll No', fieldType: 'number', required: true },
      { label: 'Email', fieldType: 'email', required: false }
    ]
  },
  {
    _id: 'evt2',
    organizer: 'club2',
    title: 'TechXpo',
    description: 'Technology and innovation exhibition. Open for all branches!',
    date: '2025-11-03T14:30:00.000+05:30',
    location: 'Auditorium',
    poster: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80',
    registrationForm: [
      { label: 'Name', fieldType: 'text', required: true },
      { label: 'Branch', fieldType: 'text', required: true },
      { label: 'Team Name', fieldType: 'text', required: false }
    ]
  },
  {
    _id: 'evt3',
    organizer: 'club3',
    title: 'CodeSprint',
    description: '24-hour coding hackathon for all enthusiasts.',
    date: '2025-11-10T10:00:00.000+05:30',
    location: 'Lab 3',
    poster: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
    registrationForm: [
      { label: 'Team Name', fieldType: 'text', required: true },
      { label: 'Number of Members', fieldType: 'number', required: true }
    ]
  },
  {
    _id: 'evt4',
    organizer: 'club4',
    title: 'Innovate Fest',
    description: 'An innovation challenge fest with workshops and prizes.',
    date: '2025-11-19T13:00:00.000+05:30',
    location: 'Main Hall',
    poster: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    registrationForm: [
      { label: 'Team Name', fieldType: 'text', required: true },
      { label: 'Leader Name', fieldType: 'text', required: true }
    ]
  },
  {
    _id: 'evt5',
    organizer: 'club5',
    title: 'BizQuiz',
    description: 'Business quiz competition with cash prizes.',
    date: '2025-11-25T11:00:00.000+05:30',
    location: 'Conference Hall',
    poster: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    registrationForm: [
      { label: 'Participant Name', fieldType: 'text', required: true },
      { label: 'Email', fieldType: 'email', required: false }
    ]
  },
  {
    _id: 'evt6',
    organizer: 'club1',
    title: 'Art Mania',
    description: 'College-wide art competition, all mediums welcome!',
    date: '2025-12-05T09:00:00.000+05:30',
    location: 'Studio Room',
    poster: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80',
    registrationForm: [
      { label: 'Participant Name', fieldType: 'text', required: true },
      { label: 'Category', fieldType: 'text', required: true }
    ]
  },
  {
    _id: 'evt7',
    organizer: 'club6',
    title: 'Fun Run',
    description: '5K fun run for a good cause. All fitness levels welcome!',
    date: '2025-12-10T07:00:00.000+05:30',
    location: 'College Ground',
    poster: 'https://images.unsplash.com/photo-1465101178521-1e289f71d6b8?auto=format&fit=crop&w=600&q=80',
    registrationForm: [
      { label: 'Name', fieldType: 'text', required: true },
      { label: 'Phone', fieldType: 'number', required: true }
    ]
  },
  {
    _id: 'evt8',
    organizer: 'club2',
    title: 'Drama Night',
    description: 'Enjoy diverse one-act plays presented by the college drama society.',
    date: '2025-12-16T19:00:00.000+05:30',
    location: 'Auditorium',
    poster: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    registrationForm: [
      { label: 'Actor Name', fieldType: 'text', required: true }
    ]
  },
  {
    _id: 'evt9',
    organizer: 'club7',
    title: 'Photography Contest',
    description: 'Capture your best shot and submit to win prizes!',
    date: '2026-01-09T11:30:00.000+05:30',
    location: 'Media Hall',
    poster: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
    registrationForm: [
      { label: 'Name', fieldType: 'text', required: true },
      { label: 'Submission Link', fieldType: 'text', required: true }
    ]
  },
  {
    _id: 'evt10',
    organizer: 'club8',
    title: 'Debate Mania',
    description: 'District-level debate finals on current affairs.',
    date: '2026-01-16T16:00:00.000+05:30',
    location: 'Lecture Hall 5',
    poster: 'https://images.unsplash.com/photo-1461344577544-4e5dc9487184?auto=format&fit=crop&w=600&q=80',
    registrationForm: [
      { label: 'Participant Name', fieldType: 'text', required: true },
      { label: 'Topic', fieldType: 'text', required: true }
    ]
  }
];


