import React, { Fragment } from 'react';
import styled from 'styled-components';

import DEMOS from './demos';

const FONT_FAMILY_HEADLINE = 'Open Sans';
const FONT_FAMILY_TEXT = 'Cantarell';

const MainLayout = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  margin: 10px 20px 0 12px;
`;

const Logo = styled.img`
  display: inline-block;
  margin: 0;
  padding: 0;
  border: 0;
  height: 60px;
`;

const Title = styled.div`
  display: inline-block;
  font-family: '${FONT_FAMILY_HEADLINE}', Georgia, sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 1;
`;

const SideNav = styled.div`
  flex: 0 0 300px;
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
  font-family: '${FONT_FAMILY_HEADLINE}', Georgia, sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
`;

const GitHubLink = styled.a`
  position: fixed;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background-image: url(/images/github-361-dark.png);
  background-repeat: no-repeat;
  background-position: top right;
  background-size: contain;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

const DemoLink = styled.a`
  display: block;
  font-family: '${FONT_FAMILY_TEXT}', Courier, monospace;
  font-weight: 400;
  font-size: 14px;
  text-decoration: none;
  color: ${props => (props.active ? '#FF3060' : '#28C')};
  background-color: ${props => (props.active ? '#ffe8e7' : 'transparent')};
  padding: 5px 14px 3px 35px;
  border-radius: 16px;
  margin-left: -33px;
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
      demoSourceUrl: null,
    };
  }

  runDemo(selectedDemo, demoUrl, demoSourceUrl) {
    this.setState({ selectedDemo, demoUrl, demoSourceUrl });
  }

  render() {
    return (
      <MainLayout>
        <SideNav>
          <Header>
            <Logo src="/images/picimo-logo-original.png" alt="picimo" />
            <Title>/ examples</Title>
          </Header>
          <SideNavContent>
            { DEMOS.map(({ section, demos }) => (
              <Fragment key={section}>
                <Headline>{ section }</Headline>
                { demos.map(({ title, url, sourceUrl }) => (
                  <DemoLink
                    key={title}
                    url={url}
                    active={this.state.selectedDemo === title}
                    onClick={() => this.runDemo(title, url, sourceUrl)}
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
            <Fragment>
              <DemoIFrame title={this.state.selectedDemo} src={this.state.demoUrl} scrolling="no" frameborder="0" />
              <GitHubLink href={this.state.demoSourceUrl} target="_blank" />
            </Fragment>
          )}
        </DemoView>
      </MainLayout>
    );
  }
}

export default AppShell;
