module.exports = function countdown(tick) {
    let count = 10

    let timer = setInterval(_=>{
	/* Send the count to the function in main.js
	   which will then send it to the frontend */
	tick(count--)
	console.log("count ", count)
	if (count === 0) {
	    clearInterval(timer)
	}
    }, 1000)
}
