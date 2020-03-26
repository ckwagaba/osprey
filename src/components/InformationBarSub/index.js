import React from 'react';
import CreateButton from '../ButtonComponent';
import './InformationBarSub.css';

function InformationBarSub({ header, showBtn, btnAction }) {
  return (
    <div className="InformationBarSub">

      {showBtn ? (
        <div>
          <div className="InfoHeader">{ header }</div>
          <div className="CreateButton">
            <CreateButton onClick={btnAction} />
          </div>
        </div>
      ) : (
        <div className="LeftHeader">{header}</div>
      )}
    </div>
  );
}
export default InformationBarSub;
