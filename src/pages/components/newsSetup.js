// Correct Firebase imports
import { db } from "./firebase.js";
import { collection, doc, setDoc } from "firebase/firestore";

import fs from "fs";


const newsData = JSON.parse(fs.readFileSync("news.json", "utf8"));


async function uploadNewsToFirestore() {
  try {
   
    const newsRef = collection(db, "news");

    
    for (const round in newsData) {
      
      const roundDocRef = doc(newsRef, round);


      await setDoc(roundDocRef, { news: newsData[round] });
      console.log(`News for ${round} uploaded successfully!`);
    }
  } catch (error) {
    console.error("Error uploading news to Firestore:", error);
  }
}


uploadNewsToFirestore();
