import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './PokemonDetail.css';
import StatCard from '../StatCard/StatCard';

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Pokémon details:', err);
        setError('Failed to fetch Pokémon details. Please try again later.');
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [id]);

  if (loading) return <div className="loading">Loading Pokémon details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!pokemon) return <div className="error">Pokémon not found</div>;

  return (
    <div className="pokemon-detail">
      <Link to="/" className="back-button">← Back to Dashboard</Link>
      
      <div className="detail-header">
        <div className="pokemon-image">
          <img 
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
            alt={pokemon.name} 
          />
        </div>
        <div className="pokemon-info">
          <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
          <div className="pokemon-types">
            {pokemon.types.map(typeInfo => (
              <span key={typeInfo.type.name} className={`type-badge ${typeInfo.type.name}`}>
                {typeInfo.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-container">
        <StatCard title="Height" value={`${(pokemon.height / 10).toFixed(1)}m`} icon="📏" />
        <StatCard title="Weight" value={`${(pokemon.weight / 10).toFixed(1)}kg`} icon="⚖️" />
        <StatCard title="Base XP" value={pokemon.base_experience || 'N/A'} icon="⚡" />
      </div>

      <div className="detail-section">
        <h2>Base Stats</h2>
        <div className="stats-grid">
          {pokemon.stats.map(stat => (
            <div key={stat.stat.name} className="stat-bar">
              <div className="stat-name">{formatStatName(stat.stat.name)}</div>
              <div className="stat-bar-container">
                <div 
                  className="stat-bar-fill" 
                  style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                ></div>
              </div>
              <div className="stat-value">{stat.base_stat}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <h2>Abilities</h2>
        <div className="abilities-list">
          {pokemon.abilities.map(ability => (
            <div key={ability.ability.name} className="ability-item">
              <span className="ability-name">
                {ability.ability.name.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
              {ability.is_hidden && <span className="hidden-ability">(Hidden)</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <h2>Moves</h2>
        <div className="moves-list">
          {pokemon.moves.slice(0, 20).map(move => (
            <div key={move.move.name} className="move-item">
              {move.move.name.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </div>
          ))}
          {pokemon.moves.length > 20 && (
            <div className="more-moves">+{pokemon.moves.length - 20} more moves</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to format stat names
const formatStatName = (statName) => {
  const statNameMap = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed': 'Speed'
  };
  
  return statNameMap[statName] || statName;
};

export default PokemonDetail;