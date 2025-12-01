import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">About Us</h1>

                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:flex-shrink-0">
                            <img className="h-48 w-full object-cover md:w-48" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" alt="Team working" />
                        </div>
                        <div className="p-8">
                            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Our Story</div>
                            <p className="mt-2 text-gray-500">
                                Welcome to Bewakoof Clone, your number one source for all things fashion. We're dedicated to giving you the very best of clothing, with a focus on dependability, customer service, and uniqueness.
                            </p>
                            <p className="mt-4 text-gray-500">
                                Founded in 2023, Bewakoof Clone has come a long way from its beginnings. When we first started out, our passion for eco-friendly fashion drove us to do intense research, and gave us the impetus to turn hard work and inspiration into to a booming online store.
                            </p>
                            <p className="mt-4 text-gray-500">
                                We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="mt-2 text-xl font-medium text-gray-900">Fast Delivery</h3>
                        <p className="mt-2 text-gray-500">We ensure your products reach you in the shortest time possible.</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                        </div>
                        <h3 className="mt-2 text-xl font-medium text-gray-900">Best Quality</h3>
                        <p className="mt-2 text-gray-500">We never compromise on quality. You get what you see.</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="mt-2 text-xl font-medium text-gray-900">24/7 Support</h3>
                        <p className="mt-2 text-gray-500">Our support team is always available to assist you.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
