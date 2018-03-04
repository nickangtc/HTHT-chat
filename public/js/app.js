// src/app-client.js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import IndexPage from './components/page-index.jsx';
import ChatApp from './components/app-chat.jsx';
import Page404 from './components/page-404.jsx';


const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route path="/discuss" component={ChatApp} />
      </Switch>
    </div>
  );
}

window.onload = () => {
  ReactDOM.render((
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ), document.getElementById('root'));
};
