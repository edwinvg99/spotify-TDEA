// export const formatDuration = (milliseconds) => {
//   if (typeof milliseconds !== 'number' || milliseconds < 0) {
//     return '0:00';
//   }
//   const totalSeconds = Math.floor(milliseconds / 1000);
//   const minutes = Math.floor(totalSeconds / 60);
//   const seconds = totalSeconds % 60;
//   const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
//   return `${minutes}:${formattedSeconds}`;
// };