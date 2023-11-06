import React, { Component } from 'react';
import { Select, Input, Space, Button, Image, message } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined, HeartFilled } from '@ant-design/icons';
import { SeedMessages } from '../utilities/TestMessages';

export class Template extends Component {
  static displayName = Create.name;

  constructor(props) {
    super(props);
    this.state = {
    };

  }


  componentDidMount() {

  }

  render() {
    let {

    } = this.state;

    return (
      <div className={'canvas'}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }} >

        </div>
      </div>
    );
  }
}
