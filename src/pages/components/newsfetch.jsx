import { useState, useEffect } from "react";
import { db } from "./firebase"; 
import { collection, doc, getDoc } from "firebase/firestore";
import InfiniteScroller from "./InfiniteScroller"; // Import InfiniteScroller

function RoundNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const roundDocRef = doc(collection(db, "news"), "1"); 
        const roundDocSnap = await getDoc(roundDocRef);

        if (roundDocSnap.exists()) {
          setNews(roundDocSnap.data().news || []); // Ensure it's an array
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []); 

  return <InfiniteScroller newsData={news} />
    

      
      
    
 
}

export default RoundNews;
