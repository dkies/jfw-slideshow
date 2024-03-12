import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0); // Initializes `count` state
  const [bilder, setBilder] = useState(["images/PLATZHALTER.jpg"]);

  useEffect(() => {
    // Set up a timer to increment `count` every 5 seconds
    const timer = setInterval(() => {
      setCount((prevCount) => (prevCount + 1) % bilder.length);
      getData();
    }, 5000); // 5000 milliseconds = 5 seconds
    // Clean up the timer when the component unmounts or before rerunning the effect
    return () => clearInterval(timer);
  });

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
          setBilder(["images/PLATZHALTER.jpg"]);
        }
      });
  }

  return (
    <div className="bg-fire w-full h-screen flex flex-col items-center">
      <div className="h-1/6 flex items-center flex-col justify-center w-full">
        <h1 className="font-sans font-bold text-6xl text-blue-600 align-middle">
          Jugendfeuerwehr Karlsbad
        </h1>
        <h2 className="font-sans font-bold text-5xl text-blue-600 align-middle">
          Abteilung Langensteinbach
        </h2>
      </div>
      <div className="h-5/6 items-center">
        <img
          className="object-scale-down h-full w-screen p-6"
          src={bilder[count]}
          alt="Display"
        ></img>
      </div>
    </div>
  );
}

export default App;
