const fs = require('fs');

// Read variables
const [node, file, ...args] = process.argv;

// Get the directory as first param
const myFilePath = args[0];
if (myFilePath == null || myFilePath == undefined || myFilePath.length == 0) {
  throw "File is not specified";
}

// Read the file
fs.readFile(myFilePath, { encoding: 'utf-8' }, (error, data) => {
  // If error, throw it
  if (error) {
    throw (error)
  }

  // Take all the data in an array and prepare empty array
  const arrayOfStrings = data.split("\n");
  const theStrings = [];

  // Find Zs
  var isFirstZFound = false;
  var isLastZFound = false;
  var isFirstZAlreadyPassed = false;
  var isStringAdded = false;
  var zCount = 0;

  // Foreach element of the array (every line of the g-code)
  arrayOfStrings.forEach(str => {
    // Assume the string is not added
    isStringAdded = false;

    // This code appears only once in my g-code just BELOW the last Z coordinate
    // Just explore your g-code and find  the value that will mark that last Z was passed
    if (str.indexOf("M204 P500") >= 0) {
      isLastZFound = true;
    }

    // Only if the first Z is found and the last is noot
    if (isFirstZFound && !isLastZFound) {
      // If the string contains a Z coordinate
      if (str.indexOf("Z") >= 0) {
        // Increase zCounter for stats
        zCount++;
        // First Z is correct; check if it's already marked
        if (isFirstZAlreadyPassed) {
          // Yes! The first Z was passed so the next ones need to be increased
          // Take the string and take two parts of it before and after Z
          const value = str.split("Z")
          // Take the number that represents Z coordiante, multiply 10 (eleminates the floating point) and add +2 (aka 0.2mm) to the height of the z
          const onlyZValute = ((value[1] * 10) + 2).toString() ;
          // Transform the int value you've obtained in a floating point one (105 => 10.5)
          let dotted = onlyZValute.substring(0, onlyZValute.length - 1) + "." + onlyZValute[onlyZValute.length - 1];
          // And if it starts by . add a 0 in front of it
          if (dotted.indexOf(".") == 0) {
            dotted = "0" + dotted
          }
          // Add the "transformed" Z coordinate to the array
          theStrings.push(value[0] + "Z" + dotted);
          isStringAdded = true;
        } else {
          // No, first Z is not passed. Just mark that this is the first and it needs to be the same.
          isFirstZAlreadyPassed = true;
        }
      }
    }

    // This code appears only once in my g-code just ABOVE the first Z coordinate.
    // Just explore your g-code and find the value that will mark that the next Z is found
    if (str.indexOf("G1 Z15.0") >= 0) {
      isFirstZFound = true;
    }

    // If the string was not changed by "changing" algorythm, just add is as is
    if (!isStringAdded) {
      theStrings.push(str);
    }
  })

  // All array is now ready to be printed
  const fileContent = theStrings.join("\n");

  fs.writeFile('./output.gcode', fileContent, writeError => {
    if (writeError) {
      // Error!
      console.error('Unable to write on output.gcode: ', writeError);
    } else {
      // Success!
      console.log('output.gcode generates successfully. Found ' + zCount+ ' Z dimensions.');
    }
  });
})