// src/app-client.js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

// import Layout from './components/Layout';
import IndexPage from './components/IndexPage.jsx';
import ChatUI from './components/ChatUI.jsx';
import PageNotFound from './components/PageNotFound.jsx';


const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route path="/discuss" component={ChatUI} />
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
