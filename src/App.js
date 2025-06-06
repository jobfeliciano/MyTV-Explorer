import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Popular from "./pages/Popular";
import Search from "./pages/Search";
import Categories from "./pages/Categories";
import ShowDetails from "./pages/ShowDetails";
import ActorDetails from "./pages/ActorDetails";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";


const App = () => {
    return (
        <BrowserRouter>
           <Switch>
            <Route path="/inscription" exact component={Inscription} />
            <Route path="/login" exact component={Connexion} />
            <Route path="/" exact component={Popular} />
            <Route path="/favorites" exact component={Favorites} />
            <Route path="/search" exact component={Search} />
            <Route path="/categories" exact component={Categories} />
            <Route path="/showDetails" exact component={ShowDetails} />
            <Route path="/actorDetails" exact component={ActorDetails} />
            <Route exact component={NotFound} />
           </Switch>
        </BrowserRouter>
    )
}

export default App;