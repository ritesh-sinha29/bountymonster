import { Typewriter } from "react-simple-typewriter";

const LoaderText = () => {
  const placeholders = [
    "Preparing to Hunt",
    "Checking session",
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

export default LoaderText;
