import React, { useState, useRef, useEffect } from 'react'
import "@blocknote/core/fonts/inter.css";
import { Block } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

const EditorComponent = () => {

    /** yjs객체 생성 */
    const doc = new Y.Doc();
    const provider = useRef(null);
    const [pageList, setPageList] = useState([]);

    useEffect(() => {

    }, []);

    /** 소켓 연결 */
    useEffect(() => {
        // 컴포넌트가 마운트될 때 WebrtcProvider를 생성합니다.
        /** WebrtcProvider(방번호, yjs객체, 소켓주소) */
        provider.current = new WebrtcProvider('test111111', doc, { signaling: ['ws://api.illrreumbow.store:8080/community/testaa'] });
        // 컴포넌트가 언마운트될 때 provider를 정리합니다.
        return () => {
            provider.current.destroy();
        };
    }, []);

    const [blocks, setBlocks] = useState([]);
    const [ex, setEx] = useState([
        {
            "id": "03a3efa7-d341-4bf7-bdb8-a1172ffgc95d",
            "type": "paragraph",
            "props": {
                "textColor": "default",
                "backgroundColor": "default",
                "textAlignment": "left"
            },
            "content": [
                {
                    "type": "text",
                    "text": "fafafaf",
                    "styles": {}
                }
            ],
        }
    ]);
    /** 에디터 설정 */
    const editor = useCreateBlockNote({
        defaultStyles: true,
        uploadFile: (file) => Promise.resolve(''),
        collaboration: {
            provider: provider.current,
            fragment: doc.getXmlFragment("document-store"),
            user: {
                name: "My Username",
                color: "#ff0000",
            },
        },
    });

    

    /** 선택된 객체 정보 출력 */
    const editorSelectHandler = () => {
        const selection = editor.getSelection();
        if (selection !== undefined) {
            setBlocks(selection.blocks);
        } else {
            setBlocks([editor.getTextCursorPosition().block]);
        }
    }

    function saveToStorage(jsonBlocks){
        localStorage.setItem("editorContent", JSON.stringify(jsonBlocks))
    }

    function loadFromStorage(){
        const storageString = localStorage.getItem("editorContent");
        return storageString;
    }

    const click = () => {
        saveToStorage(editor.document)
    }

    const load = () =>{

    }

    return (
        <div className='pageMain'>
            {/** 에디터 생성, 안에 설정할 수 있음 */}
            <BlockNoteView
                editor={editor}
                onSelectionChange={editorSelectHandler}
            />
            <button onClick={click}>버튼이다</button>
            <button onClick={load}>불러온다</button>
            <div>Selection JSON:</div>
            <div className={"item bordered"}>
                <pre>
                    <code>{JSON.stringify(blocks, null, 2)}</code>
                </pre>
            </div>
        </div>
    )
}

export default EditorComponent