import { HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import MarkdownIt from "markdown-it";
import { Markup } from "interweave";
import { useState } from "react";

import "./langChainPage.css";

const LangChainPage = () => {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    const promptMessage = prompt;
    setPrompt("");
    try {
      const contents = [
        new HumanMessage({
          content: [
            {
              type: "text",
              text: promptMessage,
            },
          ],
        }),
      ];

      // Call the gemini-pro-vision model, and get a stream of results
      const vision = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        modelName: "gemini-1.5-pro",
      });

      // Multi-modal streaming
      const streamRes = await vision.stream(contents);

      // Read from the stream and interpret the output as markdown
      const buffer = [];
      const md = new MarkdownIt();

      for await (const chunk of streamRes) {
        buffer.push(chunk.content);
        setOutput(md.render(buffer.join("")));
      }
    } catch (e) {
      console.error(e);
      setOutput("<hr>" + e.message);
    }
  };

  return (
    <div className="lang-chain-page">
      <Markup content={output} className="prompt-response" />
      <div className="prompt-box">
        <label>
          <input
            name="prompt"
            placeholder="Enter instructions here"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>
        <button type="submit" onClick={handleSubmit}>
          Go
        </button>
      </div>
    </div>
  );
};

export default LangChainPage;
