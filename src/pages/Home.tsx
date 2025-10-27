import { Link } from 'react-router-dom';
import { navigationItems } from '../data/navigation';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Interactive Learning Games
          </h1>
          <p className="text-xl text-gray-600">
            Choose a game to start learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navigationItems.map((item) => (
            <Link
              to={item.link}
              key={item.id}
              className="
                block p-6 rounded-xl border-2 border-blue-200
                bg-white hover:bg-blue-50 hover:border-blue-400
                transition-all hover:shadow-lg
                transform hover:-translate-y-1
              "
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

