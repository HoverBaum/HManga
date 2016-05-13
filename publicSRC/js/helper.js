export default class Helper {

	static get(url, callback) {
		console.debug(`getting ${url}`);
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
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
