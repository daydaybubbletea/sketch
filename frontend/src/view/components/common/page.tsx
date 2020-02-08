import * as React from 'react';
import './page.scss';
import { classnames } from '../../../utils/classname';

export function Page (props:{
  children:React.ReactNode;
  top?:React.ReactNode;
  bottom?:React.ReactNode;
  className?:string;
  style?:React.CSSProperties;
  zIndex?:number;
}) {
  return <div className="page" style={{zIndex: props.zIndex || undefined}}>
    { props.top &&
      <div className="top">
        {props.top}
      </div>
    }

    <div className={classnames('body', props.className)} style={Object.assign(
      {
        marginTop: props.top ? '44px' : '0',
      },
      props.style || {},
    )}>
      {props.children}
    </div>

    { props.bottom &&
      <div className="bottom">
        {props.bottom}
      </div>
    }

  </div>;
}