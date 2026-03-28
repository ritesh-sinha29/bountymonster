
import { Typewriter } from "react-simple-typewriter";

const HeroTypeWriter = () => {
  const placeholders = [
    "Preparing to Hunt",
    "getting Mosters ready",
     "Loading...",
  ];

  return (
    <div className="">
     
      <Typewriter
        words={placeholders}
        loop={0}
        cursor
        cursorStyle="|"
        typeSpeed={40}
        deleteSpeed={8}
        delaySpeed={1500}
      />
    </div>
  );
};

export default HeroTypeWriter;
