import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import MainPage from './components/MainPage/MainPage';
import Register from './components/Register';

function App() {
  return (
	<Router>
		<Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route exact path="/register">
          <Register/>
          </Route>
        </Switch>
	</Router>
  );
}

export default App;
