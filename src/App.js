import { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import authContext from "./store/auth-context";

function App() {
  const authCtx = useContext(authContext);

  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={() => <HomePage />} />
        {!authCtx.isLoggedIn && (
          <Route path="/auth" component={() => <AuthPage />} />
        )}
        <Route path="/profile">
          {authCtx.isLoggedIn && <UserProfile />}
          {!authCtx.isLoggedIn && <Redirect to="auth" />}
        </Route>
        <Route path="*" component={() => <Redirect to="/" />} />
      </Switch>
    </Layout>
  );
}

export default App;
