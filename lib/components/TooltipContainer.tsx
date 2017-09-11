'use babel';

import TooltipPortal from './TooltipPortal';
import React, { EventHandler, SyntheticEvent } from 'react';
import Timer = NodeJS.Timer;

interface ITooltipContainerProps {
  children: any;
  tooltipContent: JSX.Element;
}

interface ITooltipContainerState {
  show: boolean;
}

class TooltipContainer extends React.Component<ITooltipContainerProps, ITooltipContainerState> {

  state: ITooltipContainerState;
  timeout: Timer;
  containerElement: HTMLDivElement;

  constructor(props: ITooltipContainerProps) {
    super(props);
    this.state = {
      show: false,
    };
  }

  showTooltip() {
    this.setState({ show: true });
  }

  mouseEnterHandler() {
    this.timeout = setTimeout(() => {
      this.showTooltip()
    }, 500);
  }

  mouseLeaveHandler() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.setState({ show: false });
    }
  };

  renderTooltip() {
    if(this.state.show){
      return (
        <TooltipPortal parent={this.containerElement}>
          {this.props.tooltipContent}
        </TooltipPortal>
      );
    }
    return null;
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
        }}
        onMouseEnter={this.mouseEnterHandler.bind(this)}
        onMouseLeave={this.mouseLeaveHandler.bind(this)}
        ref={(el) => this.containerElement = el}
      >
        {this.renderTooltip()}
        {this.props.children}
      </div>
    );
  }

}

export default TooltipContainer;