import React, { useEffect } from 'react'

const Test = ({ rightSideHandlerClose, projectInfo }) => {

    useEffect(() => {
        const timeoutId = setTimeout(() => {
          const testBox = document.getElementsByClassName("testBox")[0];
          if (testBox) {
            testBox.style.transform += 'translateX(-100%)';
            testBox.style.transition = 'transform 0.5s ease';
          }
        }, 1);
    
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
      }, []);

  return (
    <div className='testBox' onClick={rightSideHandlerClose}>
        <div className='textContent'>
            <p>{projectInfo.projectName}</p>
            <p>{projectInfo.projectContent}</p>
        </div>
    </div>
  )
}

export default Test