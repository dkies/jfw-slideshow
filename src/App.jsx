import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0); // Initializes `count` state
  const [bilder, setBilder] = useState(["images/PLATZHALTER.jpg"]);
  const imageEndings = [".jpeg", ".jpg"];
  const videoEndings = [".mp4", ".mov"];

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // Set up a timer to increment `count` every 5 seconds
    const timer = setInterval(() => {
      if (!isVideo(bilder[count])) {
        updateCount();
      }
      getData();
    }, 5000); // 5000 milliseconds = 5 seconds
    // Clean up the timer when the component unmounts or before rerunning the effect
    return () => clearInterval(timer);
  });

  const updateCount = () =>
    setCount((prevCount) => (prevCount + 1) % bilder.length);

  async function getData() {
    fetch("./bilder.json")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const items = data.bilder;
        console.log(items);
        if (items.length > 0) {
          setBilder(items);
        } else {
          console.log("Keine Bilder gefunden");
          setBilder(["./PLATZHALTER.jpg"]);
        }
      });
  }

  const isImage = (url) => {
    return imageEndings.some((ending) => url.toLowerCase().endsWith(ending));
  };

  const isVideo = (url) => {
    return videoEndings.some((ending) => url.toLowerCase().endsWith(ending));
  };

  return (
    <div className="bg-fire w-full h-screen flex flex-col items-center">
      {isImage(bilder[count]) && (
        <img
          className="object-scale-down h-full w-screen p-6"
          src={bilder[count]}
          alt="Display"
        ></img>
      )}
      {isVideo(bilder[count]) && (
        <video
          className="object-scale-down h-full w-screen p-6"
          autoPlay="true"
          muted={true}
          onEnded={updateCount}
        >
          <source src={bilder[count]} />
        </video>
      )}
    </div>
  );
}

export default App;
