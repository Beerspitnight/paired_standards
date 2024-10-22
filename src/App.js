import React, { useState } from 'react';
import './App.css';

function App() {
  const standards = [
    { id: 'PE3', text: 'Assess human & material costs of Civil War' },
    { id: 'PE4', text: 'Analyze 13th-15th Amendments' },
    { id: 'PE5', text: 'Examine diverse Civil War roles' },
    { id: 'PE6', text: 'Explain Emancipation & Gettysburg' },
    { id: 'PE7', text: 'Assess factors affecting war outcome' },
    { id: 'PE8', text: 'Compare Lincoln & Congress approaches' },
    { id: 'PE9', text: 'Analyze Reconstruction economic impacts' }
  ];

  const pairs = [];
  for (let i = 0; i < standards.length; i++) {
    for (let j = i + 1; j < standards.length; j++) {
      pairs.push([standards[i], standards[j]]);
    }
  }

  const [responses, setResponses] = useState({});
  const [currentPair, setCurrentPair] = useState(0);

  const handleChoice = (pairIndex, choice, intensity) => {
    setResponses({
      ...responses,
      [pairIndex]: { choice, intensity }
    });
  };

  const calculateScores = () => {
    const scores = {};
    standards.forEach(s => scores[s.id] = 0);
    
    Object.entries(responses).forEach(([pairIndex, response]) => {
      const pair = pairs[parseInt(pairIndex)];
      const value = response.intensity;
      
      if (response.choice === 'A') {
        scores[pair[0].id] += value;
        scores[pair[1].id] += (1/value);
      } else {
        scores[pair[0].id] += (1/value);
        scores[pair[1].id] += value;
      }
    });

    return scores;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Standards Comparison Tool</h1>
      </header>
      <main>
        {currentPair < pairs.length ? (
          <div className="comparison-container">
            <h2>Compare these standards ({currentPair + 1} of {pairs.length}):</h2>
            <div className="standard-box standard-a">
              <h3>A: {pairs[currentPair][0].id}</h3>
              <p>{pairs[currentPair][0].text}</p>
            </div>
            <div className="standard-box standard-b">
              <h3>B: {pairs[currentPair][1].id}</h3>
              <p>{pairs[currentPair][1].text}</p>
            </div>
            
            <div className="choice-container">
              <p>Which is more important?</p>
              <div className="button-group">
                <button onClick={() => handleChoice(currentPair, 'A', 1)}>
                  A is more important
                </button>
                <button onClick={() => handleChoice(currentPair, 'equal', 1)}>
                  Equally important
                </button>
                <button onClick={() => handleChoice(currentPair, 'B', 1)}>
                  B is more important
                </button>
              </div>
              
              {responses[currentPair] && (
                <div className="intensity-container">
                  <p>How much more important? (1-9)</p>
                  <div className="button-group">
                    {[1,3,5,7,9].map(n => (
                      <button
                        key={n}
                        onClick={() => {
                          handleChoice(currentPair, responses[currentPair].choice, n);
                          setCurrentPair(curr => curr + 1);
                        }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="results-container">
            <h2>Results:</h2>
            {Object.entries(calculateScores()).map(([id, score]) => (
              <div key={id} className="result-row">
                <span>{standards.find(s => s.id === id).text}</span>
                <span className="score">{(score / (pairs.length * 2)).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;