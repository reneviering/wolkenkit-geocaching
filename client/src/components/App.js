import Header from './Header';
import React from 'react';

const App = function ({ children }) {
  return (
    <div>
      <Header />
      <div className='container'>
        {children}
        <footer>©2017 René Viering, made with wolkenkit, React, Redux and <span role='img' aria-labelledby='love'>❤️</span></footer>
      </div>
    </div>
  );
};

export default App;
