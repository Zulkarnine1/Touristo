import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
// import Users from "./user/pages/Users";
// import NewPlaces from "./places/pages/NewPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
// import UserPlaces from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlaces";
// import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const Users = React.lazy(() => {
  return import("./user/pages/Users");
});

const NewPlaces = React.lazy(() => {
  return import("./places/pages/NewPlaces");
});

const UserPlaces = React.lazy(() => {
  return import("./places/pages/UserPlaces");
});

const UpdatePlace = React.lazy(() => {
  return import("./places/pages/UpdatePlaces");
});

const Auth = React.lazy(() => {
  return import("./user/pages/Auth");
});

// Palette 252793
const App = () => {
  const { token, login, logout, userId } = useAuth();
  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlaces />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace />
        </Route>
        <Redirect to="/"></Redirect>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth"></Redirect>
      </Switch>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token: token, userID: userId, login: login, logout: logout }}>
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
