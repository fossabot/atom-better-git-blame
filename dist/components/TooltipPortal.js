'use babel';
import React from 'preact-compat';
import ReactDOM from 'preact-compat';
class TooltipPortal extends React.Component {
    componentDidMount() {
        this.portal = document.createElement('div');
        document.body.appendChild(this.portal);
        this.renderTooltipContent(this.props);
    }
    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.portal);
    }
    getTooltipStyle() {
        let rect = this.props.parent.getBoundingClientRect();
        return {
            webkitFontSmoothing: 'subpixel-antialiased',
            position: 'absolute',
            zIndex: 100,
        };
    }
    positionTooltip() {
        const parentRect = this.props.parent.getBoundingClientRect();
        const tooltipRect = this.tooltipElement.getBoundingClientRect();
        const tooltipWidth = tooltipRect.right - tooltipRect.left;
        const tooltipHeight = tooltipRect.bottom - tooltipRect.top;
        let leftPos = parentRect.right - tooltipWidth;
        if (leftPos < 0)
            leftPos += (Math.abs(leftPos) + 5);
        this.tooltipElement.style['left'] = `${leftPos}px`;
        let topPos = parentRect.top - tooltipHeight - 5;
        if (topPos < 0)
            topPos = parentRect.bottom + 5;
        this.tooltipElement.style['top'] = `${topPos}px`;
    }
    renderTooltipContent(props) {
        this.tooltipElement = ReactDOM.render(React.createElement("div", { style: this.getTooltipStyle(), onMouseEnter: this.props.mouseEnter, onMouseLeave: this.props.mouseLeave }, props.children), this.portal);
        this.positionTooltip();
    }
    render() {
        return null;
    }
}
export default TooltipPortal;
