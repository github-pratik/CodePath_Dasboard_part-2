import { useState } from 'react';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { FaInfoCircle } from 'react-icons/fa';
import './PokemonCharts.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

const PokemonCharts = ({ data }) => {
  // State for chart visibility
  const [showCharts, setShowCharts] = useState(true);
  const [activeCharts, setActiveCharts] = useState({
    typeDistribution: true,
    baseStats: true
  });
  const [chartTypes, setChartTypes] = useState({
    typeDistribution: 'pie',
    baseStats: 'bar'
  });
  
  // Skip if no data is available
  if (!data || data.length === 0) return null;

  // Calculate type distribution
  const typeDistribution = {};
  data.forEach(pokemon => {
    pokemon.types.forEach(typeInfo => {
      const typeName = typeInfo.type.name;
      if (typeDistribution[typeName]) {
        typeDistribution[typeName]++;
      } else {
        typeDistribution[typeName] = 1;
      }
    });
  });

  // Sort types by frequency
  const sortedTypes = Object.entries(typeDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Get top 10 types

  const typeLabels = sortedTypes.map(([type]) => type);
  const typeCounts = sortedTypes.map(([, count]) => count);

  // Calculate base stat distribution
  const statCategories = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
  const statAverages = {};
  
  // Initialize stat counters
  statCategories.forEach(stat => {
    statAverages[stat] = 0;
  });
  
  // Sum up stats
  data.forEach(pokemon => {
    pokemon.stats.forEach(stat => {
      const statName = stat.stat.name;
      if (statCategories.includes(statName)) {
        statAverages[statName] += stat.base_stat;
      }
    });
  });
  
  // Calculate averages
  Object.keys(statAverages).forEach(stat => {
    statAverages[stat] = Math.round(statAverages[stat] / data.length);
  });

  // Format stat names for display
  const formattedStatNames = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed': 'Speed'
  };

  // Prepare data for the bar chart
  const statLabels = statCategories.map(stat => formattedStatNames[stat]);
  const statValues = statCategories.map(stat => statAverages[stat]);

  // Type distribution chart data
  const typeChartData = {
    labels: typeLabels,
    datasets: [
      {
        label: 'Number of Pokémon',
        data: typeCounts,
        backgroundColor: [
          '#A8A878', // normal
          '#F08030', // fire
          '#6890F0', // water
          '#78C850', // grass
          '#F8D030', // electric
          '#A040A0', // poison
          '#F85888', // psychic
          '#A8B820', // bug
          '#B8A038', // rock
          '#705898', // ghost
        ],
        borderWidth: 1,
      },
    ],
  };

  // Average base stats chart data
  const statChartData = {
    labels: statLabels,
    datasets: [
      {
        label: 'Average Base Stat',
        data: statValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const typeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Pokémon Type Distribution',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = typeCounts.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const statChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Average Base Stats',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  // Helper function to render the appropriate chart type
  const renderChart = (chartType, data, options) => {
    switch(chartType) {
      case 'pie':
        return <Pie data={data} options={options} />;
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'line':
        return <Line data={data} options={options} />;
      case 'radar':
        return <Radar data={data} options={options} />;
      default:
        return <Bar data={data} options={options} />;
    }
  };

  // Data insights
  const mostCommonType = typeLabels[0];
  const highestStat = statLabels[statValues.indexOf(Math.max(...statValues))];
  const lowestStat = statLabels[statValues.indexOf(Math.min(...statValues))];

  return (
    <div className="charts-section">
      <div className="charts-controls">
        <h2>Data Visualizations</h2>
        <div className="toggle-container">
          <button 
            className={`toggle-button ${showCharts ? 'active' : ''}`}
            onClick={() => setShowCharts(!showCharts)}
          >
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </button>
        </div>
      </div>

      {showCharts && (
        <>
          <div className="data-insights">
            <div className="insight-card">
              <FaInfoCircle className="insight-icon" />
              <div className="insight-content">
                <h3>Data Highlights</h3>
                <p><strong>{mostCommonType}</strong> is the most common type among these Pokémon.</p>
                <p>Pokémon have the highest average <strong>{highestStat}</strong> and lowest average <strong>{lowestStat}</strong>.</p>
                <p>Try filtering by type to see how stats vary across different Pokémon types!</p>
              </div>
            </div>
          </div>

          <div className="charts-container">
            {activeCharts.typeDistribution && (
              <div className="chart-wrapper">
                <div className="chart-header">
                  <h3>Pokémon Type Distribution</h3>
                  <div className="chart-controls">
                    <select 
                      value={chartTypes.typeDistribution}
                      onChange={(e) => setChartTypes({...chartTypes, typeDistribution: e.target.value})}
                    >
                      <option value="pie">Pie Chart</option>
                      <option value="bar">Bar Chart</option>
                    </select>
                    <button 
                      className="chart-toggle"
                      onClick={() => setActiveCharts({...activeCharts, typeDistribution: !activeCharts.typeDistribution})}
                    >
                      Hide
                    </button>
                  </div>
                </div>
                {renderChart(chartTypes.typeDistribution, typeChartData, typeChartOptions)}
              </div>
            )}
            
            {activeCharts.baseStats && (
              <div className="chart-wrapper">
                <div className="chart-header">
                  <h3>Average Base Stats</h3>
                  <div className="chart-controls">
                    <select 
                      value={chartTypes.baseStats}
                      onChange={(e) => setChartTypes({...chartTypes, baseStats: e.target.value})}
                    >
                      <option value="bar">Bar Chart</option>
                      <option value="line">Line Chart</option>
                      <option value="radar">Radar Chart</option>
                    </select>
                    <button 
                      className="chart-toggle"
                      onClick={() => setActiveCharts({...activeCharts, baseStats: !activeCharts.baseStats})}
                    >
                      Hide
                    </button>
                  </div>
                </div>
                {renderChart(chartTypes.baseStats, statChartData, statChartOptions)}
              </div>
            )}
          </div>

          {(!activeCharts.typeDistribution || !activeCharts.baseStats) && (
            <div className="hidden-charts-controls">
              {!activeCharts.typeDistribution && (
                <button 
                  className="chart-restore"
                  onClick={() => setActiveCharts({...activeCharts, typeDistribution: true})}
                >
                  Show Type Distribution
                </button>
              )}
              {!activeCharts.baseStats && (
                <button 
                  className="chart-restore"
                  onClick={() => setActiveCharts({...activeCharts, baseStats: true})}
                >
                  Show Base Stats
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PokemonCharts;