import React from 'react';
import 'whatwg-fetch';
import { PointTable } from './pointTable.jsx';

export class CountryPoints extends React.Component {

    constructor(props) {
        super(props);

        this.mapTypeChange = this.mapTypeChange.bind(this);
        this.state = {
            points: [],
            country: undefined,
            mapPoints: 'juryPoints'
        };
    }

    componentDidMount() {
        fetch('points.json')
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    points: json
                });
            });
    }

    showCountry(country) {
        const points = this.state.points[country];

        this.setState({ country });
        this.props.setMapPoints(country, points[this.state.mapPoints]);
    }

    mapTypeChange(event) {
        const points = this.state.points[this.state.country];

        this.setState({ mapPoints: event.target.value });
        this.props.setMapPoints(this.state.country, points[this.state.mapPoints]);
    }

    render() {
        if (!this.state.country) {
            return <div>Valitse maa kartalta.</div>;
        }

        return (
          <div>
            <h3>{this.state.country}</h3>

            Näytä kartalla:<br />
            <label>
              <input
                className="point-type" type="radio" name="point-type"
                checked={this.state.mapPoints === 'juryPoints'} value="juryPoints" onChange={this.mapTypeChange}
              />
              Tuomaristo
            </label>
            <label>
              <input
                className="point-type" type="radio" name="point-type"
                checked={this.state.mapPoints === 'televotePoints'} value="televotePoints" onChange={this.mapTypeChange}
              />
              Puhelinäänestys
            </label>

            <div className="row">
                <div className="col-sm-6">
                    <h4>Tuomariston pisteet</h4>

                    <table className="table jury-table">
                        <PointTable points={this.state.points[this.state.country].juryPoints} />
                    </table>
                </div>
                <div className="col-sm-6">
                    <h4>Puhelinäänestyksen pisteet</h4>

                    <table className="table televote-table">
                        <PointTable points={this.state.points[this.state.country].televotePoints} />
                    </table>
                </div>
            </div>
          </div>
        );
    }
}

CountryPoints.propTypes = {
    setMapPoints: React.PropTypes.func.isRequired
};
