/* eslint-disable */
import Link from 'next/link';
import {

    FaLinkedinIn,

    FaInstagramSquare,
    FaYoutubeSquare,
    FaTwitterSquare,
    FaFacebookSquare
} from 'react-icons/fa';

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Chakri-Mela</h3>
                        <p className="text-gray-400">
                            Find the perfect job or hire the best talent for your needs.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">For Job Seekers</h4>
                        <ul className="space-y-2">
                            <li><Link href="/browse-jobs" className="text-gray-400 hover:text-white">Browse Jobs</Link></li>
                            <li><Link href="/browse-companies" className="text-gray-400 hover:text-white">Browse Companies</Link></li>
                            <li><Link href="/salary-calculator" className="text-gray-400 hover:text-white">Salary Calculator</Link></li>
                            <li><Link href="/career-advice" className="text-gray-400 hover:text-white">Career Advice</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">For Employers</h4>
                        <ul className="space-y-2">
                            <li><Link href="/post-job" className="text-gray-400 hover:text-white">Post a Job</Link></li>
                            <li><Link href="/browse-resumes" className="text-gray-400 hover:text-white">Browse Resumes</Link></li>
                            <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                            <li><Link href="/recruiting-solutions" className="text-gray-400 hover:text-white">Recruiting Solutions</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Connect With Us</h4>
                        <div className="flex space-x-4">
                            <a className="hover:text-white text-gray-400" href="https://facebook.com">
                                <FaFacebookSquare className="h-5 w-5" />
                            </a>
                            <a className="text-gray-400 hover:text-white" href="https://twitter.com">
                                <FaTwitterSquare className="w-5 h-5" />
                            </a>
                            <a className="hover:text-white text-gray-400" href="https://linkedin.com">
                                <FaLinkedinIn className="h-5 w-5" />
                            </a>
                            <a className="hover:text-white text-gray-400" href="https://instagram.com">
                                <FaInstagramSquare className="h-5 w-5" />
                            </a>
                            <a className="hover:text-white text-gray-400" href="https://youtube.com">
                                <FaYoutubeSquare className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400">&copy; 2025 Chakri-Mela. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
                        <Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
                        <Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
