import React, { useState } from 'react'
import DefaultLayout from '../../layouts/DefaultLayout'
import ProjectLayout from '../../components/project/ProjectLayout'
import SearchBar from '../../components/project/SearchBar'
import DnD from '../../components/project/DnD'
import DragAndDrop from '../../components/project/DragAndDrop';
import "../../styles/projectList.scss";


const ProjectView = () => {
  return (
    <div>
        <DefaultLayout>
          <ProjectLayout/>
              <SearchBar/>
                <DnD/>
        </DefaultLayout>
    </div>
  )
}

export default ProjectView