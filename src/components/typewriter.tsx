
'use client';

import { useTypewriter, Cursor } from 'react-simple-typewriter';

type TypewriterProps = {
  words: string[];
};

export default function Typewriter({ words }: TypewriterProps) {
  const [typewriterText] = useTypewriter({
    words: words,
    loop: 0, // Loop indefinitely
    typeSpeed: 80,
    deleteSpeed: 60,
    delaySpeed: 3500,
  });

  return (
    <>
      <span>{typewriterText}</span>
      <Cursor cursorStyle="_" />
    </>
  );
}
