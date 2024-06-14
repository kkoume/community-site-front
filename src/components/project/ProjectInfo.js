import React, { useEffect, useState, useMemo } from 'react';
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import CustomToolbar from "./CustomToolbar"; // CustomToolbar 컴포넌트가 제대로 가져와져 있는지 확인하세요.
import { Link } from "react-router-dom";

// Quill에서 사용할 Size와 Font를 설정합니다.
const Size = Quill.import("formats/size");
Size.whitelist = ["small", "medium", "large", "huge"];
Quill.register(Size, true);

const Font = Quill.import("attributors/class/font");
Font.whitelist = ["arial", "buri", "gangwon"];
Quill.register(Font, true);

// Quill의 formats를 설정합니다.
const formats = [
  "size",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "align",
  "color",
  "background",
  "font",
];

// bold와 italic을 추가로 설정합니다.
let bold = Quill.import("formats/bold");
bold.tagName = "b";
Quill.register(bold, true);

let italic = Quill.import("formats/italic");
italic.tagName = "i";
Quill.register(italic, true);

const ProjectInfo = ({ rightSideHandlerClose, projectInfo }) => {
  const [values, setValues] = useState(); // values 상태를 선언합니다.

  // useEffect를 사용하여 컴포넌트가 마운트된 후 실행될 코드를 설정합니다.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const projectBox = document.getElementsByClassName("projectBox")[0];
      if (projectBox) {
        projectBox.style.transform += 'translateX(-100%)';
        projectBox.style.transition = 'transform 0.5s ease';
      }
    }, 1);

    // cleanup 함수를 반환하여 컴포넌트가 언마운트될 때 실행될 코드를 설정합니다.
    return () => clearTimeout(timeoutId);
  }, []);

  // modules 상수를 useMemo를 사용하여 설정합니다.
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: "#toolbar", // 커스텀 툴바의 ID
      },
    };
  }, []);

  return (
    <div className='ProjectList'>
      <div className='projectBox' onClick={rightSideHandlerClose}>
        <div className='projectContent'>
          <h4>{projectInfo.projectName}</h4>
          <div className='stateLabel'>
            <p>{projectInfo.projectStatus} Open</p>
            <p>{projectInfo.projectGroup} Team2</p>
          </div>
          <p></p>
          <div className='projectConetentInfo'>
            <p>{projectInfo.projectContent}</p>
          </div>

          <div className='profileImage'></div>

          <div className="editor">
            <CustomToolbar />
            <ReactQuill
              theme="snow"
              value={values}
              modules={modules}
              formats={formats}
              onChange={(content, delta, source, editor) =>
                setValues(editor.getHTML())
              }
            />
          </div>
          <div className="editBtn">
            <p>취소</p>
            <p>작성</p>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ProjectInfo;
