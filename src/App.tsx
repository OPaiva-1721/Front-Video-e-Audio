import React from 'react';
import Home from './pages/Home';
import {ActiveDownloads} from './components/ActiveDownloads';

const App = () => {
  return (
    <div className="App">
      <Home />
      <ActiveDownloads />
    </div>
  );
};

export default App;
