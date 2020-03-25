import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import logoBibVitruve from './assets/Vitruve-bib.png';
import logoBib from './assets/bib.png';
import logoMaitres from './assets/Maitres.png';
import logoBIBxMaitres from './assets/Bib_x_MR.png';


import './App.css';
import BibList from './BibList.js';

class App extends Component {

  constructor(props) {
    super(props);

    this.Onglet_Bib = React.createRef();
    this.Onglet_BibxMR = React.createRef();
    this.Onglet_About = React.createRef();

    this.OngletOnClick = this.OngletOnClick.bind(this);

    this.state = {selected  : "Bib"};
  }

  setOnglet (onglet) {
    this.setState({selected  : onglet})
    this.props.onChangeFilter(onglet);
  }

  isActive (value){
    return ((value === this.state.selected) ?'active':'');
  }

  OngletOnClick(onglet) {
    ReactDOM.unmountComponentAtNode(document.getElementById('RC'))
    switch(onglet){
      case "Bib":
        ReactDOM.render(<BibList withMR = {false} />, document.getElementById('RC'));
        break;
      case "BibxMR":
        ReactDOM.render(<BibList withMR = {true} />, document.getElementById('RC'));
        break;
      case"About":
        var content = <h3>Programme réalisé par : <div class="style">Tanguy WALRAVE</div></h3>;
        ReactDOM.render(content, document.getElementById('RC'));
        break;
    }
    this.setState({ state: this.state });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <image className="DivLogo">
            <img src={logoBibVitruve} className="App-logoSpin" alt="logo" />
          </image>
          <div className="DivTitle">
            <h3>Welcome to<br />BIB Gourmand x Maitres Restaurateurs</h3>
          </div>
          <div className="DivLogo">
            <img src={logoMaitres} className="App-logo" alt="logo" />
          </div>
        </header>
        <body>
          <ul>
            <li>
              <a ref={this.Onglet_Bib} onClick={() => this.OngletOnClick('Bib')} className={this.isActive('Bib')} href="#bib">
                <div class="Onglet">
                  <img src={logoBib} class="Onglet-img" alt="logo" />
                </div>
              </a>
            </li>
            <li>
              <a ref={this.Onglet_BibxMR} onClick={() => this.OngletOnClick('BibxMR')} className={this.isActive('BibxMR')} href="#bibxmr">
                <div class="Onglet">
                  <img src={logoBIBxMaitres} class="Onglet-img" alt="logo" />
                </div>
              </a>
            </li>
            <li>
              <a ref={this.Onglet_About} onClick={() => this.OngletOnClick('About')} className={this.isActive('About')} href="#about">
                <div class="Onglet">
                  About
              </div>
              </a>
            </li>
          </ul>
          <div id="RC">
          </div>
        </body>
      </div>
    );
  }
}

export default App;
