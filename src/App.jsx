import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Bot.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  faCircle,
  faGraduationCap,
  faMessage,
  faMicrochip,
  faMoon,
  faPersonRunning,
  faSackDollar,
  faSun,
  faTrash,
  faUser,
  faUtensils,
  faWindowMaximize,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import { faCopy } from "@fortawesome/free-solid-svg-icons/faCopy";
import { faPlane } from "@fortawesome/free-solid-svg-icons/faPlane";
const api = import.meta.env.VITE_API_KEY;
import promtData from "./Pomt.json";
import lottie1 from "./image/warning.lottie";
import botlogo from "./image/botlogo.jpg";
import profile_1 from "./image/profileLogo.jpeg";
import lottie2 from "./image/save.lottie";
import lottie3 from "./image/robo.lottie";
import load1 from "./image/load1.lottie";
import load2 from "./image/load2.lottie";
const icons = {
  faUtensils: faUtensils,
  faPlane: faPlane,
  faPersonRunning: faPersonRunning,
  faGraduationCap: faGraduationCap,
  faSackDollar: faSackDollar,
  faMicrochip: faMicrochip,
};

export default function App() {
  const [nav, setNav] = useState(false); // this is for Navbar widthChange
  const [profile, setprofile] = useState(false); // This is for profile option
  const [input, setInput] = useState(""); // this is for handling input value
  const [isLoading, setIsLoading] = useState(false); // for loading
  const [output, setOutput] = useState([]); // This is store current chat data also view the history data also
  const [allAnswer, setAllAnswer] = useState([]); // this is store all chat data & help to show history data to output
  const [index, setIndex] = useState(null); // this is store index of this chat which need to show & where api data will store
  const [save, setSave] = useState(true); // this is track whether user save current chat
  const [savenMsg, setSavenMsg] = useState(false); // this is help when Not save message need to show
  const [saveyMsg, setSaveyMsg] = useState(false); // this is help when Not save message need to show
  const [delMsg, setDelMsg] = useState({ popUp: false, i: null }); // this help when delete message need to show & i for which chats going to delete
  const [copy, setCopy] = useState(false); // this is track whether code was copy or not
  const [mode, setMode] = useState(false); // this is for theme false mean change to dark & vice-versa
  const [ipAnimi, setIpAnimi] = useState(true);
  const lastMessageRef = useRef(null); // this is for scrolling the latest data
  const inputref = useRef(null); // this is help to focus input box
  useEffect(() => {
    inputref.current.focus();
  }, []);
  // this is useEffect for every output change the databox scroll down to latest chat
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [output]);
  // this is help to change navbar width
  function handleNavClick() {
    setNav(nav ? false : true);
  }
  // this is profile bar menu open
  function handleProfileClick() {
    setprofile(profile ? false : true);
  }
  // this is for input value change
  function handleInputChange(e) {
    setInput(e.target.value);
  }
  // this is for input  help to paste default message in input field
  function handlePromt(e) {
    setInput(e);
    inputref.current.focus();
  }
  // this is send btn click
  function handleSendClick() {
    if (!isLoading) {
      fetchData();
      setSave(false);
    }
  }
  // this is enter after user write something in input field
  function handleEnter(e) {
    if (e.key === "Enter" && !isLoading) {
      fetchData();
      setSave(false);
    }
  }
  // this is for newChat btn
  function handleNewChat() {
    if (output.length === 0 || isLoading) return;
    if (save) {
      setTimeout(() => {
        inputref.current.focus();
      }, 100);
      setOutput([]);
      setInput("");
      setIndex(null); // Reset index
      setIpAnimi(false);
      setTimeout(() => {
        setIpAnimi(true);
      }, 400);
    } else {
      setSavenMsg(true);
      setTimeout(() => {
        setSavenMsg(false);
      }, 3000);
    }
  }
  // this is for all history chat
  function handleAnswer(e) {
    if (save) {
      setIndex(e);
      setOutput(allAnswer[e] ? [...allAnswer[e]] : []);
    } else {
      setSavenMsg(true);
      setTimeout(() => {
        setSavenMsg(false);
      }, 3000);
    }
  }
  // this is for chat save
  function handleSave() {
    if (output.length === 0 || isLoading) return;

    setAllAnswer((prev) => {
      const newChats = [...prev];

      if (index !== null) {
        // ✅ Prevent saving the same chat again at the same index
        if (JSON.stringify(newChats[index]) !== JSON.stringify(output)) {
          newChats[index] = [...output];
        }
      } else {
        // ✅ Prevent saving duplicate new chats
        const isDuplicate = newChats.some(
          (chat) => JSON.stringify(chat) === JSON.stringify(output)
        );

        if (!isDuplicate) {
          if (
            JSON.stringify(newChats?.[newChats.length - 1]?.[0]) ===
            JSON.stringify(output?.[0])
          ) {
            newChats[newChats.length - 1] = [...output];
          } else {
            newChats.push([...output]);
          }
        }
      }

      return newChats;
    });
    setSaveyMsg(true);
    setTimeout(() => {
      setSaveyMsg(false);
    }, 5000);
    setSave(true); // ✅ Set save to true after saving
  }
  // this is trigger the delete window & send store the clicking chat index
  function handleActiveDelete(e) {
    setDelMsg({ popUp: true, i: e });
  }
  // this is for deletion
  function handleDelete(e) {
    const newItem = allAnswer.filter((_, i) => i !== e);
    setAllAnswer(newItem);
    setDelMsg({ popUp: false, i: null });
    setOutput([]);
  }
  // after deletion when allAnswer become empty then output set to empty so that first page show
  useEffect(() => {
    if (allAnswer.length === 0) {
      setOutput([]);
      setIndex(null);
    }
  }, [allAnswer]);
  // this is simple cancel btn
  function handleCancel() {
    setDelMsg({ popUp: false, i: null });
  }
  // this is handle theme
  function handleTheme() {
    setMode(mode ? false : true);
  }
  // this is fetch function & store data in output
  const fetchData = async () => {
    if (!input.trim()) {
      return;
    }
    setIsLoading(true);
    setOutput((prev) => [...prev, { type: "Question", text: input }]);
    const requestData = {
      contents: [
        {
          parts: [{ text: input.trim() }],
        },
      ],
    };
    setInput("");
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${api}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      if (!data.candidates[0].content.parts[0].text) {
        throw new Error("Nothing to come Try again ");
      } else {
        const formattedResponse = formatResponse(
          data.candidates[0].content.parts[0].text
        );

        setOutput((prev) => [
          ...prev,
          { type: "Answer", text: formattedResponse },
        ]);
      }
    } catch (err) {
      console.log(err);

      setOutput((prev) => [
        ...prev,
        { type: "Error", text: "Something went wrong please try again" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  const formatResponse = (text) => {
    const codeRegex = /```([\s\S]*?)```/g;
    let parts = [];
    let lastIndex = 0;

    text.replace(codeRegex, (match, code, index) => {
      if (index > lastIndex) {
        let normalText = text.slice(lastIndex, index);

        // Bold text formatting
        normalText = normalText.replace(
          /\*\*(.*?)\*\*/g,
          "<br/><b>$1</b><br/>"
        );

        parts.push({ type: "Text", content: normalText });
      }

      // Splitting code into first line (p tag) and remaining lines (pre tag)
      const firstNewlineIndex = code.indexOf("\n");
      let formattedCode;
      if (firstNewlineIndex !== -1) {
        formattedCode = (
          <>
            <p className="code-title">{code.substring(0, firstNewlineIndex)}</p>
            <pre className="code">{code.substring(firstNewlineIndex + 1)}</pre>
          </>
        );
      } else {
        formattedCode = <pre className="code">{code}</pre>;
      }

      parts.push({ type: "Code", content: formattedCode });
      lastIndex = index + match.length;
    });

    if (lastIndex < text.length) {
      let normalText = text.slice(lastIndex);
      normalText = normalText.replace(/\*\*(.*?)\*\*/g, "<br/><b>$1</b><br/>");
      parts.push({ type: "Text", content: normalText });
    }
    return parts;
  };
  return (
    // this is body
    <div className={`body ${mode ? "dark-body" : ""}`}>
      {/* chat save message  */}
      <p className={`save-chat ${savenMsg ? "save-chat-slide" : ""}`}>
        <DotLottieReact className="war" loop autoplay src={lottie1} />
        Save the chat !
      </p>
      {/* delete window  */}
      <div
        className={`delete-window ${delMsg.popUp ? "delete-window-scale" : ""}`}
      >
        <p>Do you want to delete this chat ?</p>
        <button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
        <button className="delete-btn" onClick={() => handleDelete(delMsg.i)}>
          Delete
        </button>
      </div>
      {/* navbar  */}
      <div
        className={`navbar ${nav ? "new-navbar" : ""} ${
          mode ? "dark-nav" : ""
        } ${delMsg.popUp ? "navbar-blur" : ""}`}
      >
        <div className="left-nav">
          <div className="up">
            <img src={botlogo} alt="logo" />
            <ul>
              <li>
                <FontAwesomeIcon
                  className="message"
                  icon={faMessage}
                  onClick={handleNavClick}
                />
                <p>Chat</p>
              </li>
              <li>
                <FontAwesomeIcon
                  className={`mode ${mode ? "light" : "dark"}`}
                  icon={mode ? faSun : faMoon}
                  onClick={handleTheme}
                />
                <p>{!mode ? "dark ? " : "light ?"}</p>
              </li>
            </ul>
          </div>
          <div className="down-bar">
            <div className={`social ${profile ? "slide-social" : ""}`}>
              <a
                href="https://www.facebook.com/iamparthapattanayak"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon className="icon" icon={faFacebook} />
              </a>
              <a
                href="https://www.linkedin.com/in/partha-pattanayak-082a46320/"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon className="icon" icon={faLinkedin} />
              </a>
              <a
                href="https://github.com/PARTHA-PATTANAYAK-02"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon className="icon" icon={faGithub} />
              </a>
            </div>
            {!profile ? ( // if profile was click then show cross icon or profile
              <>
                <img
                  className="profile"
                  src={profile_1}
                  alt="profile"
                  onClick={handleProfileClick}
                />
                <p>Profile</p>
              </>
            ) : (
              <FontAwesomeIcon
                className="cross"
                icon={faXmark}
                onClick={handleProfileClick}
              />
            )}
          </div>
        </div>
        <div className={`right-nav ${nav ? "right-nav-slider" : ""}`}>
          <div className="title">
            <h2>Title</h2>
          </div>
          {/* this is all chat are listed */}
          {allAnswer.map((value, idx) => (
            <div
              className={`point ${idx === index ? "point-select" : ""} ${
                idx === allAnswer.length - 1 &&
                index === null &&
                save &&
                output.length > 0
                  ? "point-select"
                  : ""
              }`}
              key={idx}
              onClick={() => handleAnswer(idx)}
            >
              <p>{value?.[0]?.text || "No text available"}</p>{" "}
              <FontAwesomeIcon
                className="deletebtn"
                icon={faTrash}
                onClick={() => handleActiveDelete(idx)}
              />
            </div>
          ))}
        </div>
      </div>
      {/* main div start here  */}
      <div
        className={`main ${mode ? "dark-main" : ""} ${
          delMsg.popUp ? "main-blur" : ""
        }`}
      >
        <div className="topbar">
          <FontAwesomeIcon
            className="slidebar"
            icon={faWindowMaximize}
            onClick={handleNavClick}
          />
          <p>Slide</p>
          <div className="btncontainer">
            {output.length > 0 ? ( // visible if any conversation start
              <button
                className="savebtn"
                onClick={handleSave}
                style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
              >
                {saveyMsg ? (
                  <DotLottieReact
                    className="save"
                    loop={false}
                    autoplay
                    src={lottie2}
                  />
                ) : (
                  <>
                    Save{" "}
                    {save ? ( // this is for chat saved or not
                      ""
                    ) : (
                      <FontAwesomeIcon className="dot" icon={faCircle} />
                    )}
                  </>
                )}
              </button>
            ) : (
              ""
            )}
            <button className="newchat" onClick={handleNewChat}>
              ✨ New Chat
            </button>
          </div>
        </div>
        {/* chat body inside this databox/welcome page & input section  */}
        <div className="chatbody">
          {output.length === 0 ? ( // if conversation not start then initially show the welcome page
            <div className="first-page">
              <h2>Hello</h2>
              <div className="animi">
                <DotLottieReact className="bot" loop autoplay src={lottie3} />
              </div>
              <p>Hii there 👋</p>
              <h1>How Can I Help You ? </h1>
              <div className="promt-box">
                {promtData.map(
                  (
                    prompt // this is some example of question come from Promt.json
                  ) => (
                    <div
                      key={prompt.id}
                      className={`promt-${prompt.id} promt`}
                      onClick={() => handlePromt(prompt.question)}
                    >
                      <FontAwesomeIcon
                        className="promt-icon"
                        icon={icons[prompt.icon]}
                      />
                      <p>{prompt.text}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            // here the all conversation show it trigger when some data come to output
            <div className="databox">
              {output.map((item, index) => {
                if (item.type === "Question") {
                  return (
                    <div
                      className="question"
                      key={index}
                      ref={index === output.length - 1 ? lastMessageRef : null}
                    >
                      <div className="question-text">
                        <p>{item.text}</p>
                      </div>
                      <FontAwesomeIcon icon={faUser} className="usericon" />
                    </div>
                  );
                } else if (item.type === "Error") {
                  return (
                    <div
                      className="error"
                      key={index}
                      ref={index === output.length - 1 ? lastMessageRef : null}
                    >
                      <img src={botlogo} alt="" />
                      <div className="error-text">
                        <p>{item.text}</p>
                      </div>
                    </div>
                  );
                } else if (item.type === "Answer") {
                  return (
                    <div
                      className="answer"
                      key={index}
                      ref={index === output.length - 1 ? lastMessageRef : null}
                    >
                      <img src={botlogo} alt="" />
                      <div className="answer-text">
                        {item.text.map((part, i) =>
                          part.type === "Text" ? (
                            <pre
                              key={i}
                              className="text"
                              dangerouslySetInnerHTML={{
                                __html: part.content,
                              }}
                            />
                          ) : (
                            <div key={i} className="code-container">
                              <button
                                className="copy-btn"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    part.content.props.children[1].props
                                      .children
                                  );
                                  setCopy(true);
                                  setTimeout(() => {
                                    setCopy(false);
                                  }, 5000);
                                }}
                              >
                                <FontAwesomeIcon icon={faCopy} />
                                {copy ? "Coppied !" : "Copy"}
                              </button>
                              {part.content}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                }
                return "";
              })}
              {isLoading ? (
                <div className="loader">
                  <img src={botlogo} alt="" />
                  <div className="innerload">
                    <DotLottieReact
                      className="load"
                      loop
                      autoplay
                      src={mode ? load2 : load1}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
          <div className="inputbox">
            <div className={`input-send ${ipAnimi ? "input-animi" : ""}`}>
              <input
                type="text"
                name="input"
                id="input"
                ref={inputref}
                value={input}
                placeholder="Ask me Anything "
                autoComplete="off"
                onChange={handleInputChange}
                onKeyDown={handleEnter}
              />
              <button
                id="send"
                onClick={handleSendClick}
                style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
              >
                <FontAwesomeIcon id="sendicon" icon={faPaperPlane} /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
