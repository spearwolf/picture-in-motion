import React, { Fragment } from 'react';
import styled from 'styled-components';

import BevelledEdges from './BevelledEdges';

import DEMOS from './demos';

const MainLayout = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  background-color: #fff;
  text-align: center;
`;

const Logo = styled.img`
  display: inline-block;
  margin: 6px 14px 0;
  padding: 0;
  border: 0;
  height: 95px;
`;

const SideNav = styled.div`
  flex: 0 0 260px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #0a3;
`;

const SideNavContent = styled.div`
  background-color: #def;
  flex-grow: 1;
  padding: 0 20px;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
`;

const DemoView = styled.div`
  background-color: #e0eaf0;
  flex-grow: 1;
  position: relative;
`;

const Headline = styled.h2`
  font-family: Inconsolata;
  font-weight: 400;
  font-size: 21px;
  line-height: 1;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  text-transform: uppercase;
`;

const DemoLink = styled.a`
  font-family: Inconsolata;
  font-weight: 400;
  font-size: 16px;
  text-decoration: none;
  color: ${props => (props.active ? '#d06' : '#28C')};
  cursor: pointer;
  text-transform: lowercase;
`;

const DemoIFrame = styled.iframe`
  position: relative;
  width: 100%;
  height: 100%;
  border: 0;
`;

class AppShell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDemo: null,
      demoUrl: null,
    };
  }

  runDemo(selectedDemo, demoUrl) {
    this.setState({ selectedDemo, demoUrl });
  }

  render() {
    return (
      <MainLayout>
        <SideNav>
          <Header>
            <Logo src="/images/180327-picimo-logo-2-blue.png" alt="picimo" />
          </Header>
          <SideNavContent>
            <BevelledEdges north="10px" east="30px" />
            { DEMOS.map(({ section, demos }) => (
              <Fragment key={section}>
                <Headline>{ section }</Headline>
                { demos.map(({ title, url }) => (
                  <DemoLink
                    key={title}
                    url={url}
                    active={this.state.selectedDemo === title}
                    onClick={() => this.runDemo(title, url)}
                  >
                    { title }
                  </DemoLink>
                ))}
              </Fragment>
            ))}
          </SideNavContent>
        </SideNav>
        <DemoView>
          { this.state.demoUrl && (
            <DemoIFrame title={this.state.selectedDemo} src={this.state.demoUrl} scrolling="no" frameborder="0" />
          )}
          <BevelledEdges north="20px" northOffset="8px" east="40px" eastOffset="8px" south="30px" southOffset="10px" west="10px" westOffset="4px" />
        </DemoView>
      </MainLayout>
    );
  }
}

export default AppShell;
