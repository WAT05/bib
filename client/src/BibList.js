import React, { Component } from 'react';
import Bib from './Bib.json';
import './BibList.css';

class BibList extends Component {

    constructor(props) {
        super(props);

        this.withMR = props.withMR;
    }

    render() {
        if (this.withMR) {
            return (
                <div>
                    <center><h1> Bib Gourmand x Maitres Restaurateurs </h1></center>
                    {Bib.map((bibDetail, index) => {
                        if (bibDetail.maitre) {
                            return <div class="card">
                                <a href={bibDetail.website}>
                                    <img class="img" src={bibDetail.image} style={{ width: 100 + '%' }} />
                                    <h1 class="name">{bibDetail.name}</h1>
                                </a>
                                <p class="address">{bibDetail.adress}</p>
                                <p>{bibDetail.phone}</p>
                                <br />
                            </div>
                        }
                    })}

                </div>
            );
        }
        else {
            return (
                <div>
                    <center><h1> Bib Gourmand </h1></center>
                    {Bib.map((bibDetail, index) => {
                        return <div class="card">
                            <a href={bibDetail.website}>
                                <img class="img" src={bibDetail.image} style={{ width: 100 + '%' }} />
                                <h1 class="name">{bibDetail.name}</h1>
                            </a>
                            <p class="address">{bibDetail.adress}</p>
                            <p>{bibDetail.phone}</p>
                            <br />
                        </div>
                    })}

                </div>
            );
        }
    };
}

export default BibList;