import React from 'react';

export class InputText extends React.Component<{
  // props
  value:string;
  onChange:(text:string) => void;

  label?:React.ReactNode; // todo: stick on left, the internal element should be centered, probably use flex to do this.
  placeholder?:string;
  placeholderCentered?:boolean // todo:
  style?:React.CSSProperties;
  onConfirm?:() => void;
  onKeyDown?:(ev:React.KeyboardEvent<HTMLInputElement>) => void;
  onClick?:() => void;
}, {}> {
  public render () {
    return <input
      value={this.props.value}
      style={this.props.style}
      placeholder={this.props.placeholder}
      onChange={(ev) => this.props.onChange(ev.target.value)}
      onKeyDown={(ev) => {
        if (ev.keyCode === 13) {
          this.props.onConfirm && this.props.onConfirm();
        }
      }}
      onClick={this.props.onClick}
      onTouchStart={this.props.onClick}
    />;
  }
}