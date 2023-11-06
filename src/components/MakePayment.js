import React, { Component } from 'react';
import { Card, Input, Button } from 'antd';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';

export class MakePayment extends Component {
  static displayName = MakePayment.name;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }

  render() {

    let {
      goToSignCardLink,
      redeemWithVoucherCode,
    } = this.props;

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent:'center' }} >
        <Card
          className={'make-payment-card'}
        >
          <LocalActivityIcon />
          <p>Use Voucher Code</p>
          <Input />
          <Button className={'make-payment-buy-button'} onClick={() => redeemWithVoucherCode()}>Redeem</Button>
        </Card>
        <Card
          className={'make-payment-card'}
          onClick={() => goToSignCardLink()}
        >
          <ShoppingCartTwoToneIcon />
          <p>1 Card</p>
          <div className={'price-normal'}>USD$ 2.50</div>
          <Button className={'make-payment-buy-button'} onClick={() => goToSignCardLink()}>Buy</Button>
        </Card>
        {/**
          <Card
            className={'make-payment-card'}
            onClick={() => goToSignCardLink()}
          >
            <ShoppingCartTwoToneIcon />
            <p>5 Cards</p>
            <div className={'price-before'}>USD$ 12.50</div>
            <div className={'price-after'}>USD$ 10.00</div>
            <Button className={'make-payment-buy-button'} onClick={() => goToSignCardLink()}>Buy</Button>
          </Card>
          <Card
            className={'make-payment-card'}
            onClick={() => goToSignCardLink()}
          >
            <ShoppingCartTwoToneIcon />
            <p>10 Cards</p>
            <div className={'price-before'}>USD$ 25.00</div>
            <div className={'price-after'}>USD$ 15.00</div>
            <Button className={'make-payment-buy-button'} onClick={() => goToSignCardLink()}>Buy</Button>
          </Card>
        */}
      </div>
    );
  }
}
