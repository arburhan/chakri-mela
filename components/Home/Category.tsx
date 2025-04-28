/* eslint-disable */
import { categoriesData } from '@/public/data';

const Category = () => {
    return (
        <section className="py-16 bg-gray-50 text-black">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Popular Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-center text-center">
                    {categoriesData.map((category) => (
                        <div key={category.id} className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
    );
};

export default Category;