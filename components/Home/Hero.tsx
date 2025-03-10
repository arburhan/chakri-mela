/* eslint-disable */
import { SearchIcon } from '@/components/icons';

const Hero = () => {
    return (
        < section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white" >
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
        </section >
    );
};

export default Hero;