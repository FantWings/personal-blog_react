import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { Avatar, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { ThemeColor } from "../utils/constent";
import fetchData from "../utils/fetch";
import { BASEURL } from "../config";

export default function PageLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [smsLogin, setSmsLogin] = useState(false);
  const [smsCoolDownTime, setSmsCoolDownTime] = useState(60);

  const HandleLogin = () => {
    if (!username || !password) {
      return message.warn("用户名或密码不可为空");
    }
    setLoading(true);
    fetchData(`${BASEURL}/v1/auth/login`, "POST", undefined, {
      smsLogin,
      username,
      password,
    })
      .then(({ token, expTime }: { token: string; expTime: string }) => {
        // 登录成功，将token写入localStorge
        localStorage.setItem("token", token);
        // 将过期时间写入localstorge
        localStorage.setItem("expTime", expTime);
        setLoading(false);
      })
      .then(() => navigate(-1))
      .catch((e) => {
        console.log(e);
      });
  };

  const HandleGetSms = () => {
    if (!username) {
      return message.error("手机号不可为空！");
    }
    if (!Number(username)) {
      return message.error("手机号不可为非数字!");
    }
    if (username.length !== 11) {
      return message.error("手机号不正确!");
    }

    fetchData(
      `${BASEURL}/v1/auth/2fa/send_verify_code?phone_num=${username}`,
      "GET"
    ).then(() => {
      message.info("验证码已送出");
      const timer = setInterval(() => {
        setSmsCoolDownTime((smsCoolDownTime) => {
          if (smsCoolDownTime - 1 === 0) {
            clearInterval(timer);
            return 60;
          }
          return smsCoolDownTime - 1;
        });
      }, 1000);
    });
  };

  const HandleGetAvatar = () => {
    if (username) {
      fetchData(`${BASEURL}/v1/user/avatar?username=${username}`, "GET")
        .then(({ avatar, nickname }) => {
          setAvatar(avatar);
          setNickname(nickname);
        })
        .catch(() => {});
    } else {
      setAvatar("");
    }
  };

  return (
    <PageContainer>
      <LoginContainer>
        <CustomForm>
          {nickname && username ? (
            <div id="avatar">
              <Avatar src={avatar} size={48} />
              <span>{nickname}，欢迎回来！</span>
            </div>
          ) : (
            <h2>{smsLogin ? "短信验证码登录" : "使用账号密码登录"}</h2>
          )}
          <div className="fromContain">
            <div className="form-block">
              <div className="input-row">
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  placeholder={smsLogin ? "手机号码" : "手机号 / 用户名"}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => HandleGetAvatar()}
                />
                {smsLogin && (
                  <span
                    className="get_sms_code"
                    onClick={() => HandleGetSms()}
                    style={{
                      pointerEvents: smsCoolDownTime === 60 ? "auto":"none",
                    }}
                  >
                    {smsCoolDownTime === 60
                      ? "获取验证码"
                      : `${smsCoolDownTime} 秒后重新获取`}
                  </span>
                )}
              </div>
            </div>
            <div className="form-block">
              <div className="input-row">
                <input
                  type={smsLogin ? "tel" : "password"}
                  maxLength={smsLogin ? 6 : 32}
                  name="password"
                  id="login_password"
                  placeholder={smsLogin ? "验证码" : "密码"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="tools">
              <span onClick={() => setSmsLogin(!smsLogin)}>
                {smsLogin ? "使用密码登录" : "使用短信验证码登录"}
              </span>
              <span>忘记密码了</span>
            </div>
          </div>
          <div className="flex warp flex-row bottom-group">
            {!smsLogin && (
              <div
                onClick={(e) => {
                  setSmsLogin(true);
                  message.info("将使用短信验证码注册账号");
                }}
                className="button extend"
              >
                <span>注册</span>
              </div>
            )}
            <div onClick={() => HandleLogin()} className="button extend">
              {loading && <LoadingOutlined />}
              <span id="loginText">
                {loading ? "请稍等" : smsLogin ? "登录 / 注册" : "登录"}
              </span>
            </div>
          </div>
        </CustomForm>
      </LoginContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  transition: all 0.3s;
  @media all and (min-width: 768px) {
    align-items: center;
  }
  height: 100%;
`;
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  transition: 0.3s;
  flex: 1;
  box-shadow: 0 0 13px 8px #f2f2f5;
  overflow: hidden;
  @media all and (min-width: 768px) {
    max-width: 400px;
    height: 350px;
  }
  @media all and (max-width: 768px) {
    flex: 1;
    height: 100% !important;
  }
`;
// const TypeSwitcher = styled.div`
//   display: flex;
//   flex: 1;
//   justify-content: space-between;
//   align-items: center;
//   max-height: 45px;
//   .switchButton {
//     display: flex;
//     flex: 1;
//     justify-content: center;
//     align-items: center;
//     height: 100%;
//     font-size: 1.25em;
//     transition: all 0.3s;
//     overflow: hidden;
//     box-sizing: border-box;
//     border-bottom: 2px solid #f9f9f9;
//     :hover {
//       cursor: pointer;
//       background-color: #fcfcfc;
//     }
//   }
//   .active {
//     border-bottom: 2px solid ${ThemeColor.dark};
//   }
// `;

const CustomForm = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 1.5em;
  h1,
  h2 {
    font-weight: 400;
    text-align: center;
    margin: 0;
  }

  .flex {
    display: flex;
  }

  .nowarp {
    flex-wrap: nowrap;
  }

  .extend {
    flex: 1 100%;
  }

  .flex-row {
    flex-direction: row;
  }

  .bottom-group {
    justify-content: space-between;
    div.button {
      margin: 0 0.25rem;
    }
  }

  #avatar {
    display: inherit;
    justify-content: center;
    align-items: center;
    span {
      margin: 0 0.25em;
      font-size: 1.25em;
    }
  }

  #describe {
    display: flex;
    font-size: 0.75em;
    justify-content: center;
    transition: all 0.3s;
    color: #9e9e9e;
  }
  div.fromContain {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.75em;
    div.form-block {
      span {
        font-size: 1.1em;
      }
      div.input-row {
        display: flex;
        padding: 0.5em;
        border-bottom: 1px solid ${ThemeColor.white};
        margin: 0.5em 0;
        input {
          flex: 1;
          border: none;
          width: 100%;
          box-sizing: border-box;
          background-color: transparent;
          color: #333;
          outline: none;
        }
        span.get_sms_code {
          justify-content: center;
          background-color: #f0f0f0;
          color: #6d6d6d;
          border: none;
          padding: 0.25em 0.5rem;
          align-items: center;
          border-radius: 2px;
          transition: 300ms;
          font-size: 12px;
          &:hover {
            background-color: #e2e2e2;
            cursor: pointer;
          }
        }
      }
    }
    div.tools {
      display: flex;
      justify-content: space-between;
      transition: all 0.3s;
      color: #848484;
      margin: 0.5rem 0.25rem;
      span {
        transition: inherit;
        &:hover {
          cursor: pointer;
          color: #333;
        }
      }
    }
  }

  div.button {
    display: flex;
    justify-content: center;
    background-color: #333;
    color: #fff;
    border: none;
    padding: 0.5em;
    transition: all 0.3s;
    align-items: center;
    :hover {
      background-color: #525252;
      cursor: pointer;
      transform: scale(1.025);
    }
    :active {
      transform: scale(0.98);
    }
    #loginText {
      margin-left: 5px;
    }
    &.checkPass {
      pointer-events: unset;
      background-color: #333;
    }
    &.checkUnPass {
      pointer-events: none;
      background-color: #9c9c9c;
    }
  }
`;
