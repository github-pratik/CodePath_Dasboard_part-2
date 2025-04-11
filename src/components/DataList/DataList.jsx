import React from 'react';
import { Link } from 'react-router-dom';
import './DataList.css';

const DataList = ({ data }) => {
  if (data.length === 0) {
    return <div className="no-results">No Pokémon found matching your criteria.</div>;
  }

  return (
    <div className="data-list">
      <div className="list-header">
        <div className="header-item">Image</div>
        <div className="header-item">Name</div>
        <div className="header-item">Type</div>
        <div className="header-item">Height</div>
        <div className="header-item">Base XP</div>
      </div>
      
      {data.map(pokemon => (
        <Link to={`/pokemon/${pokemon.id}`} key={pokemon.id} className="list-item-link">
          <div className="list-item">
            <div className="item-image">
              <img 
                src={pokemon.sprites.front_default} 
                alt={pokemon.name} 
              />
            </div>
            <div className="item-title">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
            <div className="item-category">
              {pokemon.types.map(typeInfo => (
                <span key={typeInfo.type.name} className={`type-badge ${typeInfo.type.name}`}>
                  {typeInfo.type.name}
                </span>
              ))}
            </div>
            <div className="item-price">{(pokemon.height / 10).toFixed(1)}m</div>
            <div className="item-rating">
              <span className="rating-value">{pokemon.base_experience || 'N/A'}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DataList;