import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// Pages
import { Home, About, SignIn, SignUp, Quiz, RestrictedRoute } from "pages";

// Common components
import { NavBar } from "components";

// HOC

// Redux
import rootReducer from "reducers/index";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk))
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <RestrictedRoute
          exact
          path="/signIn"
          component={SignIn}
          fallback={Home}
        />
        <RestrictedRoute
          exact
          path="/signUp"
          component={SignUp}
          fallback={Home}
        />
        <RestrictedRoute
          exact
          path="/quiz"
          component={Quiz}
          fallback={SignIn}
          subFallback={Home}
        />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
