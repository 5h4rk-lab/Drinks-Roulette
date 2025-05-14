// File: src/App.jsx
import React, { useState } from 'react';
import './index.css';

function App() {
  const [chosenDrink, setChosenDrink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [ageVerified, setAgeVerified] = useState(false);

  const spinDrink = async () => {
    setLoading(true);
    setChosenDrink(null);
    try {
      let fetched = null;

      do {
        const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const data = await res.json();
        fetched = data.drinks[0];
      } while (filter && fetched.strAlcoholic !== filter);

      const ingredients = [];
      for (let i = 1; i <= 15; i++) {
        const ing = fetched[`strIngredient${i}`];
        const measure = fetched[`strMeasure${i}`];
        if (ing) ingredients.push(`${measure || ''} ${ing}`.trim());
      }

      const mappedDrink = {
        name: fetched.strDrink,
        type: fetched.strAlcoholic,
        image: fetched.strDrinkThumb,
        instructions: fetched.strInstructions,
        ingredients
      };

      setTimeout(() => {
        setChosenDrink(mappedDrink);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch drink:', error);
      setLoading(false);
    }
  };

  if (!ageVerified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 to-yellow-100 px-6 text-center">
        <h1 className="text-4xl font-bold text-purple-800 mb-6 drop-shadow">🍹 Drinks Roulette</h1>
        <p className="text-lg text-gray-800 mb-6">Hold up! 🚨 Before we serve your digital cocktail...</p>
        <p className="text-md text-gray-700 italic mb-8">"Are you 21 or older? Or are you still trading juice boxes in the cafeteria?" 😏</p>
        <div className="flex gap-4">
          <button
            onClick={() => setAgeVerified(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full shadow-lg text-lg"
          >
            I'm 21+ 🍸
          </button>
          <button
            onClick={() => alert("Come back when you're old enough. Here's a Capri Sun 🧃")}
            className="bg-red-400 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-full shadow-lg text-lg"
          >
            I'm Not 😬
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-100 via-violet-100 to-indigo-100 text-black px-4 sm:px-6 py-8 flex flex-col items-center font-sans">
      <header className="w-full max-w-md mx-auto flex items-center gap-3 mb-6 px-2">
        <img src="/icons/icon-192.png" alt="logo" className="w-12 h-12 rounded-xl object-cover drop-shadow-md" />
        <h1 className="text-4xl font-extrabold text-purple-700 tracking-tight drop-shadow-sm">Drinks Roulette</h1>
      </header>

      <div className="mb-6 flex gap-3 flex-wrap justify-center w-full max-w-md px-2">
        {['🍸 Alcoholic', '🧃 Non alcoholic'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type.includes('Alcoholic') ? 'Alcoholic' : 'Non alcoholic')}
            className={`text-sm px-5 py-2 rounded-full shadow-md transition font-semibold ${
              filter === (type.includes('Alcoholic') ? 'Alcoholic' : 'Non alcoholic')
                ? 'bg-purple-700 text-white'
                : 'bg-white text-purple-700 border border-purple-400 hover:bg-purple-100'
            }`}
          >
            {type}
          </button>
        ))}
        <button
          onClick={() => setFilter('')}
          className={`text-sm px-5 py-2 rounded-full shadow-md font-semibold ${
            filter === '' ? 'bg-green-600 text-white' : 'bg-white text-green-700 border border-green-400 hover:bg-green-100'
          }`}
        >
          🎯 All
        </button>
      </div>

      <button
        onClick={spinDrink}
        disabled={loading}
        className={`bg-yellow-400 hover:bg-yellow-500 px-8 py-4 rounded-full font-black text-black text-xl shadow-lg transition transform ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 animate-pulse'
        } flex items-center gap-3`}
      >
        🎲 {loading ? 'Shaking...' : 'Spin for a Drink'}
      </button>

      {chosenDrink && (
        <div className="relative mt-10 w-full max-w-md px-2">
          <div className="bg-white/80 backdrop-blur-sm border border-purple-300 rounded-2xl shadow-xl p-6 text-center transition-all duration-300 scale-100 hover:scale-105 animate-fade-in">
            <img
              src={chosenDrink.image}
              alt={chosenDrink.name}
              className="w-full h-auto rounded-xl mb-4 shadow-md"
            />
            <h2 className="text-3xl font-bold mb-2 text-purple-800 drop-shadow-sm">{chosenDrink.name}</h2>
            <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-2">{chosenDrink.type}</p>
            <p className="text-base mt-2 text-gray-800 italic leading-relaxed mb-3">{chosenDrink.instructions}</p>
            <div className="text-left">
              <h3 className="text-md font-semibold text-purple-600 mb-1">🍹 Ingredients:</h3>
              <ul className="list-disc list-inside text-sm text-gray-900">
                {chosenDrink.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;