//these functions interpret and normalize the data 

const dataInterpretation = (data) => {
  
    let result = data.map((el) => {
      if (el[0] == "acousticness") {
      el.push(acousticness(el[1]));
      el.push(el[1] * 10);
      return el;
      } else if (el[0] == "danceability") {
        el.push(danceability(el[1]));
        el.push(el[1] * 10);
        return el;
      } else if (el[0] == "energy") {
        el.push(energy(el[1]));
        el.push(el[1] * 10);
        return el;
      } else if (el[0] == "instrumentalness") {
        el.push(instrumentalness(el[1]));
        el.push(el[1] * 10);
        return el;
      } else if (el[0] == "key") {
        el.push(key(el[1]));
        el.push(el[1]);
        return el;
      } else if (el[0] == "tempo") {
        el.push(Math.floor(el[1]));
        el.push((el[1]-50)/15);
        return el;
      } else if (el[0] == "valence") {
        el.push(valence(el[1]));
        el.push(el[1] * 10);
        return el;
      };
      
  });
  return result;
  };
  
  const acousticness = (datum) => {
    if (datum < 0.2) {
      return "Acoustic"
    } else if (datum < 0.4 ) {
      return "Mostly acoustic"
    } else {
      return "Not acoustic"
    }
  };
  
  const danceability = (datum) => {
    if (datum < 0.2) {
      return "Not danceable"
    } else if (datum < 0.4) {
      return "Slow Dance"
    } else if (datum < 0.6) {
      return "Got a beat"
    } else if (datum < 0.8) {
      return "Upbeat"
    } else {
      return "Banger"
    };
  };
  
  const energy = (datum) => {
    if (datum < 0.2) {
      return "Relaxing"
    } else if (datum < 0.4) {
      return "Low energy"
    } else if (datum < 0.6) {
      return "Andante" 
    } else if (datum < 0.8) {
      return "High energy"
    } else {
      return "It slaps"
    };
  };
  
  const instrumentalness = (datum) => {
    if (datum < 0.9) {
      return "Not instrumental"
    } else {
      return "Instrumental"
    };
  };
  
  const key = (datum) => {
    if (datum == 0) {
      return "Key of C"
    } else if (datum == 1) {
      return "Key of C♯, D♭"
    } else if (datum == 2) {
      return "Key of D"
    } else if (datum == 3) {
      return "Key of D♯, E♭"
    } else if (datum == 4) {
      return "Key of E"
    } else if (datum == 5) {
      return "Key of F"
    } else if (datum == 6) {
      return "Key of F♯, G♭"
    } else if (datum == 7) {
      return "Key of G" 
    } else if (datum == 8) {
      return "Key of G♯, A♭" 
    } else if (datum == 9) {
      return "Key of A" 
    } else if (datum == 10) {
      return "Key of A♯, B♭" 
    } else if (datum == 11) {
      return "Key of B" 
    } else {
      return "No key" 
    };
  };
  
  const valence = (datum) => {
    if (datum < 0.2) {
      return "Bleak"
    } else if (datum < 0.4) {
      return "Melancholic"
    } else if (datum < 0.6) {
      return "Serene" 
    } else if (datum < 0.8) {
      return "Happy"
    } else {
      return "Euphoric"
    };};

    export default dataInterpretation;