'use client'
import { useState } from 'react';
import Link from 'next/link';
import {
  FaBars,
  FaTimes,
  FaUser,
  FaBell,
  FaSearch,
  FaEnvelope,
  FaBriefcase,
  FaUsers,
  FaProjectDiagram,
  FaBook
} from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <Link href="/" className="text-blue-600 text-2xl font-bold">Chakri-Mela</Link>

        <div className="hidden md:flex space-x-8">
          <Link href="/jobs" className="text-gray-700 hover:text-blue-600 transition duration-300">Jobs</Link>
          <Link href="/talent" className="text-gray-700 hover:text-blue-600 transition duration-300">Talent</Link>
          <Link href="/projects" className="text-gray-700 hover:text-blue-600 transition duration-300">Projects</Link>
          <Link href="/resources" className="text-gray-700 hover:text-blue-600 transition duration-300">Resources</Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {/* <FaSearch className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-300" />
          <FaEnvelope className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-300" />
          <FaBell className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-300" />
          <FaUser className="text-gray-700 hover:text-blue-600 cursor-pointer transition duration-300" /> */}
          <Link href="/login" className="text-blue-600 px-4 py-2 rounded-md bg-blue-100 transition duration-300">Sign In</Link>
          {/* <Link href="/register" className="bg-blue-100 text-black px-4 py-2 rounded-md hover:bg-blue-700 hover:text-white transition duration-300">Sign Up Now</Link> */}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none transition duration-300"
        >
          {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/jobs" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Jobs</Link>
            <Link href="/talent" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Talent</Link>
            <Link href="/projects" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Projects</Link>
            <Link href="/resources" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Resources</Link>
            {/* <Link href="/search" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Search</Link>
            <Link href="/messages" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Messages</Link>
            <Link href="/notifications" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Notifications</Link>
            <Link href="/profile" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Profile</Link> */}
            <div className="flex flex-col space-y-2 mt-4">
              {/*  <Link href="/register" className="w-full text-blue-600 px-4 py-2 rounded-md bg-blue-50 text-center transition duration-300">Sign Up Now</Link> */}
              <Link href="/login" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center transition duration-300">Sign in</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
