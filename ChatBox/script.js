import { GoogleGenerativeAI  } from "https://esm.run/@google/generative-ai";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { typeWriterEffect } from "./typerwriter.js";
  
let isTemporary = false;

const apiKey = "AIzaSyDXpL2_IeuK_8CBeMo6OQgSto6IbgUZP00";

typeWriterEffect();

//loading old chats
window.addEventListener('DOMContentLoaded', () => {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    console.log(chatHistory);
    if (chatHistory.length > 0) {
        document.querySelector('h2')?.style.setProperty('display', 'none');
        document.querySelector('.preview')?.style.setProperty('display', 'none');
        document.querySelector('.preview-two')?.style.setProperty('display', 'none');
        document.querySelector('.Benaam')?.style.setProperty('display', 'initial');
    }
      
    chatHistory.forEach(chat => {
        const container = document.createElement("div");
        container.classList.add("chat-container");

        container.innerHTML = `
                <div class="user-query">${chat.user}</div>   
                <div class="ai-response">${marked.parse(chat.ai)}</div>
        `;
        
        document.querySelector('.main-container .chat').appendChild(container);
    });
});

document.querySelector('.search-button')
    .addEventListener('click', () => {
        getAnswer();
    });

async function getAnswer() {

    try {
        const userText = document.getElementById('query').value;
        console.log(userText);

        if(!userText) {
            let message = "🙈📝 Don’t be shy! Fill in the blanks.";
            document.querySelector('.message').innerHTML = message;

            setTimeout(() => {
                document.querySelector('.message').innerHTML = "";
            }, 5000);
            return;
        }
        document.getElementById("query").value = "";
        
        document.querySelector('.message').innerHTML = "⏳ Thinking...";
        console.log('thinking');

        const prompt = `(You are Benaam AI and Your model name is Benaam-X)Answer this in a casual, honest, and human-like way: ${userText }`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiText = await response.text();
        
        // console.log(aiText);
        generateResponse (userText, aiText);
        

    } catch(error) {
        document.querySelector('.message').innerHTML = "❌ Failed to fetch suggestions. Check your API key or internet connection.";
        console.log(error);

        setTimeout(() => {
            document.querySelector('.message').innerHTML = "";
        }, 5000);
    } 

}

function generateResponse (userText, aiText) {
    const heading = document.querySelector('h2');
    if (heading) {
        heading.style.display = 'none'
        document.querySelector('.preview').style.display = 'none';
        document.querySelector('.preview-two').style.display = 'none';
        document.querySelector('.Benaam').style.display = 'initial';
        document.querySelector('.message').innerHTML = '';
    };

    const container = document.createElement("div");
    container.classList.add("chat-container");

    container.innerHTML = `
            <div class="user-query">${userText}</div>   
            <div class="ai-response">${marked.parse(aiText)}</div>
    `;

    document.querySelector('.main-container .chat').appendChild(container);

    if(!isTemporary) {
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        chatHistory.push({user: userText, ai: aiText});
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
    const chatBox = document.querySelector('.chat');
    chatBox.scrollTop = chatBox.scrollHeight;
    
}

document.querySelector('.temporary')
    .addEventListener('click', () => {
        isTemporary = true;
        document.querySelector('h2').style.display = 'none'
        document.querySelector('.preview').style.display = 'none';
        document.querySelector('.preview-two').style.display = 'none';
        document.querySelector('.Benaam').style.display = 'initial';
        localStorage.removeItem
        document.querySelector('.message').innerHTML = `
        <h2>Temporary Chat</h2>
        <div>This chat won't appear in history, use or update ChatGPT's memory, 
            or be used to train our models. For safety purposes, we may keep a copy of this chat for up to 30 days.</div>
        `
    });

document.querySelector('.js-newChat')
    .addEventListener('click', () => {
        localStorage.removeItem('chatHistory');
        document.querySelector('.main-container .chat').innerHTML = "";
    });

document.querySelector('.search-box')
    .addEventListener('click', () => {
        const chatBox = document.querySelector('.search-box');
        chatBox.scrollTop = chatBox.scrollHeight;
    }); 

