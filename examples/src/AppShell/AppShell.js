import React, { Fragment } from 'react';
import styled from 'styled-components';

// import BevelledEdges from './BevelledEdges';

import DEMOS from './demos';

const MainLayout = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
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
  background-color: #f8f8f8;
`;

const SideNavContent = styled.div`
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
  font-family: 'Poor Story';
  font-weight: 400;
  font-size: 28px;
  line-height: 1;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  text-transform: uppercase;
`;

const DemoLink = styled.a`
  font-family: 'Special Elite';
  font-weight: 400;
  font-size: 16px;
  text-decoration: none;
  color: ${props => (props.active ? '#FFFEA3' : '#28C')};
  background-color: ${props => (props.active ? '#79BD8F' : 'transparent')};
  text-shadow: 1px 1px 1px ${props => (props.active ? '#499C60' : '#FFF')};
  padding: 10px 14px 5px;
  border-radius: 16px;
  margin-left: -7px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
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
            <Logo src="/images/picimo-logo-original.png" alt="picimo" />
          </Header>
          <SideNavContent>
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
        </DemoView>
      </MainLayout>
    );
  }
}

export default AppShell;
