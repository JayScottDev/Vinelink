import React from 'react';

const Override = props => {
  return (
    <div className="override">
      <h1>Override States</h1>
      <h2>Caution!</h2>
      <p>
        These settings will automatically send order through regardless of
        compliance by state.
      </p>
      <h2>Override summary</h2>
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Complicancy status</th>
          </tr>
        </thead>
        <tbody />
      </table>
    </div>
  );
};

export default Override;
