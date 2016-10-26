import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/Layout';
import IndexPage from './components/IndexPage';
import ChatPage from './components/ChatPage';
import NotFoundPage from './components/NotFoundPage';

const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={IndexPage}/>
    <Route path="discuss/:id" component={ChatPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);

export default routes;
