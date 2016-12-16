import React, {PureComponent, PropTypes} from 'react'
import {Router, Route, browserHistory} from 'react-router'
import Async from 'react-promise'
import cookie from 'react-cookie'
import ReactGA from 'react-ga'
import Analytics from 'AnalyticTools'

import Config from 'Config'

// Our Pages
import Splash from 'pages/Splash'
import Editor from 'pages/editor/Editor'
import Site from 'pages/site/Site'


class EditorContainer extends PureComponent {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    route: PropTypes.shape ({
      siteId: PropTypes.string
    })
  }

  render() {
    const {siteId} = this.props.route
    return (
      <Async
        promise={App.getSite(siteId)}
        then={(site) =>
          <Editor site={site} siteId={siteId}/>
        }>
      </Async>
    )
  }
}

class SiteContainer extends PureComponent {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    route: PropTypes.shape ({
      siteId: PropTypes.string
    })
  }

  render() {
    const {siteId} = this.props.route
    return (
      <Async
        promise={App.getSite(siteId)}
        then={(site) =>
          <Site site={site} />
        }>
      </Async>
    )
  }
}

export default class App extends PureComponent{
  constructor(props){
    super(props)
    ReactGA.initialize('UA-89083060-1', {
      'cookieDomain': 'none'
    })
  }

  getRouter = () => {
    let names = window.location.host.split('.')
    names = names[0] === ('www') ? names.slice(1) : names // trim www

    if (Config.subhosts.indexOf(names.slice(1).join('.')) >= 0)
      // Sub host (club site)
      return (
        <Router history={browserHistory} onUpdate={Analytics.logPageView}>
          <Route siteId={names[0]} component={SiteContainer} path="/" />
          <Route siteId={names[0]} component={EditorContainer} path="/edit"/>
        </Router>
      )
    else
      // Main host (clubhub site)
      return (
        <Router history={browserHistory} onUpdate={Analytics.logPageView}>
          <Route component={Splash} path="/"/>
        </Router>
      )
  }

  static getSite = (siteId) => {
    const request = new Request(
      `http://${Config.server}/api/site/${siteId}`,
      {
        method: 'GET',
        headers: {
          'authorization': cookie.load('authorization'),
          'Temporary-Key': cookie.load('Temporary-Key')
        }
      }
    )
    return Promise.resolve(fetch(request).then((response) => {
      return response.json().then((content) => {
        return content
      })
    }))
  }

  render() {
    return (this.getRouter())
  }
}
