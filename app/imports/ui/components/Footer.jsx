import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    return (
          <div className='footer-background'>
            <Menu attached='bottom' borderless secondary >
              <Menu.Item as={NavLink} activeClassName="" exact to="/contact-us" key='contact-us'>
                Contact Us
              </Menu.Item>
              <Menu.Item href='//cluhbs.github.io' target='_blank'>
                GitHub
              </Menu.Item>
              <Menu.Item as={NavLink} activeClassName="" exact to="/help" key='help'>
                Help
              </Menu.Item>
              <Menu.Item href='//hawaii.edu' target='_blank'>
                University of Hawaiʻi
              </Menu.Item>
              <Menu.Item position='right'>
                <Icon name='copyright outline'/> 2018 clUHbs
              </Menu.Item>
            </Menu>
          </div>
    );
  }
}

export default Footer;
