import React from 'react'

const GitCard = (props) => {

  return (
    <div style={{ border: "solid 1px black", margin: 10, borderRadius: 3 }}>
      <div style={{ margin: 5 }}>
        <h4>Activity Type: {props.activity.type}</h4>
        <p>created at: {props.activity.created_at}</p>
      </div>
    </div>
  )
}

export default GitCard;