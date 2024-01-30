$(document).ready(function () {
    debugger;
    var palettes = JSON.parse(getCompanyWebsitePalette());
    var paletteId = $("#hiddenInputPaletteId").val();

    if (palettes != null) {
        var palette = palettes["Palette" + paletteId];
        var r = document.querySelector(':root');

        r.style.setProperty('--primary-color', palette["--primary-color"]);
        r.style.setProperty('--secondary-color', palette["--secondary-color"]);
        r.style.setProperty('--text-color', palette["--text-color"]);
        r.style.setProperty('--background-color', palette["--background-color"]);
        r.style.setProperty('--special-area-color', palette["--special-area-color"]);

    }

})