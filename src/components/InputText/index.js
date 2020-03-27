import React from 'react';
import './InputText.css';

class InputText extends React.Component {
  constructor() {
    super();
    this.state = {
      InputBackground: 'InitialBackground'
    };
  }

  changeBackground() {
    let { InputBackground } = this.state;
    InputBackground = 'WhiteBackground';
    this.setState({ InputBackground });
  }

  render() {
    const { InputBackground } = this.state;
    const { name, value, placeholder } = this.props;

    return (
      <input
        className={`InputText ${InputBackground}`}
        type="text"
        placeholder={`${placeholder} *`}
        name={name}
        value={value}
        onChange={(e) => {
          this.props.onChange(e);
        }}
        onInput={() => {
          this.changeBackground();
        }}
      />
    );
  }
}

export default InputText;
