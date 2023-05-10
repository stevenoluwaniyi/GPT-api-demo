import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import fs from "fs";


function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      // reader.onload = () => {
      //   const lines = reader.result.split("\n");
      //   resolve(lines);
      // };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
  

export default function Home() {
  var [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  const [finalInput, setFinalInput] = useState("");


  async function onSubmit(event) {   
    event.preventDefault();
    try {
      const fileInput = document.querySelector("#fileInput");
      const file = fileInput.files[0];
      const fileContent = await readFile(file);
      console.log(fileContent)

      animalInput = animalInput + fileContent;

      console.log(animalInput);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput})
      });

      const responseData = await response.json();
      if (response.status !== 200) {
        throw responseData.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(responseData.message.content);
      setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Generative AI </h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Ask me anything"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="file" id="fileInput" />
          <input type="submit" value="Get answers" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
