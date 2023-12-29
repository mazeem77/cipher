'use client'

import Results from "@/components/results";
import { useState } from 'react';

export default function Home() {
  const username = useState(['Imran Khan', 'Nawaz Sharif', 'Asif Zardari']);
  const [selectedVote, setSelectedVote] = useState([0, 0, 0]);
  const [message, setMessage] = useState('');
  const [data, setData] = useState<[]>([]);
  const [hidden, setHidden] = useState(true)
  const [error, setError] = useState(false)

  const submitVote = async (event: any) => {
    event.preventDefault();
    if (event.target[0].value) {
      setError(false)
    } else {
      setError(true)
      return
    }
    const response = await fetch('http://localhost:3000/api/seal/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nominees: username, voteArray: selectedVote }),
    });

    const data = await response.json();
    setData(data.data.PlainC.slice(0, 3));
    setMessage(data.message);
  };

  const handleVoteChange = (index: number) => {
    const newVote = [0, 0, 0];
    newVote[index] = 1;
    setSelectedVote(newVote);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-center text-xl font-bold">Vote for Your Favorite Option</h1>

      {message && <p className="text-green-500">{message}</p>}

      <form onSubmit={submitVote} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          name="votee"
          className="rounded border border-gray-300 p-2"
        />
        {error ? <p className="text-xs italic text-red-500">Enter your name please! You think voting is joke!</p> : <></>}
        <div className="space-y-2">
          {['Imran Khan', 'Nawaz Sharif', 'Asif Zardari'].map((option, index) => (
            <label key={option} className="block">
              <input
                type="radio"
                name="vote"
                value={option}
                onChange={() => handleVoteChange(index)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>

        <button type="submit" onClick={() => {
          setHidden(true);
        }} className="mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
          Submit Vote
        </button>
        <button type="button" onClick={() => {
          setHidden(!hidden);
        }} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
          Show Results
        </button>
      </form>
      {hidden ? <></> : <Results votes={data} />}
    </div>
  );
}
