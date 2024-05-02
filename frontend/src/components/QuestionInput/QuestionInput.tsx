import { useState, useContext } from "react";
import { Stack, TextField } from "@fluentui/react";
import { SendRegular } from "@fluentui/react-icons";
import Send from "../../assets/Send.svg";
import styles from "./QuestionInput.module.css";
import {
    ChatMessage,
    Citation,
    ErrorMessage,
    historyClear

} from "../../api";
import { AppStateContext } from "../../state/AppProvider";
import { useBoolean } from "@fluentui/react-hooks";
interface Props {
    onSend: (question: string, jobid: string, conversationId?: string) => void;
    disabled: boolean;
    placeholder?: string;
    clearOnSend?: boolean;
    conversationId?: string;
}

const enum messageStatus {
    NotRunning = "Not Running",
    Processing = "Processing",
    Done = "Done"
}


export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, conversationId }: Props) => {
    const appStateContext = useContext(AppStateContext)
    const [question, setQuestion] = useState<string>("");
    const [jobId, setJobId] = useState<string>("");
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [processMessages, setProcessMessages] = useState<messageStatus>(messageStatus.NotRunning);
    const [activeCitation, setActiveCitation] = useState<Citation>();
    const [isCitationPanelOpen, setIsCitationPanelOpen] = useState<boolean>(false);   
    const [clearingChat, setClearingChat] = useState<boolean>(false);
    const [hideErrorDialog, { toggle: toggleErrorDialog }] = useBoolean(true);
    const [errorMsg, setErrorMsg] = useState<ErrorMessage | null>()
    const sendQuestion = () => {
        if (disabled || !question.trim()) {
            return;
        }

        if(conversationId){
            onSend(question, jobId, conversationId);
        }else{
            onSend(question, jobId);
        }

        if (clearOnSend) {
            setQuestion("");
        }
    };

    const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
        if (ev.key === "Enter" && !ev.shiftKey && !(ev.nativeEvent?.isComposing === true)) {
            ev.preventDefault();
            sendQuestion();
        }
    };

    const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setQuestion(newValue || "");
    };

    const newChat = () => {
        setProcessMessages(messageStatus.Processing)
        setMessages([])
        setIsCitationPanelOpen(false);
        setActiveCitation(undefined);
        appStateContext?.dispatch({ type: 'UPDATE_CURRENT_CHAT', payload: null });
        setProcessMessages(messageStatus.Done)
    };

    const clearChat = async () => {
        setClearingChat(true)
        if (appStateContext?.state.currentChat?.id && appStateContext?.state.isCosmosDBAvailable.cosmosDB) {
            let response = await historyClear(appStateContext?.state.currentChat.id)
            if (!response.ok) {
                setErrorMsg({
                    title: "Error clearing current chat",
                    subtitle: "Please try again. If the problem persists, please contact the site administrator.",
                })
                toggleErrorDialog();
            } else {
                appStateContext?.dispatch({ type: 'DELETE_CURRENT_CHAT_MESSAGES', payload: appStateContext?.state.currentChat.id });
                appStateContext?.dispatch({ type: 'UPDATE_CHAT_HISTORY', payload: appStateContext?.state.currentChat });
                setActiveCitation(undefined);
                setIsCitationPanelOpen(false);
                setMessages([])
            }
        }
        setClearingChat(false)
    };


    const handleJobSelectionChange = (_ev: React.FormEvent<HTMLSelectElement>) => {
        console.log("Job selection: " || _ev.currentTarget.value);
        setJobId(_ev.currentTarget.value);
        newChat()
    };

    const sendQuestionDisabled = disabled || !question.trim();

    return (
        <Stack horizontal className={styles.questionInputContainer}>
            <TextField
                className={styles.questionInputTextArea}
                placeholder={placeholder}
                multiline
                resizable={false}
                borderless
                value={question}
                onChange={onQuestionChange}
                onKeyDown={onEnterPress}
            />
            <div className={styles.questionInputSendButtonContainer} 
                role="button" 
                tabIndex={0}
                aria-label="Ask question button"
                onClick={sendQuestion}
                onKeyDown={e => e.key === "Enter" || e.key === " " ? sendQuestion() : null}
            >
                { sendQuestionDisabled ? 
                    <SendRegular className={styles.questionInputSendButtonDisabled}/>
                    :
                    <img src={Send} className={styles.questionInputSendButton}/>
                }
            </div>
            <div className={styles.questionInputJobSelection} 
                role="select" 
                tabIndex={0}
                aria-label="Job posting dropdown"
            >
                <label htmlFor="jobSelection">Job posting:</label>
                { 
                    
                    <select onChange={handleJobSelectionChange} id="jobSelection"  value={jobId}>
                        <option value="000">Null (#000)</option>
                        <option value="002">Business System Analyst (#002)</option>
                        <option value="001">Functional Analyst (#001)</option>
                        <option value="003">Network Analyst (#003)</option>
                    </select>
                }
            </div>
            <div className={styles.questionInputBottomBorder} />
        </Stack>
    );
};
