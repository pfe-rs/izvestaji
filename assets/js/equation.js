document.addEventListener("DOMContentLoaded", function() {
    function renderMath() {
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(document.body, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ],
                throwOnError: false
            });
        }
    }
    renderMath();
});
