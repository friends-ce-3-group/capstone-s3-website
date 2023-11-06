import React, { Component } from 'react';
import { Upload, Menu, Image, Space, Button, Input, DatePicker, TimePicker, Select, QRCode, message, Steps } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeftOutlined, ShoppingCartOutlined, CopyOutlined, InboxOutlined } from '@ant-design/icons';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { MakePayment } from './MakePayment';
import { ImageStore, Categories } from '../utilities/ImageStore'
import { TimezonesString } from '../utilities/Timezones'
import { AWS_S3_STATIC_HOST, AWS_API_GATEWAY, AWS_API_GATEWAY_CARDS_FUNCTION, AWS_API_GATEWAY_CARDS_TABLE } from '../utilities/Constants'
import moment from 'moment-timezone';
const { Dragger } = Upload;
const props = {
  name: 'file',
  multiple: false,
  action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

export class CreateCard extends Component {
  static displayName = CreateCard.name;

  constructor(props) {
    super(props);
    this.state = {
      stage: 'selectcard', // 0:selectcard -> 1:filldetails -> 2:makepayment --> 3:signcard
      categorySelected: 'All',
      cardImage: null,
      recipientName: '',
      recipientEmail: '',
      senderName: '',
      senderEmail: '',
      sendDate: '',
      sendTime: '',
      sendTimezone: '',
      signcardid: '',
    };

  }

  componentDidMount() {
    this.setState({
      
    });
  }

  getStepIndex = () => {
    switch(this.state.stage) {
      case 'selectcard': return 0;
      case 'filldetails': return 1;
      case 'makepayment': return 2;
      case 'signcard': return 3;
      default: return 0;
    }
  }

  setRecipientName = (val) => {
    this.setState({ recipientName: val })
  }
  setRecipientEmail = (val) => {
    this.setState({ recipientEmail: val })
  }
  setSenderName = (val) => {
    this.setState({ senderName: val })
  }
  setSenderEmail = (val) => {
    this.setState({ senderEmail: val })
  }
  setSendDate = (val, dateString) => {
    this.setState({ sendDate: dateString })
  }
  setSendTime = (val, timeString) => {
    this.setState({ sendTime: timeString })
  }
  setSendTimezone = (val) => {
    this.setState({ sendTimezone: val })
  }

  setSelectedCategory = (categoryIndex) => {
    console.log('categoryIndex', categoryIndex);
    const selectedCategory = Categories()[categoryIndex - 1];
    console.log('selectedCategory', selectedCategory);
    this.setState({ categorySelected: selectedCategory.label });
  }

  selectCardImage = (card) => {
    this.setState({
      stage: 'filldetails',
      cardImage: card
    });
  }

  backToSelectCard = () => {
    this.setState({
      stage: 'selectcard',
      cardImage: null
    });
  }

  backToFillDetails = () => {
    this.setState({
      stage: 'filldetails'
    });
  }

  goToPayment = () => {
    const {
      cardImage,
      recipientName,
      recipientEmail,
      senderName,
      senderEmail,
      sendDate,
      sendTime,
      sendTimezone
    } = this.state;
    if (!cardImage) { message.error('Card image is required'); return; }
    if (!recipientName) { message.error('Recipient name is required'); return; }
    if (!recipientEmail) { message.error('Recipient email is required'); return; }
    if (!senderName) { message.error('Sender name is required'); return; }
    if (!senderEmail) { message.error('Sender email is required'); return; }
    if (!sendDate) { message.error('Send date is required'); return; }
    if (!sendTime) { message.error('Send time is required'); return; }
    if (!sendTimezone) { message.error('Send timezone is required'); return; }
    this.setState({
      stage: 'makepayment'
    });
  }

  goToSignCardLink = async () => {

    //[TODO]: communicate with STRIPE to get success/unsuccessful status
    await this.insertCard();
  }

  insertCard = async () => {
    const {
      cardImage,
      recipientName,
      recipientEmail,
      senderName,
      senderEmail,
      sendDate,
      sendTime,
      sendTimezone
    } = this.state;

    const id = uuidv4()

    const card = {
      id: id,
      imageKey: cardImage.key,
      imageCategory: cardImage.category,
      imagePath: cardImage.path,
      imageBackgroundColor: cardImage.backgroundColor,
      recipientName: recipientName,
      recipientEmail: recipientEmail,
      senderName: senderName,
      senderEmail: senderEmail,
      sendDate: sendDate,
      sendTime: sendTime,
      sendTimezone: sendTimezone,
      createdDataTime: Date.now()
    }

    const cardObjectForLambda = {
      TableName: `${AWS_API_GATEWAY_CARDS_TABLE}`,
      Item: card
    }

    await fetch(`${AWS_API_GATEWAY}/${AWS_API_GATEWAY_CARDS_FUNCTION}`, {
      method: 'POST',
      body: JSON.stringify(cardObjectForLambda),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    }).then(async res => {
      if (res.status === 200) {
        this.setState({
          stage: 'signcard',
          signcardid: id
        });
      } else {
      }
    });
  }

  redeemWithVoucherCode = async () => {

    //[TODO]: communicate with backend to see if voucher code is valid
    await this.insertCard();
  }

  render() {
    let {
      stage,
      categorySelected,
      cardImage,
      signcardid
    } = this.state;

    return (
      <div className={'canvas'}>
        <Steps
          className={'create-card-steps-flow'}
          size="small"
          current={this.getStepIndex()}
          items={[
            {
              title: 'Select Card',
            },
            {
              title: 'Fill Details',
            },
            {
              title: 'Payment',
            },
            {
              title: 'Ready to Sign',
            },
          ]}
        />
        {stage === 'selectcard' ?
          <div style={{ display: 'flex' }} >
            <Menu
              items={Categories()}
              onClick={(e) => this.setSelectedCategory(e.key)}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap' }} >
              {
                (categorySelected === 'Upload')?
                    <div style={{width: '100%'}}>
                      <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag an image file to this area to upload</p>
                        <p className="ant-upload-hint">
                          
                        </p>
                      </Dragger>
                    </div>
                  : ""
              }
              {
                (
                  categorySelected !== 'Upload' ? 
                    (categorySelected !== 'All' ? ImageStore().filter(x => x.category === categorySelected) : ImageStore()).map(card =>
                        <div
                          key={card.key}
                          className={'create-card-tile'}
                          style={{ backgroundColor: card.backgroundColor }}
                          onClick={() => this.selectCardImage(card)}
                        >
                          <Image src={card.path} preview={false} />
                        </div>
                    )
                  : ""
                )
              }
            </div>
          </div>
          : ""
        }
        {stage==='filldetails' || stage==='makepayment' || stage==='signcard' ?
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div>
              <div>
                <div className={'create-card-form-text'}>
                  Who is this card for?
                  <Input placeholder={'Recipient Name'} disabled={stage !== 'filldetails'} onChange={(e) => this.setRecipientName(e.target.value) } />
                  <Input placeholder={'Recipient Email Address. One only.'} style={{ marginTop: '10px' }} disabled={stage !== 'filldetails'} onChange={(e) => this.setRecipientEmail(e.target.value)} />
                </div>
                <div className={'create-card-form-text'}>
                  Who is this card from?
                  <Input placeholder={"Sender / Organization's Name"} disabled={stage !== 'filldetails'} onChange={(e) => this.setSenderName(e.target.value)} />
                  <Input placeholder={"Sender Email Address. To receive receipts."} style={{ marginTop: '10px' }} disabled={stage !== 'filldetails'} onChange={(e) => this.setSenderEmail(e.target.value)} />
                </div>
                <div className={'create-card-form-text'}>
                  <p>When should we send this card?</p>
                  <Space>
                    <DatePicker
                      disabled={stage !== 'filldetails'}
                      onChange={this.setSendDate}
                      disabledDate={(current) => {
                        return moment().add(1, 'days') >= current ||
                          moment().add(3, 'month') <= current;
                      }}
                    />
                    <TimePicker minuteStep={60} secondStep={60} disabled={stage !== 'filldetails'} showNow={false}  onChange={this.setSendTime} />
                    <Select
                      style={{ width: 150 }}
                      options={TimezonesString()}
                      placeholder={'Select timezone'}
                      popupMatchSelectWidth={false}
                      disabled={stage !== 'filldetails'}
                      onChange={this.setSendTimezone}
                    />
                  </Space>
                </div>
              </div>
              {
                stage === 'filldetails' ?
                  <Space className={'card-input-area-item'} wrap>
                    <Button
                      type={'primary'}
                      className={'form-button-back'}
                      onClick={() => this.backToSelectCard()}
                      icon={<ArrowLeftOutlined className={'form-button-icon'} />}
                    >
                      Choose A Different Card
                    </Button>
                    <Button
                      type={'primary'}
                      className={'form-button-forward'}
                      onClick={() => this.goToPayment()}
                      icon={<ShoppingCartOutlined className={'form-button-icon'} />} disabled={false}
                    >
                      Continue
                    </Button>
                  </Space>
                  :""
              }
            </div>
            <div
              className={'create-card-preview'}
              style={{ backgroundColor: cardImage.backgroundColor }}
            >
              <Image src={cardImage.path} preview={false} />
            </div>
          </div>
          : ''
        }
        {stage === 'makepayment' ?
          <div className={'make-payment-area'}>
            <MakePayment goToSignCardLink={this.goToSignCardLink} redeemWithVoucherCode={this.redeemWithVoucherCode} />
            <Button type={'primary'} className={'form-button-back'} style={{marginTop: '20px'}} onClick={() => this.backToFillDetails()} icon={<ArrowLeftOutlined className={'form-button-icon'} />}>Go Back</Button>
          </div>
          : ''
        }
        {stage === 'signcard' ?
          <div className={'sign-card-link-area'}>
            <div style={{ paddingTop: '20px', marginBottom: '10px' }} >
              Your card is successully created. Share the link below!
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
              <a href={ './#/sign/' + signcardid } target='_blank' rel="noreferrer">{ AWS_S3_STATIC_HOST + '/#/sign/' + signcardid }</a>
              <Button icon={<CopyOutlined />} shape={'circle'} style={{marginLeft:'5px'}} />
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
              <QRCode
                value={ AWS_S3_STATIC_HOST + '/#/sign/' + signcardid }
              />
            </div>
            <Button
              type={'primary'}
              className={'form-button-back'}
              style={{ marginTop: '20px', marginBottom:'10px' }}
              onClick={() => { }}
              icon={<ReceiptIcon className={'form-button-icon'}
              />}>View Receipt</Button>            
          </div>
          : ''
        }
      </div>
    );
  }
}
