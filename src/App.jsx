import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import { useContext, useEffect } from "react";
import PageLayout from "./PageLayout";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import TwitDetail from "./pages/TwitDetail";
import { UserContext } from "./contexts/UserContext";

function App() {
  const { isAuthenticated, token, setUser } = useContext(UserContext);

  useEffect(() => {
    // Token varsa kullanıcı bilgilerini yükle
    if (token) {
      // User bilgisini local storage'dan alıp state'e yükleyebiliriz veya API'dan çekebiliriz
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [token, setUser]);

  // Kullanıcı giriş yapmadıysa, login veya signup ekranına erişim izni ver
  // Giriş yapan kullanıcılar login veya signup ekranlarına erişirse ana sayfaya yönlendir
  
  return (
    <div>
      <Switch>
        <Route path="/login">
          {isAuthenticated ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route path="/signup">
          {isAuthenticated ? <Redirect to="/" /> : <Signup />}
        </Route>

        <Route path="/" exact>
          {!isAuthenticated ? <Redirect to="/login" /> : (
            <PageLayout>
              <Home />
            </PageLayout>
          )}
        </Route>
        <Route path="/profile/:nick">
          {!isAuthenticated ? <Redirect to="/login" /> : (
            <PageLayout>
              <Profile />
            </PageLayout>
          )}
        </Route>
        <Route path="/detail/:twitId">
          {!isAuthenticated ? <Redirect to="/login" /> : (
            <PageLayout>
              <TwitDetail />
            </PageLayout>
          )}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
