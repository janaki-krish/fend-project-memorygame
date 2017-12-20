
/*
 * Create a list that holds all of your cards
 */
const MYCARDPAIRS = 8;
let deckOfCards = ["fa-bicycle", "fa-bicycle", "fa-bullhorn", "fa-bullhorn",
					"fa-cube", "fa-cube", "fa-diamond", "fa-diamond",
					"fa-snowflake-o", "fa-snowflake-o", "fa-car", "fa-car",
					"fa-flask", "fa-flask", "fa-anchor", "fa-anchor"];

let movesCounter = 0;
let index = 0;
let openCardsArray=[];
let moves2 = 8;
let moves3 = 14;
let matchedPairs = 0;

let timerRun = false;
let minutes=0;
let seconds=0;
let timerVar;
let numStars = 3;


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


/**
*	@description	Shuffle function from http://stackoverflow.com/a/2450976
*/
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


/**
*	@description The following set of functions are related to the stars updation based on the number of moves
*/
function updateStars() {
	{
		$(".fa-star").last().attr("class", "fa fa-star-o");
		if (numStars > 0)
		{
			numStars--;
		}
		$(".numStars").text(numStars);
	}
}

function resetStars() {
	$(".stars i").attr("class", "fa fa-star");
	numStars=3;
}


/**
*	@description Update the number of moves made
*/
function updateMoveCounter() {
	$(".moves").text(movesCounter);
	if ((movesCounter == moves2) || (movesCounter == moves3))
		updateStars();
}



/**
*	@description	The following set of functions are related to the timer -
*					start/stop the timer, update the interface
*/
function updateTimerValues() {
	if (seconds < 10)
		seconds = "0"+seconds;

	$(".timeSpan").text(minutes+ ":"+seconds);
}

function initializeTimer() {
	seconds++;
	if (seconds == 60)
	{
		minutes++;
		seconds=0;
	}
		updateTimerValues();
}

function resetTimer() {
	clearInterval(timerVar);
	seconds=0;
	minutes=0;
	timerRun = false;
	updateTimerValues();
}


/**
*	@description	When the user clicks on a card, check if it is clickable.
*					eg: click on a matched card should return false.
*/
function isValidCard(card) {
	if (card.hasClass("open") || card.hasClass("match"))
		return false;
	else
		return true;
}

function openCard(card) {
	if (!card.hasClass("open"))
	{
		card.toggleClass("flip");
		card.addClass("open");
		card.addClass("show");
		openCardsArray.push(card);
	}

}

let resetOpenState = function() {

	openCardsArray.forEach(function(card){
		card.toggleClass("open");
		card.toggleClass("show");
	});
	resetOpenCardsArray();
}

function resetOpenCardsArray() {
	openCardsArray = [];
}


/**
*	@description	The following set of functions handle the match functionality
*/
/**
*	@description	check if the class of the two open cards are same
*/
function checkMatch()
{
	if (openCardsArray[0].children().attr("class") == openCardsArray[1].children().attr("class"))
		return true;
	else
		return false;
}

/**
*	@description	Keep track of the number of pairs matched
*/
function incrementAndCheckMatchedPairs()
{
	matchedPairs++;
	if (matchedPairs == MYCARDPAIRS)
	{
		return true;
	}
	return false;
}

/**
*	@description	Highlight the pair once they are matching
*/
function highlightMatchedPairs() {
	openCardsArray.forEach(function(card) {
		{
			card.toggleClass("highlight");
		}
	});
}

/**
*	@description	reset the matched pairs count - called as part of restart functionality
*/
function resetMatchCount() {
	matchedPairs=0;
}

/**
*	@description	Card click functionality
*	-Start the timer when the first card is clicked
*	-open the first card
*	-if second, check if it matches with the first
*	-if match, highlight the pair, if all card pairs are matched throw a success dialog
*	-if no match, reset the open state of the cards
*	-update the number of moves
*/
let onCardClick = function() {
	if (timerRun == false)
	{
		setTimeout(initializeTimer, 0);
		timerVar = setInterval(initializeTimer, 1000);
		timerRun = true;
	}
	if (isValidCard($(this)))
	{
		if (openCardsArray.length == 0) {
			openCard($(this));
		}
		else if (openCardsArray.length == 1)
		{
			openCard($(this));
			movesCounter++;
			updateMoveCounter();

			if (checkMatch())
			{
				highlightMatchedPairs();
				if (incrementAndCheckMatchedPairs())
				{
					clearInterval(timerVar);
					$("#success-modal").modal();
					$("#success-modal").modal("show");
				}
				resetOpenCardsArray();

			}
			else
			{
				setTimeout(resetOpenState, 1000);
			}
		}
	}
}


function resetCards() {
	resetOpenCardsArray();
	shuffle(deckOfCards);
	$.each($(".mcard i"), function() {
		$(this).attr("class", "fa " + deckOfCards[index]);
		index++;
	});
}

let resetGame = function() {
	movesCounter = 0;
	index=0;
	$(".mcard").attr("class", "mcard");
	resetTimer();
	resetCards();
	updateMoveCounter();
	resetStars();
	resetMatchCount();
	$("#success-modal").modal("hide");
}

$(".mcard").click(onCardClick);
$(".fa-repeat").click(resetGame);
$(".restart").click(resetGame);
resetGame();