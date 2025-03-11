import React from 'react'

export default function youtubeButton() {
  const styles = `
    .Btn {
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background-color: transparent;
      position: relative;
      border-radius: 7px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .svgContainer {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      backdrop-filter: blur(0px);
      letter-spacing: 0.8px;
      border-radius: 10px;
      transition: all 0.3s;
      border: 1px solid rgba(156, 156, 156, 0.466);
    }

    .BG {
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      background: #ff0000;
      z-index: -1;
      border-radius: 10px;
      pointer-events: none;
      transition: all 0.3s;
    }

    .Btn:hover .BG {
      transform: rotate(35deg);
      transform-origin: bottom;
    }

    .Btn:hover .svgContainer {
      border: 1px solid rgba(255, 110, 110, 0.466);
      background-color: rgba(219, 219, 219, 0.466);
      backdrop-filter: blur(4px);
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <button className="Btn z-30">
        <span className="svgContainer">
          <svg
            viewBox="0 0 576 512"
            fill="white"
            height="1.6em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
            ></path>
          </svg>
        </span>
        <span className="BG"></span>
      </button>
    </>
  )
}
