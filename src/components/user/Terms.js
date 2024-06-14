import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import url from "../../config/url";

const Terms = () => {
  const navigate = useNavigate();

  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [isSmsChecked, setIsSmsChecked] = useState(false);
  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");
  const [smsContent, setSmsContent] = useState("");

  useEffect(() => {
    axios.get(url.backendUrl + "/user/terms").then((response) => {
      //axios.get("http://localhost:8080/community/user/terms").then((response) => {
      console.log(response.data);
      setTermsContent(response.data.terms);
      setPrivacyContent(response.data.privacy);
      setSmsContent(response.data.sms);
    });
  }, []);

  const handleTermsCheckboxChange = (e) => {
    setIsTermsChecked(e.target.checked);
  };

  const handlePrivacyCheckboxChange = (e) => {
    setIsPrivacyChecked(e.target.checked);
  };

  const handleSmsCheckboxChange = (e) => {
    setIsSmsChecked(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isTermsChecked && isPrivacyChecked) {
      alert("약관에 동의하셨습니다.");
      navigate("/user/register");
    } else {
      alert("필수 약관에 동의하셔야 합니다.");
    }
  };

  return (
    <div className="Terms">
      <form onSubmit={handleSubmit}>
        <div id="user">
          <section className="terms">
            <table>
              <caption>사이트 이용약관(필수)</caption>
              <tbody>
                <tr>
                  <td>
                    <textarea readOnly value={termsContent}></textarea>
                    <p>
                      <label>
                        <input
                          type="checkbox"
                          name="chk1"
                          checked={isTermsChecked}
                          onChange={handleTermsCheckboxChange}
                        />
                        동의합니다.
                      </label>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <caption>개인정보 취급방침(필수)</caption>
              <tbody>
                <tr>
                  <td>
                    <textarea readOnly value={privacyContent}></textarea>
                    <p>
                      <label>
                        <input
                          type="checkbox"
                          name="chk2"
                          checked={isPrivacyChecked}
                          onChange={handlePrivacyCheckboxChange}
                        />
                        동의합니다.
                      </label>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <caption>마케팅 수신동의(선택)</caption>
              <tbody>
                <tr>
                  <td>
                    <textarea readOnly value={smsContent}></textarea>
                    <p>
                      <label>
                        <input
                          type="checkbox"
                          name="chk3"
                          checked={isSmsChecked}
                          onChange={handleSmsCheckboxChange}
                        />
                        동의합니다.
                      </label>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <button type="submit" className="btnNext">
                다음
              </button>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};

export default Terms;
