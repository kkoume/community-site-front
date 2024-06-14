import React from 'react'
import DefaultLayout from '../../layouts/DefaultLayout';
import EditorComponent from '../../components/page/EditorComponent';
import "../../styles/page.scss";
const Page = () => {
    return (
        <DefaultLayout>
            <EditorComponent/>
        </DefaultLayout>
    )
}

export default Page