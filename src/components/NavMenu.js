import React, { Component } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import { Image, Space } from 'antd';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header>
        {/**
        <Navbar className="navbar-expand-sm navbar-toggleable-sm" zz_className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
        **/}
        <Navbar className="navbar-expand-sm navbar-toggleable-sm" container light>
          <NavbarBrand tag={Link} to="/">
            <Space>
              <Image src={'logo.png'} preview={false} />
              <div className={'navbar-font'}>GoodGreets</div>
            </Space>
          </NavbarBrand>
          {/**
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} to="/create">
                    <Button className={'navbar-create-card-button'} default>
                      Create your greeting card
                    </Button>
                  </NavLink>
                </NavItem>
              </ul>
            </Collapse>
          **/}
        </Navbar>
      </header>
    );
  }
}
