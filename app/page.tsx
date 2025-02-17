import { SearchIcon } from '@/components/icons';
import { categories } from '@/public/data';
import React from 'react';


const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find the perfect freelance services for your business
            </h1>
            <div className="bg-white rounded-lg p-2 flex items-center shadow-lg">
              <SearchIcon className="text-gray-400 w-6 h-6 ml-2" />
              <input
                type="text"
                placeholder="Search for any service..."
                className="w-full px-4 py-2 text-gray-800 bg-white focus:outline-none"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                Search
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="text-sm bg-blue-500 bg-opacity-20 px-3 py-1 rounded-full">
                Popular: Home Repair
              </span>
              <span className="text-sm bg-blue-500 bg-opacity-20 px-3 py-1 rounded-full">
                Painting
              </span>
              <span className="text-sm bg-blue-500 bg-opacity-20 px-3 py-1 rounded-full">
                Electrical Work
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 text-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-center text-center">
            {categories.map((category) => (
              <div key={category.name} className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  {category.icon}
                </div>
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.count} services available</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 text-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-gray-50 text-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold mb-2">{job.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{job.company}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    ${job.hourlyRate}/hr
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};




const steps = [
  {
    title: 'Post a Job',
    description: 'Create a detailed job posting describing your needs and requirements.'
  },
  {
    title: 'Review Proposals',
    description: 'Get proposals from talented freelancers ready to help.'
  },
  {
    title: 'Hire & Work',
    description: 'Choose the best fit and start working together.'
  }
];

const featuredJobs = [
  {
    id: 1,
    title: 'Experienced Plumber',
    company: 'FixIt Plumbing',
    hourlyRate: '50',
    description: 'Looking for a certified plumber to handle residential plumbing issues.',
    skills: ['Plumbing', 'Pipe Repair', 'Water Systems']
  },
  {
    id: 2,
    title: 'Electrician',
    company: 'Bright Sparks',
    hourlyRate: '55',
    description: 'Need a licensed electrician for various electrical installations and repairs.',
    skills: ['Electrical Work', 'Wiring', 'Circuit Breakers']
  },
  {
    id: 3,
    title: 'Carpenter',
    company: 'WoodWorks',
    hourlyRate: '45',
    description: 'Seeking a skilled carpenter for custom furniture and home renovations.',
    skills: ['Carpentry', 'Woodworking', 'Furniture Making']
  }
];

export default Home;