import React from 'react'
import { Link } from 'react-router-dom'

const ProjectLayout = () => {
  return (
    <div className='ProjectList'>
        <h2 className="title"> Project </h2>
        <div class="Project">
            <ul>
                <li><Link to='/project/overview'>Overview</Link></li>
                <li><Link to='/project/Tasks'>Tasks</Link></li>
                <li><Link to='/project/Documents'>Documents</Link></li>
                <li><Link to='/project/Team'>Team</Link></li>
                <li><Link to='/project/Report'>Report</Link></li>
                <li><Link to='/project/Admin'>Admin</Link></li>
            </ul>
        </div>
    </div>

  )
}

export default ProjectLayout