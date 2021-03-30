import React, { Component, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/navs/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AboutMe from './pages/AboutMe';
import AllAuthors from './pages/AllAuthors';
import PublicPost from './pages/PublicPosts';
import AllFollowers from './pages/AllFollowers';
import AllFriends from './pages/AllFriends';
import AllFollowings from './pages/AllFollowings';
import GitActivities from './pages/GitActivities';
import NotFound from './components/errors/NotFound';
import ErrorBoundary from './components/errors/ErrorBoundary';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <ErrorBoundary>
          <Navbar />
          <Suspense fallback={<div style={{ margin: 10 }}>Loading ...</div>}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/aboutme" component={AboutMe} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/authors" component={AllAuthors} />
              <Route exact path="/author/followers" component={AllFollowers} />
              <Route exact path="/author/friends" component={AllFriends} />
              <Route exact path="/author/followings" component={AllFollowings} />
              <Route exact path="/author/gitactivities" component={GitActivities} />
              <Route exact path="/public" component={PublicPost} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    );
  }
}

export default App;