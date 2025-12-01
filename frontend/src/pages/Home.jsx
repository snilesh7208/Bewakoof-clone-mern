import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Fashion that speaks</span>{' '}
                                    <span className="block text-primary xl:inline">your vibe</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Discover the latest trends in street style. Premium quality, affordable prices, and designs that make you stand out.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link to="/products" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-primary hover:bg-yellow-400 md:py-4 md:text-lg md:px-10">
                                            Shop Men
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link to="/products" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-gray-800 hover:bg-gray-900 md:py-4 md:text-lg md:px-10">
                                            Shop Women
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                        alt="Fashion model"
                    />
                </div>
            </div>

            {/* Categories Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['T-Shirts', 'Joggers', 'Accessories'].map((category) => (
                        <Link key={category} to={`/products?category=${category}`} className="relative rounded-lg overflow-hidden group shadow-lg h-64">
                            <div className="absolute inset-0 bg-gray-900 opacity-40 group-hover:opacity-30 transition"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h3 className="text-3xl font-bold text-white tracking-wider">{category}</h3>
                            </div>
                            <img
                                src={`https://source.unsplash.com/800x600/?${category.toLowerCase()},fashion`}
                                alt={category}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
