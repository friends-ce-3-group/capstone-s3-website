import React, { Component } from 'react';
import { } from 'antd';
import { } from '@ant-design/icons';
import moment from 'moment-timezone';

export class CountDown extends Component {
  static displayName = CountDown.name;

  constructor(props) {
    super(props);
    this.state = {
      days: 0,
      hours: 0,
      mins: 0,
      seconds:0
    };

  }


  componentDidMount() {
    this.calculateRemainingTime()
    setInterval(this.calculateRemainingTime, 1000)
  }

  calculateRemainingTime = () => {
    const DAY_IN_MILLISECONDS = 86400000;
    const HOUR_IN_MILLISECONDS = 3600000;
    const MINUTE_IN_MILLISECONDS = 60000;
    const SECOND_IN_MILLISECONDS = 1000;

    let remainingTime = moment(this.props.endTime) - moment()

    let days = Math.floor(remainingTime / DAY_IN_MILLISECONDS);
    let remainingMilliseconds = remainingTime % DAY_IN_MILLISECONDS;

    let hours = Math.floor(remainingMilliseconds / HOUR_IN_MILLISECONDS);
    remainingMilliseconds = remainingMilliseconds % HOUR_IN_MILLISECONDS;

    let minutes = Math.floor(remainingMilliseconds / MINUTE_IN_MILLISECONDS);
    remainingMilliseconds = remainingMilliseconds % MINUTE_IN_MILLISECONDS;

    let seconds = Math.floor(remainingMilliseconds / SECOND_IN_MILLISECONDS);
    remainingMilliseconds = remainingMilliseconds % SECOND_IN_MILLISECONDS;

    this.setState({
      days: days,
      hours: hours,
      mins: minutes,
      seconds: seconds
    });
  }

  reduceByOneSecond = () => {
    this.calculateRemainingTime();
  }

  render() {
    let {
      days,
      hours,
      mins,
      seconds
    } = this.state;

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent:'center' }} >
        {`Ends in: ${days} days ${hours} hours ${mins} mins ${seconds} seconds`}
      </div>
    );
  }
}
