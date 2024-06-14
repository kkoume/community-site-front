import React from 'react'
import DefaultLayout from '../../layouts/DefaultLayout'
import Main from '../../components/admin/Main'
import "../../styles/board.scss";

const AdminPage = () => {
  return (
    <DefaultLayout>
      <Main/>
    </DefaultLayout>
  )
}

export default AdminPage