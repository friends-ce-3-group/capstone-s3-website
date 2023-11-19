import React, { Component } from 'react';
import { AWS_CAPTCHA_KEY } from '../utilities/Constants'

export class CaptchaBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };

  }

  componentDidMount() {
    //console.log("captcha key", AWS_CAPTCHA_KEY.substring(0,8) + "*********")
    this.showCaptcha()
  }

  showCaptcha = () => {
    let container = document.querySelector("#my-captcha-container");
    window.AwsWafCaptcha.renderCaptcha(container, {
      apiKey: AWS_CAPTCHA_KEY,
      onSuccess: (res) => this.onCaptchaSuccess(res),
      onError:(res) => this.onCaptchaError(res),
      dynamicWidth: true,
      skipTitle: true
    });
  }

  onCaptchaSuccess = (token) => {
    console.log("captcha success");
    console.log("captcha success token", "*****" + token.slice(-10));
    //this.props.onSuccess();
  }

  onCaptchaError = (res) => {
    console.log("captcha error");
    console.log(res);
  }

  render() {
    return (
      <div id="my-captcha-container">
        
      </div>
    );
  }
}
