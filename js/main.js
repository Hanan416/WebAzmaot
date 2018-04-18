
// imGenerator takes the userInput string
// and generate an image based on the input
function imGenerator (e){
	console.log("start");

	// uncomment to get html content
	var textField = document.getElementById(e);
	var userInput = textField.value;

	// all chars and their image path
	var charToPath = {
		'א' : "Images/alef/alef_",
		'ב' : "Images/bet/bet_",
		'ג' : "Images/gimel/gimel_",
		'ד' : "Images/dalet/dalet_",
		'ה' : "Images/hey/hey_",
		'ו' : "Images/vav/vav_",
		'ז' : "Images/zain/zain_",
		'ח' : "Images/het/het_",
		'ט' : "Images/tet/tet_",
		'י' : "Images/yud/yud_",
		'כ' : "Images/kaf/kaf_",
		'ך' : "Images/kaf sofit/kaf sofit_",
		'ל' : "Images/lamed/lamed_",
		'מ' : "Images/mem/mem_",
		'ם' : "Images/mem sofit/mem sofit_",
		'נ' : "Images/non/non_",
		'ן' : "Images/non sofit/non sofit_",
		'ס' : "Images/samech/samech_",
		'ע' : "Images/ayin/ayin_",
		'פ' : "Images/phe/phe_",
		'ף' : "Images/phe sofit/phe sofit_",
		'צ' : "Images/zadik/zadik_",
		'ץ' : "Images/zadik sofit/zadik sofit_",
		'ק' : "Images/kof/kof_",
		'ר' : "Images/resh/resh_",
		'ש' : "Images/shin/shin_",
		'ת' : "Images/taf/taf_",
		'space' : "Images/space/space.png",
	};


	// letters size
	const srcImWidth = 275;
	const srcImHeight = 275;  // delete this one if symetric

	// Background size
	const bgWidth = 1920;
	const bgHeight = 1080;
	
	var allImages = [setLetterInfo("Images/floor_bg.png", 0,0)];
	var lineStart = bgWidth - srcImWidth - 100;
	var lineEnd = 100;

	var currX = lineStart;
	var currY = 150;
	var imSrc = '';

	// this need to be similar to the number
	// of letters fit inside textArea in html
	var lettersInLine = Math.floor(bgWidth/srcImWidth);
	console.log("lettersInLine = " , lettersInLine);		

	var currWord = [];		// used to collect a complete word and calculate its position
	var currWordLen = 0;

 
	for (var i = 0; i < userInput.length ; i++){
		console.log("enter for..");
		console.log("currX: ", currX, ", currY: ", currY, ", letter: ", userInput.charAt(i));

		// in this case currWord contain a complete
		// word and needed to insert to allImages
		if (userInput.charAt(i) === '\n' || userInput.charAt(i) === ' ' || userInput.charAt(i) === '\0'){

			// check if the word fits to the current row
			if (bgWidth - (currWordLen*srcImWidth)  >= 0){
				if(userInput.charAt(i) === ' '){
					if(currWordLen > 0){
						imSrc = charToPath['space'];
						currWord.push(setLetterInfo(imSrc, currX, currY));
						console.log("!", currWord);
						allImages = pushWord(allImages, currWord);
						currWord = [];
						currX = currX - srcImWidth;
						currWordLen = 0;
						if (currX < 0){
							currX = lineStart;
							currY = currY + srcImHeight;
						}
					}
				}

				else{
					if(userInput.charAt(i) === '\n'){
						currY = currY + srcImHeight;
						currWord = setInMid(currWord, bgWidth, srcImWidth);
						allImages = pushWord(allImages, nextLineUpdate(currWord, currY, lineStart, srcImWidth));
					}
				}
			}
				
			// need to break this scenario to \n, \0 and space
			// maybe adding functionality to rescale images??	
			else{
				// TODO: deal with long words, throw error etc..
				if (currWordLen > lettersInLine){
					console.log("word too long!!");
					exit();
				}
				// word fits to new line
				else{
					// enter key case
					if (userInput.charAt(i) === '\n'){
						//console.log("Enter_key found")
						currX = lineStart;
						currY = currY + srcImHeight;
					}
					// space key entered
					else if(userInput.charAt(i) === ' '){
						imSrc = charToPath['space'];
						allImages.push(setLetterInfo(imSrc, currX, currY));
						currX = currX - srcImWidth;
						if (currX < 0){
							currX = lineStart;
							currY = currY + srcImHeight;
						}
					}

					// end of userInput
					else if(userInput.charAt(i) === '\0'){
						currWord = setInMid(currWord, bgWidth, srcImWidth);
						allImages = pushWord(allImages, currWord);
						currWord = [];
						currWordLen = 0;
						// TODO: finish
					}
				}//End of word fits
			}
			console.log("currWord = " , currWord);
		} //End if complete word

		// build a word
		else{
			// checking for valid word length
			if(currWordLen < lettersInLine){
				imSrc = charToPath[userInput.charAt(i)]; // takes the character path
				imSrc = imSrc + '000.png';

				if (currX < lineEnd){
					currY = currY + srcImHeight;
					currWord = nextLineUpdate(currWord, currY, lineStart, srcImWidth);
					currX = lineStart - currWordLen*srcImWidth; //update next x Position
				}

				currWord.push({src: imSrc, x: currX, y: currY});
				currWordLen++;
				currX = currX - srcImWidth;
			}
			else{
				console.log("Trying to insert too long word!");
				exit();
				//TODO: add error message
			}
		} // end of word build
	} // end of for loop
	console.log("final result:\n",allImages);
	currWord = setInMid(currWord, bgWidth, srcImWidth);
	allImages = pushWord(allImages, currWord); // push the last word

	document.getElementById("msg").style.display ="none";
	
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
		
	var imArr = [];

	var bg = new Image(bgWidth, bgHeight);
	bg.src = "./Images/floor_bg.png";
	draw(ctx, bg, 0, 0);
	for(var i=1; i < allImages.length ;){
		imArr[i] = new Image();
		imArr[i].src = "./" + allImages[i].src
		
		draw(ctx, imArr[i], allImages[i].x, allImages[i].y);

		i++;	
	}

//	var divHeight = document.getElementById("resIm").offsetHeight;
//	var divWidth = document.getElementById("resIm").offsetWidth;

//	console.log("divHeight = " ,divHeight, "\ndivWidth = ", divWidth);

	console.log("end");
}

function draw(ctx, img, x, y){	
	if(!img.complete){
		setTimeout(function(){
			draw(ctx, img, x, y);
		}, 50);
	}
	console.log("img completer?");
	ctx.drawImage(img, x, y);
}

function setLetterInfo(pathName, xVal, yVal){
	var temp = {src: pathName, x: xVal, y: yVal};
	return temp;
}

// allImages and currWord is array of maps
function pushWord (allImages, currWord){
	for(var i = 0; i < currWord.length ; i++){
		allImages.push(currWord[i]);
	}
	return allImages;
}

// update the new parametes of the elements
// in currWord. currY should pass updated
function nextLineUpdate (currWord, currY, lineS, srcImWidth){
	for(var i = 0; i < currWord.length ; i++){
		currWord[i].x = lineS - (srcImWidth * i);
		currWord[i].y = currY;
	}
	return currWord;
}


// check the text area for correct input
// i.e. ת-א  or 0-9 or ?!., '\n'
// otherwise cleans the last one
function cleanTA(e){
  var textfield = document.getElementById(e);
  var regex = /[^א-ת \n]/gi;

  if (textfield.value.search(regex) > -1){
    document.getElementById('status').innerHTML = "ניתן לכתוב תוים מהצורה [א-ת 'רווח' 'אנטר']";
    textfield.value = textfield.value.replace(regex, "");
  }
}

function imageExists(image_url){

    var http = new XMLHttpRequest();

    http.open('HEAD', "final-images/test.png", false);
    http.send();

    return http.status != 404;

}

function setInMid(currWord, bgWidth, srcImWidth){
	var mid = bgWidth/2; //takes mid of BG
	var startPos = Math.floor(mid + ((currWord.length-1) * srcImWidth * 0.5)); //adds half the wordLen
	console.log("startPos = ", startPos);

	for(var i = 0; i < currWord.length; i++){
		currWord[i].x = startPos;
		startPos = startPos - srcImWidth;
	}
	return currWord;
}