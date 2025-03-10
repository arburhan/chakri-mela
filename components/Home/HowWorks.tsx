/* eslint-disable */
const HowWorks = () => {
    return (
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
export default HowWorks;

