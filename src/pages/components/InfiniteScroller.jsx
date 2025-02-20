import React, { useState, useEffect, useRef, useCallback } from "react";

const InfiniteScroller = ({ newsData = [] }) => {
  const staticNews = [
    "Panaji Coaching Centers\n\n" +
    "Over 20 Lakh students have registered for JEE Mains whereas the number of applicants of NEET have rose to 32 Lakhs\n\n" +
    "SBC finance bank has invested (11 Crore INR) in for an undisclosed take in Panaji Coaching Centers. Company promoters in India are looking at buying back stakes in their firms to offer investors an exit opportunity in the face of a tepid market for initial public offerings, slowing PE investment and an economic downturn.\n\n" +
    "Panaji Coaching Centers has recently launched the Home Tutor option to help students get quality education from home at affordable rates.\n\n" +
    "Panaji Coaching Center has opened over 20 new branches in the past 1 year expanding its reach in the northeast.\n\n" +
    "IPO Floating Rate:- 4,40,000 INR\n\n",
    "Union Budget WDS 10.0"
  ];

  const pdfLink = "";// Add your PDF link here

  const initialNews = newsData.length > 0 ? newsData.slice(0, 6) : staticNews;

  const [news, setNews] = useState(initialNews);
  const loaderRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (newsData.length > 0) {
      setNews(newsData.slice(0, 6));
      setHasMore(true);
    }
  }, [newsData]);

  const loadMoreNews = useCallback(() => {
    if (!Array.isArray(newsData)) return;

    setTimeout(() => {
      setNews((prevNews) => {
        const nextItems = newsData.slice(prevNews.length, prevNews.length + 3);
        if (nextItems.length === 0) {
          setHasMore(false);
          return prevNews;
        }
        return [...prevNews, ...nextItems];
      });
    }, 1000);
  }, [newsData]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreNews();
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loadMoreNews, hasMore]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-auto p-4">
      <h2 className="text-4xl font-bold text-center mb-[1%] text-[#E1DFEC] DMSans">Activity</h2>

      <div className="flex flex-col w-full max-w-[90vw] lg:max-w-[70vw] h-[70vh] md:h-[60vh] p-4 border border-[#110E22] rounded-lg bg-[rgb(16,14,33)] shadow-lg DMSans">
        <div className="flex-grow overflow-y-auto scrollbar-hide space-y-4 p-[1%] bg-[#110E22]">
          {news.length > 0 ? (
            news.map((item, index) => (
              <div
                key={index}
                className="p-[2%] bg-[#15112b] rounded-lg shadow-md text-center text-md md:text-lg font-semibold text-[#E1DFEC] whitespace-pre-line w-full"
                onClick={() => item === "Union Budget WDS 10.0" && window.open(pdfLink, "_blank")}
                style={
                  item === "Union Budget WDS 10.0"
                    ? { cursor: "pointer", textDecoration: "underline", color: "#00aaff" }
                    : {}
                }
              >
                {item}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No news available</p>
          )}
          {hasMore && (
            <div ref={loaderRef} className="text-center text-gray-400 py-4">
              Loading more news...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfiniteScroller;