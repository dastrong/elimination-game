import shuffle from "lodash/shuffle";

export const throwError = msg => {
  throw new Error(`Error: ${msg}`);
};

export const getRandomNum = length => Math.floor(Math.random() * length);

// used to get the next set of data for our gameData arrays
export function nextRoundData(data, count, isVocab, vocabulary, expressions) {
  const shuffledData = () => shuffle(isVocab ? vocabulary : expressions);
  // if there isn't enough data for the next round, refresh all data and shuffle it
  const newData = count <= data.length ? [...data] : shuffledData();
  // get 'count' amount of data for the next round
  const roundD = newData.splice(0, count);
  // returns this rounds data and the next rounds data
  return [roundD, newData];
}

// returns a random linear gradient string
export function getRandoGrad() {
  const deg = getRandomNum(360);
  const st = getHSL();
  const nd = getHSL();
  const rd = getHSL();
  return `linear-gradient(${deg}deg, ${st}, ${nd}, ${rd})`;
}

// creates an array of random numbers within the parameters given
// can be unique if needed
export function arrOfRandoNum(min, max, num, unique = false) {
  if (min > max) {
    throwError("Min cannot be higher than the max");
  }
  if (unique && max < num) {
    throwError(
      "Cannot make a unique array, if the total length is lower than the max number"
    );
  }
  let arr = [];
  while (arr.length < num) {
    const randoNum = getRandomNum(max + 1 - min) + min;
    if (unique) {
      if (arr.indexOf(randoNum) === -1) {
        arr.push(randoNum);
      }
    } else {
      arr.push(randoNum);
    }
  }
  return arr;
}

// used for multi data games
// bails out of the dispatch to avoid unnecessary rerenders
// extras is an object of variables that you might need updated when updating isVocab
export function changeIsVocab(isVocab, state, extras) {
  if (isVocab === state.isVocab) return state;
  return { ...state, isVocab, ...extras };
}

// used to split game data into smaller arrays to map over later
// splits an array into chunks and attaches a ref
// returns an array containing equal lengthed arrays of ref/text combos
export function splitArrAddRef(refs, arr, chunk = 2) {
  if (arr.length !== refs.length) {
    throwError("The given refs and array have different lengths. They should be equal.");
  }
  if (arr.length % chunk !== 0) {
    throwError("You created uneven chunks. They should be equal.");
  }
  return arr.reduce((acc, cVal, i) => {
    // create an obj with the ref and text
    const val = { text: cVal, ref: refs[i] };
    // first time through; create our outer and first inner array
    if (!acc) return [[val]];
    // determine if we need to add to the last chunk or start a new one
    if (i % chunk === 0) {
      acc.push([val]);
    } else {
      const lastIndex = acc.length - 1;
      acc[lastIndex].push([val]);
    }
    return acc;
  }, null);
}

// returns a random HSL string
// not exported since it's only used in getRandoGrad above currently
function getHSL() {
  const hue = getRandomNum(360);
  const sat = getRandomNum(20) + 80;
  const lig = getRandomNum(10) + 60;
  return `hsl(${hue}, ${sat}%, ${lig}%)`;
}
