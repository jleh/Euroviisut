import React from 'react';
import { orderBy } from 'lodash';
import * as countryData from '../countryData';

export class PointTable extends React.Component {

    render() {
        const points = orderBy(this.props.points, 'points', 'desc');

        return (
            <tbody>
            {points.map((point, i) => {
                const flag = `flag-icon flag-icon-${countryData[point.country]}`;
                return (
                    <tr key={i}>
                        <td className="points-{i} point-color"></td>
                        <td><span className={flag}></span></td>
                        <td>{point.country}</td>
                        <td>{point.points}</td>
                    </tr>
                );
            })}
            </tbody>
        );
    }

}

PointTable.propTypes = {
    points: React.PropTypes.array.isRequired
};
