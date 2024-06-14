import React from 'react'
import moment from 'moment';

const SideBarContents = ({ targetEvent }) => {
  const deleteBtnHandler = () => {

  }
  if (targetEvent.length == 0) {
    return (
      <div><h4>일정이 없습니다.</h4></div>
    )
  } else {
    
    targetEvent.map((event) => {
      return (
        <div className='event'>
          <h4>{event['title']}</h4>
          <button>삭제</button>

          <p className='date'>
            <input type='datetime-local' defaultValue={moment(event['start']).format().split('+')[0]} />
            <input type='datetime-local' defaultValue={moment(event['end']).format().split('+')[0]} />
          </p>
        </div>
      )
    });
  }
}

export default SideBarContents