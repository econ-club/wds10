import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import InfiniteScroller from "./InfiniteScroller.jsx"; // Import the InfiniteScroller component

const NewsApp = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    
    const fetchExcelData = async () => {
      const file = "/news_rounds.xlsx"; // Path to the Excel file i did some random file to check if its working and it is so attach the original here
      const response = await fetch(file);
      const arrayBuffer = await response.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: "array" });

      
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      
      const flatData = data.slice(1).flat();
      setNewsData(flatData);
    };

    fetchExcelData();
  }, []);

  return <InfiniteScroller newsData={newsData} />;
};

export default NewsApp;
