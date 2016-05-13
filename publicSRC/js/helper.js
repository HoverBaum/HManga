export default class Helper {

	static get(url, callback) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
					console.debug(request.responseText);
					callback(request.responseText);
                }
            }
            request.onerror = function () {
                callback(null);
            }
            request.open('GET', url);
            request.send();
	}

}
