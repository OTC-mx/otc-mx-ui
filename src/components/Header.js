import React from 'react';

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/whitepaper">Whitepaper</a></li>
        <li>
          <div class="dropdown">
            <button class="dropbtn">Options</button>
            <div class="dropdown-content">
              <a href="/call">Call Options</a>
              <a href="/silentcall">Silent Call Options</a>
              <a href="/tokenizedcall">Tokenized Call Options</a>
            </div>
          </div>
        </li>
        <li>
          <div class="dropdown">
            <button class="dropbtn">Forwards</button>
            <div class="dropdown-content">
              <a href="/forward">Forwards</a>
              <a href="/portfolio">Forward Portfolios</a>
              <a href="/managedforward">Managed Forwards</a>
            </div>
          </div>
        </li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
);

export default Header;
