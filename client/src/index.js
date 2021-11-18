import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch} from "react-router-dom";

// Pages
import {About, Home, Info, Quiz, RestrictedRoute, SignIn, SignUp} from "pages";

// Common components
import {NavBar} from "components";

// HOC
// Redux
import rootReducer from "reducers/index";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import ReduxThunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(ReduxThunk))
);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <NavBar/>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/about" component={About}/>
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
                />
                <RestrictedRoute
                    exact
                    path="/info"
                    component={Info}
                    fallback={SignIn}
                />
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
);
