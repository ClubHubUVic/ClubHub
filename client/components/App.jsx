import React, {PureComponent} from 'react'
import {Router, Route, browserHistory} from 'react-router'

// Our Pages
import Splash from 'pages/Splash'
import Editor from 'pages/Editor'
import Site from 'templates/Site'

export default class App extends PureComponent{
  constructor(props){
    super(props)
  }

  // TODO: implement data object retrieval from DB
  // TODO: handle case where user does not yet have a site (supply default data)
  getSite = () => {
    return {
      'title': 'UVic Canoe Club',
      'theme': 'Classic',
      'sections': {
        'hero': {
          'component': 'Hero',
          'title': 'Our Club',
          'button-a': {
            'type': 'email',
            'content': 'Hi'
          }
        },
        'headers': {
          'nonsense': 'nonsense'
        },
        'footer': {
          'nonsense': 'nonsense'
        }
      }
    }
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Splash}/>
        <Route path="/editor/:site" site={this.getSite()} component={Editor}/>
        <Route path="/site/:site" site={this.getSite()} component={Site}/>
      </Router>
    )
  }
}
