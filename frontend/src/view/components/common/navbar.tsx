import * as React from 'react';
import './navbar.scss';

interface Props {
  goBack:() => void;
  onMenuClick?:() => void;
  menuIcon?:string;
  style?:React.CSSProperties;
}

interface State {
}

export class NavBar extends React.Component<Props, State> {
  public render () {
    const menuIcon = this.props.menuIcon || 'fas fa-ellipsis-h';
    return <div style={this.props.style} className="navbar">
      <div className="navbar-prev" onClick={this.goBack}>&#10094;</div>

      <div className="navbar-start">
        {this.props.children}
      </div>

      <div className="navbar-menu" onClick={this.props.onMenuClick}>
        <i className={menuIcon}></i>
      </div>
    </div>;
  }

  public goBack = () => {
    this.props.goBack();
  }
}