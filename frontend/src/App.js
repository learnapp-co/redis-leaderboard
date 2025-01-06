import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [playerScore, setPlayerScore] = useState('');
  const [totalPlayers, setTotalPlayers] = useState(0);

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(
        'http://10.0.7.210:9000/leaderboard/list'
      );
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalPlayers = async () => {
    try {
      const response = await axios.get(
        'http://10.0.7.210:9000/leaderboard/total'
      );
      setTotalPlayers(response.data.totalPlayers);
    } catch (error) {
      console.error('Error fetching total players:', error);
    }
  };

  // Add a new player
  const addPlayer = async (e) => {
    e.preventDefault();

    if (!playerName || !playerScore) {
      alert('Please enter both name and score');
      return;
    }

    try {
      // Send a POST request to your backend to add the new player
      await axios.post('http://10.0.7.210:9000/leaderboard/add', {
        player: playerName,
        score: parseInt(playerScore),
      });

      // After adding the player, fetch the updated leaderboard
      fetchLeaderboard();

      // Clear the form fields
      setPlayerName('');
      setPlayerScore('');
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLeaderboard();
    fetchTotalPlayers();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Leaderboard</h1>

        {/* Player add form */}
        <form onSubmit={addPlayer}>
          <div>
            <label htmlFor="playerName">Player Name:</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="playerScore">Score:</label>
            <input
              type="number"
              id="playerScore"
              value={playerScore}
              onChange={(e) => setPlayerScore(e.target.value)}
            />
          </div>
          <button type="submit">Add Player</button>
        </form>

        {/* Total Players and Top Player */}
        <h3>Total Players: {totalPlayers}</h3>

        {/* Leaderboard Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.player}</td>
                  <td>{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </header>
    </div>
  );
};

export default App;
