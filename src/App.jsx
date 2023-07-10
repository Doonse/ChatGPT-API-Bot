import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'





function App() {

  const [typing, setTyping] = useState(false)

  const [messages, setMessages] = useState([
    {
      message: 'Hello, i am ChatGPT. How may i help you?',
      sender: 'ChatGPT',
    }
  ])

  const handleSend = async (message) => {
    // Create the new message instance
    const newMessage = {
      message, 
      direction: "outgoing",
      sender: "user",
    }

    const newMessages = [...messages, newMessage] // Retakes messages, and adds the new message to the main array
    
    // Update message state
    setMessages(newMessages);
    
    // Display typing by chatgpt
    setTyping(true);
    
    // chatgpt process msg
    await processMessageToChatGPT(newMessages);
  }
   

  async function processMessageToChatGPT(chatMessages){

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role="assistant"
      } else {
        role="user"
      }
      return  { role: role, content: messageObject.message }
    })

    const systemMessage = {
      role: "system",
      content: "Expain all concepts as if i am 10 years old."
    }

    const apiRequestBody={
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages(
        [
          ...chatMessages, {
            message: data.choices[0].message.content,
            sender: "ChatGPT"
          }
        ]
      );
      setTyping(false);
    })
  }


  return (
    <div className='App'>
      <div style={{ position:"relative", height:"800px", width:"700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList 
              typingIndicator={typing ? <TypingIndicator content="ChatGPT is thinking.." /> : null}
            >
              {messages.map((message, idx) => {
                return <Message key={idx} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here.." onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
