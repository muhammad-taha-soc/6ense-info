import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

const SlideMobile = ({ slideData }) => {
  const [scrollPosition, setScrollPosition] = useState(0); // Scroll percentage
  const [activeCardIndex, setActiveCardIndex] = useState(0); // Track which card is currently active
  const totalCards = slideData.length;

  // Refs to store card DOM elements for Intersection Observer
  const cardRefs = useRef([]);

  // Use IntersectionObserver to detect when cards enter and leave the viewport
  useEffect(() => {
    const observerOptions = {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.5, // Trigger when at least 50% of the card is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // If the card is in view, update the active card index
          const cardIndex = cardRefs.current.indexOf(entry.target);
          if (cardIndex !== -1) {
            setActiveCardIndex(cardIndex);
          }
        }
      });
    }, observerOptions);

    // Observe each card
    cardRefs.current.forEach((card) => observer.observe(card));

    return () => {
      // Cleanup observer when component unmounts
      observer.disconnect();
    };
  }, []);

  // Calculate the progress bar height based on the number of cards scrolled through
  const calculateProgressBarHeight = () => {
    // Calculate the progress based on the active card index
    return ((activeCardIndex + 1) / totalCards) * 100;
  };

  return (
    <div className="relative my-10 flex flex-col">
      {/* Progress bar */}
      <div
        className="absolute top-0 left-[50%] transform -translate-x-1/2 bg-gray-300 w-1 h-full"
        style={{
          height: "100%", // Grey bar is always 100% in height
        }}
      >
        {/* Fill color (blue) */}
        <div
          className="absolute top-0 left-0 bg-blue-600 w-full"
          style={{
            height: `${calculateProgressBarHeight()}%`, // Fill based on scroll position
            transition: "height 0.2s ease-out", // Smooth transition
          }}
        />
      </div>

      {/* Timeline Cards */}
      <div className="flex flex-col space-y-12 mt-10">
        {slideData.map((data, idx) => (
          <div
            key={idx}
            ref={(el) => (cardRefs.current[idx] = el)} // Set ref for each card
            className={`group relative my-[10px] flex w-1/2 justify-end pr-[22px] odd:justify-start odd:self-end odd:pl-[22px] odd:pr-0 sm:pr-[30px] sm:odd:pl-[30px]`}
          >
            <div className="relative flex w-[400px] max-w-[95%] flex-col items-center rounded-[5px] bg-white px-4 py-[10px] text-center shadow-[0_0_2px_rgba(0,0,0,0.3)] after:absolute after:right-[-7.5px] after:top-[calc(50%-7.5px)] after:h-4 after:w-4 after:rotate-45 after:content-normal after:bg-white after:shadow-[1px_-1px_1px_rgba(0,0,0,0.2)] group-odd:items-center group-odd:text-center group-odd:after:left-[-7.5px] group-odd:after:right-auto group-odd:after:shadow-[-1px_1px_1px_rgba(0,0,0,0.2)] sm:max-w-[70%] md:items-end md:p-4 md:text-right md:group-odd:items-start md:group-odd:text-left">
              <span
                className="absolute left-[5px] top-[5px] w-[calc(100%-10px)] p-[5px] text-center text-xs font-bold uppercase tracking-[1px] group-odd:left-auto group-odd:right-1 md:w-auto"
                style={{
                  backgroundColor: '#008FFB',
                  color: 'white',
                }}
              >
                {data.title}
              </span><br/>
              <time className="mt-6 text-xs text-[#777] md:m-0">{data.heading}</time>
              <p className="my-4 max-w-64 text-sm sm:text-base">{data.des}</p>

              <span className="absolute -right-8 top-[calc(50%-10px)] z-50 h-5 w-5 rounded-[50%] border-[3px] border-slate-400 bg-white group-odd:-left-8 group-odd:right-auto sm:-right-10 sm:group-odd:-left-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

SlideMobile.propTypes = {
  slideData: PropTypes.array.isRequired,
};

export default SlideMobile;
