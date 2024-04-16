import React, { useEffect } from "react";
import "./ChatApp.css";
import axios from "axios";
import { useState } from "react";
import EmojiPicker, {
    EmojiStyle,
    Emoji,
    SuggestionMode,
} from "emoji-picker-react";
import { BsSendFill, BsEmojiSmileFill } from "react-icons/bs"; // Added BsSendFill import

const ChatApp = () => {
    const [selectedEmoji, setSelectedEmoji] = useState("");
    const [showInputField, setShowInputField] = useState(false);
    const [inputText, setInputText] = useState("");
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [displaymsg, setDisplayMsg] = useState([]);
    const [like, setLike] = useState(0);

    // to fetch the data
    useEffect(() => {
        axios
            .get(`https://lovely-tux-eel.cyclic.app/chat`)
            .then(function (response) {
                setDisplayMsg(response.data);
            })
            .catch(function (error) {
                console.log("Error:", error.message);
            });
    }, []);

    //  this function is to post the message
    const sendPostRequest = () => {
        console.log("Sending message:", inputText);
        const data = {
            message: inputText,
        };

        axios
            .post("https://lovely-tux-eel.cyclic.app/chat/send", data)
            .then(function (response) {
                setInputText("");
                // window.location.reload();
                setDisplayMsg([...displaymsg, inputText]);
                console.log("DisplayMsg updated:", displaymsg);
            })
            .catch(function (error) {
                console.log("Error:", error.message);
            });
    };

    //  this function is to increase the like count
    const handleLike = (id) => {
        axios
            .patch(`https://lovely-tux-eel.cyclic.app/chat/like/${id}`, {
                $inc: { like: 1 },
            })
            .then(function (response) {
                setLike(
                    displaymsg.map((chat) =>
                        chat._id === id
                            ? { ...chat, like: response.data.like }
                            : chat
                    )
                );
                window.location.reload();
            })
            .catch(function (error) {
                console.log("Error:", error.message);
            });
    };

    // this is to clear the entire chat
    const ClearAll = () => {
        axios
            .delete(`https://lovely-tux-eel.cyclic.app/chat/clear`)
            .then(function (response) {
                window.location.reload();
            })
            .catch(function (error) {
                console.log("Error:", error.message);
            });
    };

    // this is to clear particular message
    const deleteMsg = (id) => {
        axios
            .delete(`https://lovely-tux-eel.cyclic.app/chat/delete/${id}`)
            .then(function (response) {
                window.location.reload();
            })
            .catch(function (error) {
                console.log("Error:", error.message);
            });
    };

    function handleInputChange(event) {
        setInputText(event.target.value);
    }

    function onEmojiClick(emojiData, event) {
        setSelectedEmoji(emojiData.unified);
        setShowInputField(true);
        setInputText(
            (prevInputText) =>
                prevInputText +
                String.fromCodePoint(parseInt(emojiData.unified, 16))
        );
    }

    return (
        <div className="background">
            <div className="main">
                <div className="sub1">
                    <div style={{ display: "flex" }}>
                        <div className="logo">
                            <img
                                src="data:image/jpeg;base64,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"
                                alt=""
                            />
                        </div>
                        <div>
                            <div
                                style={{
                                    marginLeft: "40px",
                                    textAlign: "left",
                                    marginTop: "1px",
                                    color: "#2d66c1",
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                }}
                            >
                                ExactSpace Chat App
                            </div>
                            <div>
                                <p
                                    style={{
                                        marginLeft: "40px",
                                        marginTop: "7px",
                                        textAlign: "left",
                                        color: "grey",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Group Members: Alan , Bob , Carol , Dean ,
                                    Eril
                                </p>
                            </div>
                        </div>
                        <button
                            style={{
                                height: "40px",
                                marginLeft: "420px",
                                marginTop: "15px",
                                color: "white",
                                border: "1px solid white",
                                borderRadius: "10%",
                                cursor: "pointer",
                                backgroundColor: "rgb(198, 41, 41)",
                            }}
                            onClick={ClearAll}
                        >
                            Clear Chat
                        </button>
                    </div>
                </div>

                <div>
                    <div className="message-container">
                        {displaymsg.map((el, index) => {
                            const isAlanOrElin =
                                el.user === "Alan" || el.user === "Elin";
                            const messageClass = isAlanOrElin
                                ? "message-blue"
                                : "message-orange";

                            const firstLetter = el.user[0];

                            return (
                                <>
                                    <div>
                                        <div
                                            style={{
                                                display: "flex",
                                                border: "0px solid black",
                                            }}
                                        >
                                            <div
                                                className={messageClass}
                                                key={el._id}
                                            >
                                                <div
                                                    className="first-letter"
                                                    style={{
                                                        fontSize: "22px",
                                                        color: "white",
                                                        border: "0px solid black",
                                                        height: "38px",
                                                        width: "44px",
                                                        paddingTop: "12px",
                                                        textAlign: "center",
                                                        borderRadius: "50%",
                                                        fontWeight: "bold",
                                                        marginLeft: "-80px",
                                                        backgroundColor:
                                                            "#8f2841",
                                                    }}
                                                >
                                                    {firstLetter}
                                                </div>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        marginTop: "-45px",
                                                    }}
                                                >
                                                    <p style={{ color: "red" }}>
                                                        {el.user}
                                                    </p>
                                                    <p className="sent-time">
                                                        {el.time}
                                                    </p>
                                                </div>
                                                <p
                                                    style={{
                                                        marginTop: "10px",
                                                        marginBottom: "15px",
                                                    }}
                                                >
                                                    {el.message}
                                                </p>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "20px",
                                                        }}
                                                    >
                                                        <div>
                                                            {/* Removed <MdDelete
                                                                className="icon"
                                                                onClick={() =>
                                                                    deleteMsg(
                                                                        el._id
                                                                    )
                                                                }
                                                                size={"20px"}
                                                            /> */}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div
                                                            onClick={() =>
                                                                handleLike(
                                                                    el._id
                                                                )
                                                            }
                                                        >
                                                            {/* Removed <AiFillLike
                                                                className="icon"
                                                                color="orangered"
                                                                size={"20px"}
                                                            /> */}
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "18px",
                                                                    paddingBottom:
                                                                        "5px",
                                                                    paddingLeft:
                                                                        "2px",
                                                                }}
                                                            >
                                                                {el.like}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="sendtext">
                <div className="emoji">
                    <BsEmojiSmileFill
                        size={"48px"}
                        className="smiley"
                        onMouseEnter={() => setIsEmojiPickerOpen(true)}
                        onClick={() => setIsEmojiPickerOpen(false)}
                    />

                    {isEmojiPickerOpen && (
                        <div className="emoji-picker-container">
                            <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                emojiStyle={EmojiStyle.NATIVE}
                                suggestedEmojisMode={SuggestionMode.RECENT}
                            />
                        </div>
                    )}
                </div>
                <input
                    type="text"
                    placeholder="Enter Your Text"
                    value={inputText}
                    onChange={handleInputChange}
                    onClick={() => setIsEmojiPickerOpen(false)}
                />

                <div className="send">
                    <BsSendFill size={"21px"} onClick={sendPostRequest} />
                </div>
            </div>
        </div>
    );
};

export default ChatApp;
