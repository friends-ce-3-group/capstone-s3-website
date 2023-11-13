import React, { Component, createRef } from 'react';
import { useParams } from 'react-router-dom'
import { Select, Input, Space, Button, Image, message } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined, HeartFilled, CheckCircleTwoTone } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import { v4 as uuidv4 } from 'uuid';
import 'react-quill/dist/quill.snow.css';
import defaultImage from '../images/farewell1.jpg'
import { Home } from './Home';
import { CountDown } from './CountDown';
import moment from 'moment-timezone';
import { AWS_CF_HOST_NAME, AWS_CF_GET_CARD_URL, AWS_CF_GET_MESSAGES_URL, AWS_CF_SIGN_CARD_URL } from '../utilities/Constants'
const CARD_NARROW_WIDE_THESHOLD = 80;
const CARD_MAX_WORD_COUNT_PER_PAGE = 250;

class SignCard extends Component {
  static displayName = SignCard.name;

  constructor(props) {
    super(props);
    this.state = {
      endTime: moment(),
      addType: 'text', // text | image
      seenPreview: false,
      isFlipped: false,
      isExpired: false,
      isMessageInserted: false,
      cardDetails: null,
      displayEntries: [],
      numPages: 1,
      currPage: 1,
      allEntries: [],
      yourName: '',
      yourEntry: '',

    };

    this.flipCardRef = createRef();
  }


  async componentDidMount() {
    await this.getCardDetails(this.props.params.id);
    await this.getCardMessages(this.props.params.id);
  }

  getCardDetails = async (id) => {
    const url = `${AWS_CF_HOST_NAME}/${AWS_CF_GET_CARD_URL}?cardId=${id}`;
    console.log('url', url);
    await fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    }).then(async res => {
      
      if (res.status === 200) {
        const data = await res.json();
        console.log('data', data);
        if (data.Count > 0) {
          const card = data.Items[0];

          // create countdown timer
          const sendDate = card.sendDate;
          const sendTime = card.sendTime;
          const sendTimezone = card.sendTimezone;

          const endTime = moment.tz(sendDate + " " + sendTime, sendTimezone);
          const nowTime = moment.tz(new Date(), sendTimezone);

          if (nowTime >= endTime) {
            this.setState({isExpired: true});
          }

          this.setState({
            endTime: endTime.format(),
            cardDetails: card,
          });

        } else {
          message.error("Oops. This card was not found.");
        }
      } else {
        message.error("Oops. This card was not found.");
      }
    });
  }

  getCardMessages = async (cardId) => {
    const url = `${AWS_CF_HOST_NAME}/${AWS_CF_GET_MESSAGES_URL}?cardId=${cardId}`;
    console.log('url', url);
    await fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    }).then(async res => {
      if (res.status === 200) {
        const data = await res.json();
        console.log('data', data);
        let entries = [];
        if (data.Count > 0) {
          entries = data.Items;
        }

        let displayEntries = this.createPages(entries);
        this.setState({
          allEntries: entries,
          displayEntries: displayEntries,
          numPages: displayEntries.length,
          currPage: 1
        });
      }
    });
  }

  createPages = (allEntries) => {
    let displayEntries = [];
    let countWords = 0;
    let page = [];
    for (let i = 0; i < allEntries.length; i++) {
      if (countWords + allEntries[i].wordCount > CARD_MAX_WORD_COUNT_PER_PAGE || page.length===10 ) {
        displayEntries.push(page);
        countWords = allEntries[i].wordCount;
        page = [].concat(allEntries[i]);
      } else {
        countWords = countWords + allEntries[i].wordCount;
        page.push(allEntries[i]);
      }
    }
    displayEntries.push(page);
    return displayEntries;
  }

  toggleAddType = () => {
    let type = this.state.addType;
    if (type === 'text') {
      this.setState({ addType: 'image' });
    } else {
      this.setState({ addType: 'text' });
    }
  }

  flipCard = () => {
    let isFlipped = this.state.isFlipped;
    this.setState({isFlipped: !isFlipped});
  }

  flipCardToBack = () => {
    let isFlipped = this.state.isFlipped;
    if (!isFlipped) {
      this.setState({ isFlipped: true });
    }
  }

  setYourName = (val) => {
    this.setState({
      yourName: val
    });
  }

  setValue = (val) => {
    this.setState({
      yourEntry: val
    });
  }

  createEntry = () => {

    const id = uuidv4()
    let entry = {
      id: id,
      cardId: this.props.params.id,
      name: this.state.yourName,
      value: this.state.yourEntry,
      wordCount: this.state.yourEntry.split(' ').length,
      createdDateTime: Date.now,
    }
    return entry;
  }

  seePreview = () => {
    let yourName = this.state.yourName;
    let yourEntry = this.state.yourEntry;
    if (yourName  === '' || yourEntry === '') {
      message.error('Your name and message are required.');
      return;
    }
    if (this.state.allEntries.filter(x => x.name === yourName).length > 0) {
      message.error('A previous entry with similar name exists. Add last name and/or dept name.');
      return;
    }
    let allEntries = this.state.allEntries;
    let newEntry = this.createEntry();
    let displayEntries = this.createPages(allEntries.concat(newEntry));
    this.setState({
      displayEntries: displayEntries,
      seenPreview: true,
      numPages: displayEntries.length,
      currPage: displayEntries.length
    });
    this.flipCardToBack();
  }

  confirmEntry = async () => {
    let newEntry = this.createEntry();

    //save new Message into database
    await fetch(`${AWS_CF_HOST_NAME}/${AWS_CF_SIGN_CARD_URL}`, {
      method: 'POST',
      body: JSON.stringify(newEntry),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    }).then(async res => {
      //console.log('res', await res);
      if (res.status === 200) {
        //const data = await res.json();
        //console.log('InsertedMessage', data);

        let allEntries = this.state.allEntries;
        allEntries.push(newEntry);
        this.setState({
          yourName: '',
          yourEntry: '',
          seenPreview: false,
          allEntries: allEntries,
          isMessageInserted: true,
        });
      } else {
        message.error("Opps! We could not add your message at this moment. Try again later.");
      }
    });
  }

  turnPageRight = () => {
    let currPage = this.state.currPage;
    this.setState({currPage: currPage+1});
  }

  turnPageLeft = () => {
    let currPage = this.state.currPage;
    this.setState({ currPage: currPage - 1 });
  }

  modules = {
    toolbar: [
      [{ 'color': [] }, 'bold', 'italic'],
    ],
  }

  render() {

    let {
      endTime,
      addType,
      numPages,
      currPage,
      cardDetails,
      displayEntries,
      seenPreview,
      isExpired,
      isMessageInserted,
      isFlipped,
      yourName,
      yourEntry,
    } = this.state;

    return (
      <div className={'canvas'}>
        {
          !isExpired && cardDetails ?
            <div style={{ display: 'flex', flexWrap: 'wrap' }} >
              <div>
                <CountDown endTime={endTime} />
                <Flippy
                  flipOnHover={false} // default false
                  flipOnClick={false} // default false
                  flipDirection="horizontal" // horizontal or vertical
                  ref={this.flipCardRef} // to use toggle method like ref.curret.toggle()
                  isFlipped={isFlipped}
                  style={{ width: '500px', height: '700px' }} /// these are optional style, it is not necessary
                >
                  <FrontSide style={{ backgroundColor: '#002744' }}>
                    <div className={'card-canvas'}>
                      <div>
                        <Image src={defaultImage} preview={false} />
                      </div>
                      <div className={'card-footer'}>
                        <Button className={'card-flip-button'} onClick={() => { this.flipCard(); }} >Flip Over</Button>
                      </div>
                    </div>
                  </FrontSide>
                  <BackSide className={'card-board'}>
                    <div style={{ display: 'flex', height: '100%' }}>
                      <div className={'card-turn-page-left'}>
                        {currPage > 1 ? <LeftCircleOutlined onClick={() => this.turnPageLeft()} /> : ""}
                      </div>
                      <div style={{ width: '100%' }}>
                        {
                          currPage <= numPages ?
                            <div className={'card-entries'}>
                              {
                                displayEntries.length === 0 ? "" :
                                  displayEntries[currPage - 1].map((entry, idx) =>
                                    <div key={idx} className={entry.name === yourName ? 'card-entry-preview' : ' '}>
                                      <div
                                        dangerouslySetInnerHTML={{ __html: entry.value }}
                                        className={entry.wordCount < CARD_NARROW_WIDE_THESHOLD ? 'card-entry-narrow' : 'card-entry-wide'}
                                        style={{ rotate: entry.wordCount < CARD_NARROW_WIDE_THESHOLD ? (idx % 2 === 0 ? -1 : 1 * (idx - idx + 2)) + 'deg' : '0deg' }}
                                      />
                                    </div>
                                  )
                              }
                            </div>
                            :
                            <div className={'card-final-page'}>
                              <div>Thank You</div>
                              <HeartFilled style={{ fontSize: '20px' }} />
                              <div>GoodGreets</div>
                            </div>
                        }
                        <div className={'card-footer'}>
                          <Button className={'card-flip-button'} onClick={() => { this.flipCard(); }} >Flip Over</Button>
                        </div>
                      </div>
                      <div className={'card-turn-page-right'}>
                        {currPage <= numPages ? <RightCircleOutlined onClick={() => this.turnPageRight()} /> : ""}
                      </div>
                    </div>
                  </BackSide>
                </Flippy>
              </div>
              <div className={'card-input-area'}>
                {
                  !isMessageInserted ?
                    <div>
                      <Select
                        style={{}}
                        defaultValue={'text'}
                        popupMatchSelectWidth={false}
                        onChange={this.toggleAddType}
                        options={[
                          {
                            value: 'text',
                            label: 'Add Text'
                          },
                          {
                            value: 'image',
                            label: 'Add Image'
                          }
                        ]}
                      />
                      {
                        addType === 'text' ?
                          <div>
                            <Input
                              className={'card-input-area-item'}
                              value={yourName}
                              onChange={(e) => this.setYourName(e.target.value)}
                              width={'50px'}
                              placeholder={'Your Name'}
                              maxLength={32}
                            />
                            <ReactQuill
                              style={{ width: '480px' }}
                              theme='snow'
                              modules={this.modules}
                              placeholder={'Your Message'}
                              value={yourEntry}
                              onChange={this.setValue}
                            />
                            <Space className={'card-input-area-item'} wrap>
                              <Button type={'primary'} onClick={this.seePreview}>See Preview</Button>
                              <Button type={'primary'} onClick={this.confirmEntry} disabled={!seenPreview}>Confirm</Button>
                            </Space>
                          </div>
                          :
                          <div>Image</div>
                        }
                    </div>
                  :
                  <div className={'sign-card-link-area'}>
                    <div>
                      <Space>
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                        {"You have successully signed " + cardDetails.recipientName + "'s card. Create yours today!"}
                      </Space>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <a href={'./'} >{`${AWS_CF_HOST_NAME}`}</a>
                    </div>
                  </div>
                }
              </div>
            </div>
            :
            <Home />
        }
        
      </div>
    );
  }
}

const withRouter = (Component) => (props) => {
  const params = useParams();
  return <Component params={params} {...props} />;
};

export default withRouter(SignCard);
