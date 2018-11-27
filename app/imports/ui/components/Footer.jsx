import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    return (
          <div className='footer-background'>
            <Menu attached='bottom' borderless secondary >
              <Menu.Item>
                Contact Us
              </Menu.Item>
              <Menu.Item href='//cluhbs.github.io' target='_blank'>
                GitHub
              </Menu.Item>
              <Menu.Item>
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
