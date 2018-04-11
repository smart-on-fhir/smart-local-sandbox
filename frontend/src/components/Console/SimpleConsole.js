import React     from "react"
import PropTypes from "prop-types"
import                "./Console.less"

var codes = {
    reset: [0, 0],
  
    bold: [1, 22, "font-weight:bold"],
    dim: [2, 22, "opacity: 0.5"],
    italic: [3, 23, "font-style: italic"],
    underline: [4, 24, "text-decoration : underline"],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],
  
    black: [30, 39, "color:black"],
    red: [31, 39, "color:red"],
    green: [32, 39, "color:green"],
    yellow: [33, 39, "color:yellow"],
    blue: [34, 39, "color:blue"],
    magenta: [35, 39, "color:magenta"],
    cyan: [36, 39, "color:cyan"],
    white: [37, 39, "color:white"],
    gray: [90, 39, "color:gray"],
    grey: [90, 39, "color:grey"],
  
    bgBlack: [40, 49, "background: black"],
    bgRed: [41, 49, "background: red"],
    bgGreen: [42, 49, "background: green"],
    bgYellow: [43, 49, "background: yellow"],
    bgBlue: [44, 49, "background: blue"],
    bgMagenta: [45, 49, "background: magenta"],
    bgCyan: [46, 49, "background: cyan"],
    bgWhite: [47, 49, "background: white"],
  
    // legacy styles for colors pre v1.0.0
    blackBG: [40, 49, "background: black"],
    redBG: [41, 49, "background: red"],
    greenBG: [42, 49, "background: green"],
    yellowBG: [43, 49, "background: yellow"],
    blueBG: [44, 49, "background: blue"],
    magentaBG: [45, 49, "background: magenta"],
    cyanBG: [46, 49, "background: cyan"],
    whiteBG: [47, 49, "background: white"]
  
};

function applyStyles(str) {
    return str.replace(/\[(\d{1,2})m/g, (all, num) => {
        for (let style in codes) {
            if (codes[style][0] == num && codes[style][2]) {
                return '<span style="' + codes[style][2] + '">';
            }

            if (codes[style][1] == num) {
                return '</span>';
            }
            
        }
        return '';
    });
}

export default class SimpleConsole extends React.PureComponent
{
    static propTypes = {
        command : PropTypes.string,
        contents: PropTypes.string
    };

    static defaultProps = {
        contents: ""
    };

    componentDidMount() {
        if (this.console) {
            this.console.scrollTop = this.console.scrollHeight;
        }
    }

    componentWillUpdate() {
        this.shouldScroll = this.console && (
            this.console.scrollHeight -
            (this.console.scrollTop + this.console.clientHeight) < 10
        );
    }

    componentDidUpdate() {
        if (this.console && this.shouldScroll) {
            this.console.scrollTop = this.console.scrollHeight;
        }
    }

    render() {
        let val = applyStyles(
            String(this.props.contents).replace(
                /(\r|\n|^).*?\[2K(.*?)(\r|\n|$)/g,
                ($0, $1, $2, $3) => $2 + $3
            )
        );
        return (
            <div className="console" ref={console => this.console = console}>
                { this.props.command && <div><b>{ this.props.command }</b></div> }
                <div dangerouslySetInnerHTML={{ __html: val }}/>
            </div>
        );
    }
}
