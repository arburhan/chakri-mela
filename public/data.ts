export const allJobsData = [
    {
        id: 1,
        title: 'Experienced Plumber',
        company: 'FixIt Plumbing',
        hourlyRate: '50',
        description: 'Looking for a certified plumber to handle residential plumbing issues.',
        skills: ['Plumbing', 'Pipe Repair', 'Water Systems'],
        createdAt: new Date('2025-07-01').toISOString(),
    },
    {
        id: 2,
        title: 'Electrician',
        company: 'Bright Sparks',
        hourlyRate: '55',
        description: 'Need a licensed electrician for various electrical installations and repairs.',
        skills: ['Electrical Work', 'Wiring', 'Circuit Breakers'],
        createdAt: new Date('2025-02-01').toISOString(),
    },
    {
        id: 3,
        title: 'Carpenter',
        company: 'WoodWorks',
        hourlyRate: '45',
        description: 'Seeking a skilled carpenter for custom furniture and home renovations.',
        skills: ['Carpentry', 'Woodworking', 'Furniture Making'],
        createdAt: new Date('2021-07-01').toISOString(),
    },
    {
        id: 4,
        title: 'Painter',
        company: 'ColorSplash',
        hourlyRate: '40',
        description: 'Hiring a professional painter for interior and exterior painting projects.',
        skills: ['Painting', 'Color Mixing', 'Surface Preparation'],
        createdAt: new Date('2021-07-01').toISOString(),
    },
    {
        id: 5,
        title: 'House Cleaner',
        company: 'CleanSweep',
        hourlyRate: '30',
        description: 'Looking for a reliable cleaner to maintain a clean and organized home.',
        skills: ['Cleaning', 'Dusting', 'Vacuuming'],
        createdAt: new Date('2021-07-01').toISOString(),
    },
    {
        id: 6,
        title: 'Landscaper',
        company: 'GreenThumb',
        hourlyRate: '35',
        description: 'Need a landscaper to design and maintain a beautiful outdoor space.',
        skills: ['Landscaping', 'Gardening', 'Lawn Care'],
        createdAt: new Date('2021-07-01').toISOString(),
    },
    {
        id: 7,
        title: 'Mover',
        company: 'SwiftMoves',
        hourlyRate: '25',
        description: 'Hiring a mover to help with packing, loading, and unloading for a move.',
        skills: ['Moving Services', 'Heavy Lifting', 'Furniture Assembly'],
        createdAt: new Date('2021-07-01').toISOString(),
    },
    {
        id: 8,
        title: 'Home Repair Specialist',
        company: 'FixIt All',
        hourlyRate: '40',
        description: 'Seeking a home repair specialist for general maintenance and repairs.',
        skills: ['Home Repair', 'Fixing', 'Maintenance'],
        createdAt: new Date('2021-07-01').toISOString(),
    },
    {
        id: 9,
        title: 'Shop Manager',
        company: 'QuickMart',
        hourlyRate: '45',
        description: 'Looking for a shop manager to oversee daily operations and sales.',
        skills: ['Shop Management', 'Inventory Control', 'Customer Service'],
        createdAt: new Date('2021-07-01').toISOString(),
    },
    {
        id: 10,
        title: 'Pharmacist',
        company: 'HealthyMeds',
        hourlyRate: '50',
        description: 'Seeking a licensed pharmacist to dispense medications and provide health advice.',
        skills: ['Medicine Shop', 'Pharmacy', 'Healthcare'],
        createdAt: new Date('2021-07-01').toISOString(),
    },
    {
        id: 11,
        title: 'Fashion Stylist',
        company: 'StyleMe',
        hourlyRate: '35',
        description: 'Hiring a fashion stylist to create stylish outfits for clients.',
        skills: ['Clothing Store', 'Fashion', 'Personal Styling'],
        createdAt: new Date('2021-07-01').toISOString(),
    }
];

export const jobTypeData = [
    {
        id: 1,
        name: "part-time",
        description: "Part-time jobs are typically less than 30 hours a week and offer flexibility for workers.",
        icon: "🕒",
    },
    {
        id: 2,
        name: "full-time",
        description: "Full-time jobs usually require 30-40 hours a week and often come with benefits.",
        icon: "🕒",
    },
    {
        id: 3,
        name: "freelance",
        description: "Freelance jobs allow workers to take on projects independently, often with flexible hours.",
        icon: "🕒",
    },
    {
        id: 4,
        name: "contract",
        description: "Contract jobs are typically for a specific period or project, often with set terms.",
        icon: "🕒",
    }
];

export const categoriesData = [
    { id: 1, name: "Plumbing", count: "1,234", icon: "🔧", skills: ["Pipe Repair", "Water Systems", "Leak Detection", "Fixture Installation", "Drain Cleaning"] },
    { id: 2, name: "Electrical Work", count: "867", icon: "💡", skills: ["Wiring", "Circuit Installation", "Lighting Systems", "Safety Inspection", "Troubleshooting"] },
    { id: 3, name: "Carpentry", count: "2,156", icon: "🖼️", skills: ["Woodworking", "Cabinet Making", "Furniture Assembly", "Wood Finishing", "Custom Design"] },
    { id: 4, name: "Painting", count: "1,543", icon: "🎨", skills: ["Interior Painting", "Exterior Painting", "Color Mixing", "Surface Preparation", "Wallpaper Installation"] },
    { id: 5, name: "Cleaning", count: "976", icon: "🧹", skills: ["Deep Cleaning", "Window Cleaning", "Floor Care", "Sanitization", "Organization"] },
    { id: 6, name: "Landscaping", count: "654", icon: "🌳", skills: ["Garden Design", "Lawn Maintenance", "Plant Care", "Irrigation Systems", "Hardscaping"] },
    { id: 7, name: "Moving Services", count: "432", icon: "🚚", skills: ["Packing", "Heavy Lifting", "Furniture Assembly", "Loading/Unloading", "Transport"] },
    { id: 8, name: "Home Repair", count: "876", icon: "🔨", skills: ["General Maintenance", "Drywall Repair", "Door Installation", "Window Repair", "Basic Carpentry"] },
    { id: 9, name: "Shop Management", count: "1,234", icon: "🏪", skills: ["Inventory Management", "Staff Supervision", "Customer Service", "Sales Analysis", "Operations Planning"] },
    { id: 10, name: "Medicine Shop", count: "867", icon: "💊", skills: ["Medication Dispensing", "Health Consultation", "Inventory Control", "Patient Care", "Drug Information"] },
    { id: 11, name: "Clothing Store", count: "2,156", icon: "👗", skills: ["Fashion Styling", "Visual Merchandising", "Sales Management", "Stock Management", "Customer Relations"] }
];

export const genders = [
    { key: "male", label: "Male" },
    { key: "female", label: "Female" },
    { key: "hijra", label: "Hijra" },
]