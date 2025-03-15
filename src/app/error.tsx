"use client";

export default function Error( { error, reset } : { error: Error & { digest?: string }, reset: () => void } )  {

  return (
    <div className="w-full min-h-60 flex items-center justify-center flex-col">
      
      <h2>Something got wrong</h2>
      <div>{error.message}</div>
      <button onClick={reset}>Reset</button>
      
    </div>
  );
}
