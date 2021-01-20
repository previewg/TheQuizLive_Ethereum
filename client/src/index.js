import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// Redux
// import rootReducer from "reducers/index";
// import { Provider } from "react-redux";
// import { applyMiddleware, createStore } from "redux";
// import ReduxThunk from "redux-thunk";
// import { composeWithDevTools } from "redux-devtools-extension";

// Pages
import { Home, About, SignIn, SignUp } from "pages";
import { NavBar } from "components";

// Common components

// HOC

// const store = createStore(
//   rootReducer,
//   composeWithDevTools(applyMiddleware(ReduxThunk))
// );

ReactDOM.render(
  <BrowserRouter>
    <NavBar />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
      <Route exact path="/signIn" component={SignIn} />
      <Route exact path="/signUp" component={SignUp} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
