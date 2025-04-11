import { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { FaSearch, FaInfoCircle } from 'react-icons/fa';
import StatCard from '../StatCard/StatCard';
import DataList from '../DataList/DataList';
import PokemonCharts from '../Charts/PokemonCharts';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showDataInfo, setShowDataInfo] = useState(false);
  
  // Statistics state
  const [totalPokemon, setTotalPokemon] = useState(0);
  const [averageBaseExperience, setAverageBaseExperience] = useState(0);
  const [typeCounts, setTypeCounts] = useState({});
  const [interestingFacts, setInterestingFacts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch first 100 Pokémon from the PokéAPI
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        
        // Fetch detailed data for each Pokémon
        const pokemonDetailsPromises = response.data.results.map(pokemon => 
          axios.get(pokemon.url)
        );
        
        const pokemonDetailsResponses = await Promise.all(pokemonDetailsPromises);
        const pokemonData = pokemonDetailsResponses.map(res => res.data);
        
        setData(pokemonData);
        calculateStatistics(pokemonData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch Pokémon data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics from the Pokémon data
  const calculateStatistics = (data) => {
    // Total number of Pokémon
    setTotalPokemon(data.length);
    
    // Average base experience
    const totalBaseExperience = data.reduce((sum, pokemon) => sum + (pokemon.base_experience || 0), 0);
    setAverageBaseExperience((totalBaseExperience / data.length).toFixed(0));
    
    // Count by type
    const types = {};
    data.forEach(pokemon => {
      pokemon.types.forEach(typeInfo => {
        const typeName = typeInfo.type.name;
        if (types[typeName]) {
          types[typeName]++;
        } else {
          types[typeName] = 1;
        }
      });
    });
    setTypeCounts(types);
    
    // Calculate interesting facts
    const facts = {};
    
    // Find heaviest and lightest Pokémon
    const sortedByWeight = [...data].sort((a, b) => b.weight - a.weight);
    facts.heaviestPokemon = {
      name: sortedByWeight[0].name,
      weight: (sortedByWeight[0].weight / 10).toFixed(1) // Convert to kg
    };
    facts.lightestPokemon = {
      name: sortedByWeight[sortedByWeight.length - 1].name,
      weight: (sortedByWeight[sortedByWeight.length - 1].weight / 10).toFixed(1)
    };
    
    // Find tallest and shortest Pokémon
    const sortedByHeight = [...data].sort((a, b) => b.height - a.height);
    facts.tallestPokemon = {
      name: sortedByHeight[0].name,
      height: (sortedByHeight[0].height / 10).toFixed(1) // Convert to meters
    };
    facts.shortestPokemon = {
      name: sortedByHeight[sortedByHeight.length - 1].name,
      height: (sortedByHeight[sortedByHeight.length - 1].height / 10).toFixed(1)
    };
    
    // Most common type
    const sortedTypes = Object.entries(types).sort((a, b) => b[1] - a[1]);
    facts.mostCommonType = {
      type: sortedTypes[0][0],
      count: sortedTypes[0][1]
    };
    
    setInterestingFacts(facts);
  };

  // Filter data based on search query and type filter
  const filteredData = data.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || 
      pokemon.types.some(typeInfo => typeInfo.type.name === typeFilter);
    return matchesSearch && matchesType;
  });

  // Get unique types for the filter dropdown
  const allTypes = data.flatMap(pokemon => pokemon.types.map(typeInfo => typeInfo.type.name));
  const types = ['all', ...new Set(allTypes)];

  return (
    <div className="dashboard">
      <h1>Pokémon Dashboard</h1>
      
      {loading ? (
        <div className="loading">Loading Pokémon data...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="stats-container">
            <StatCard title="Total Pokémon" value={totalPokemon} icon="🔴" />
            <StatCard title="Avg Base XP" value={averageBaseExperience} icon="⚡" />
            <StatCard 
              title="Types" 
              value={Object.keys(typeCounts).length} 
              icon="🏆" 
            />
          </div>
          
          <div className="data-info-section">
            <button 
              className={`data-info-toggle ${showDataInfo ? 'active' : ''}`}
              onClick={() => setShowDataInfo(!showDataInfo)}
            >
              <FaInfoCircle /> {showDataInfo ? 'Hide Data Insights' : 'Show Data Insights'}
            </button>
            
            {showDataInfo && (
              <div className="data-info-content">
                <h2>Interesting Pokémon Facts</h2>
                <div className="facts-grid">
                  <div className="fact-card">
                    <h3>Size Extremes</h3>
                    <p>The tallest Pokémon is <strong>{interestingFacts.tallestPokemon?.name}</strong> at {interestingFacts.tallestPokemon?.height}m</p>
                    <p>The shortest Pokémon is <strong>{interestingFacts.shortestPokemon?.name}</strong> at {interestingFacts.shortestPokemon?.height}m</p>
                  </div>
                  <div className="fact-card">
                    <h3>Weight Extremes</h3>
                    <p>The heaviest Pokémon is <strong>{interestingFacts.heaviestPokemon?.name}</strong> at {interestingFacts.heaviestPokemon?.weight}kg</p>
                    <p>The lightest Pokémon is <strong>{interestingFacts.lightestPokemon?.name}</strong> at {interestingFacts.lightestPokemon?.weight}kg</p>
                  </div>
                  <div className="fact-card">
                    <h3>Type Distribution</h3>
                    <p>The most common type is <strong>{interestingFacts.mostCommonType?.type}</strong> with {interestingFacts.mostCommonType?.count} Pokémon</p>
                    <p>Try filtering by type using the dropdown above to see Pokémon of a specific type!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="filters">
            <div className="search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="category-filter">
              <label htmlFor="type">Filter by Type:</label>
              <select
                id="type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <PokemonCharts data={data} />
          <DataList data={filteredData} />
        </>
      )}
    </div>
  );
};

export default Dashboard;