import React from "react"

import { Redirect, Route, Switch } from "react-router-dom"

import Dashboard from "../dashboard/Dashboard"
import NewReservation from "../reservations/NewReservation"
import NewTable from "../tables/NewTable"
import NotFound from "./NotFound"

import { today } from "../utils/date-time"
import useQuery from "../utils/useQuery"

/**
 * Defines all the routes for the application.
 *
 * @returns {JSX.Element}
 */

export default function Routes() {
  const query = useQuery()
  const queryResult = query.get("date") || today()
  // console.log("Query: ", queryResult)

  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={queryResult} />
      </Route>
      <Route path="/reservations/new">
        <NewReservation />
      </Route>
      <Route path="/tables/new">
        <NewTable />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}
