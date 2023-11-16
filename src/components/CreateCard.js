import React, { Component } from 'react';
import { Upload, Menu, Image, Space, Button, Input, DatePicker, TimePicker, Select, QRCode, message, Steps, Radio } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeftOutlined, ShoppingCartOutlined, CopyOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { MakePayment } from './MakePayment';
import { Categories } from '../utilities/ImageStore'
import { TimezonesString } from '../utilities/Timezones'
import { AWS_API_GATEWAY_UPLOAD_IMAGE_URL } from '../utilities/Constants'
import { 
  AWS_CF_HOST_NAME,
  AWS_CF_GET_CARDS_CATALOG_URL,
  AWS_CF_CREATE_CARD_URL,
  AWS_CF_GET_ORIGINALS_URL,
  AWS_CF_GET_THUMBNAILS_URL
 } from '../utilities/Constants'
import moment from 'moment-timezone';

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
      uploadFileList: [],
      isUploading: false,
      uploadAccessType: 'Public',
      uploadCategoryType: 'All',
      cardsCatalog: [],
      cardsCatalogIsLoading: true
    };

  }

  componentDidMount = async () => {
    await this.getCatalog();
  }

  getCatalog = async () => {
    this.setState({
      cardsCatalogIsLoading: true
    });
    await fetch(`${AWS_CF_HOST_NAME}/${AWS_CF_GET_CARDS_CATALOG_URL}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    }).then(async res => {
      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        this.setState({
          cardsCatalog: data
        });
      }
      this.setState({
        cardsCatalogIsLoading: false
      });
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

  setUploadFileList = (list) => {
    this.setState({uploadFileList: list});
  }
  setUploadAccessType = (e) => {
    this.setState({uploadAccessType: e.target.value})
  }
  setUploadCategoryType = (val) => {
    console.log(val)
    this.setState({uploadCategoryType: val})
  }
  setIsUploading = (val) => {
    this.setState({isUploading: val});
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
    const selectedCategory = Categories()[categoryIndex - 1];
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
      imageKey: cardImage.cardkey,
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

    //console.log('Card To Post', card)

    await fetch(`${AWS_CF_HOST_NAME}/${AWS_CF_CREATE_CARD_URL}`, {
      method: 'POST',
      body: JSON.stringify(card),
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

  onFileRemove = (file) => {

    console.log('onFileRemove: ', file);

    //let {
    //  uploadFileList
    //} = this.state;
    //const index = uploadFileList.indexOf(file);
    //const newFileList = uploadFileList.slice();
    //newFileList.splice(index, 1);
    //this.setUploadFileList(newFileList);
    this.setUploadFileList([]);
  }

  beforeFileUpload = (file) => {
    console.log('beforeFileUpload: ', file);
    //this.setUploadFileList([...this.state.uploadFileList, file]);
    this.setUploadFileList([file]);
    return false; // return false to prevent auto-upload
  }

  handleFileUpload = async () => {
    let {
      uploadFileList
    } = this.state;
    const formData = new FormData();

    // even though this is a list, there will only be one file uploaded at a time
    uploadFileList.forEach((file) => {
      formData.append('files[]', file);
    });
    this.setIsUploading(true);

    let fileAccessType = this.state.uploadAccessType;
    let fileCategory = this.state.uploadCategoryType;
    let fileUniqueId = uuidv4();
    let fileName = uploadFileList[0].name;
    let fileType = uploadFileList[0].type;
    
    let file_upload_url = AWS_API_GATEWAY_UPLOAD_IMAGE_URL.replace("{filename}", `${fileAccessType}-${fileCategory}-${fileUniqueId}-${fileName}`);
    console.log('File Information', uploadFileList[0])
    console.log('File Upload URL', file_upload_url)
   
    await fetch(file_upload_url, {
      method: 'PUT',
      body: uploadFileList[0],
      headers: {
        "Content-type": fileType
      }
    })
      .then(async res => {
        console.log("uploadresult", await res.json());
      })
      .then(() => {
        this.setUploadFileList([]);
        message.success('upload successfully.');
      })
      .catch(() => {
        message.error('upload failed.');
      })
      .finally(() => {
        this.setIsUploading(false);
      });
  }

  render() {
    let {
      stage,
      categorySelected,
      cardImage,
      signcardid,
      uploadFileList,
      isUploading,
      uploadAccessType,
      cardsCatalog,
      cardsCatalogIsLoading
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
            {
              cardsCatalogIsLoading? 
                <LoadingOutlined />
                :
                <div style={{ display: 'flex', flexWrap: 'wrap' }} >
                  {
                    (categorySelected === 'Upload')?
                        <div style={{width: '100%', marginLeft: '10px'}}>
                          <div style={{marginBottom: '15px'}}>
                            <Upload 
                              onRemove={(file) => this.onFileRemove(file)}
                              beforeUpload={(file) => this.beforeFileUpload(file)}
                              fileList={uploadFileList}
                              >
                              <Button icon={<UploadOutlined />}>Select File</Button>
                            </Upload>
                          </div>
                          <div style={{marginBottom: '15px'}}>
                            <Radio.Group onChange={this.setUploadAccessType} value={uploadAccessType}>
                              <Radio value={'Private'}>Private</Radio>
                              <Radio value={'Public'}>Public</Radio>
                            </Radio.Group>
                          </div>
                          <div style={{marginBottom: '15px'}}>
                            <Select
                              placeholder="Select a Category"
                              onChange={this.setUploadCategoryType}
                              options={Categories().filter(x => x.label !== 'Upload').map(cat => ({
                                label: cat.label,
                                value: cat.label
                              }))}
                            />
                          </div>
                          <div style={{marginBottom: '15px'}}>
                            <Button
                                type="primary"
                                onClick={() => this.handleFileUpload()}
                                disabled={uploadFileList.length === 0}
                                loading={isUploading}
                                style={{
                                  marginTop: 16,
                                }}
                              >
                                {isUploading ? 'Uploading' : 'Start Upload'}
                              </Button>
                          </div>
                        </div>
                      : ""
                  }
                  {
                    (
                      categorySelected !== 'Upload' ? 
                        (categorySelected !== 'All' ? cardsCatalog.filter(x => x.category === categorySelected) : cardsCatalog).map(card =>
                            <div
                              key={card.cardkey}
                              className={'create-card-tile'}
                              style={{ backgroundColor: card.backgroundColor }}
                              onClick={() => this.selectCardImage(card)}
                            >
                              <Image src={AWS_CF_HOST_NAME + "/" + AWS_CF_GET_THUMBNAILS_URL + "/" + card.path} preview={false} />
                            </div>
                        )
                      : ""
                    )
                  }
                </div>
            }

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
                        return moment().add(-1, 'days') >= current ||
                          moment().add(3, 'month') <= current;
                      }}
                    />
                    <TimePicker 
                      minuteStep={5} 
                      secondStep={60} 
                      disabled={stage !== 'filldetails'} 
                      showNow={false} 
                      onChange={this.setSendTime} 
                    />
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
              <Image src={ AWS_CF_HOST_NAME + "/" + AWS_CF_GET_ORIGINALS_URL + "/" +  cardImage.path} preview={false} />
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
              Your card is successfully created. Share the link below!
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
              <a href={ './#/sign/' + signcardid } target='_blank' rel="noreferrer">{ AWS_CF_HOST_NAME + '/#/sign/' + signcardid }</a>
              <Button icon={<CopyOutlined />} shape={'circle'} style={{marginLeft:'5px'}} disabled/>
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
              <QRCode
                value={ AWS_CF_HOST_NAME + '/#/sign/' + signcardid }
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
