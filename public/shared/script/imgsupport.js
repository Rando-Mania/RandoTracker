(function(document) {
	var checkCount = 0,
		formatFound = false;

	function setHTMLClass(height, className) {
		checkCount++;
		if (height == 2) {
			formatFound = true;
			document.documentElement.className += ' ' + className;
		} else {
			document.documentElement.className += ' not' + className;
			if (checkCount == 4 && !formatFound) {
				if (document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")) {
					document.documentElement.className += ' svg';
				} else {
					document.documentElement.className += ' notsvg png';
				}
			}
		}
	}

	var JXL = new Image();
 	JXL.onload = JXL.onerror = function () {
    setHTMLClass(JXL.height, "jxl");
  	};
  	JXL.src = "data:image/jxl;base64,/woIELASCAgQAFwASxLFgkWAHL0xqnCBCV0qDp901Te/5QM=";

	var AVIF = new Image();
	AVIF.onload = AVIF.onerror = function () {
		setHTMLClass(AVIF.height, 'avif');
	};
	AVIF.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';

	var WebP = new Image();
	WebP.onload = WebP.onerror = function() {
		setHTMLClass(WebP.height, 'webp');
	};
	WebP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
})(window.sandboxApi && window.sandboxApi.parentWindow && window.sandboxApi.parentWindow.document || document);
