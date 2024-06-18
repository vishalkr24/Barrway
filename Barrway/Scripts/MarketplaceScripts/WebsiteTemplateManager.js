$(document).ready(function () {
    var palettes = getCompanyWebsitePalette().Data;
    var paletteId = $("#hiddenInputPaletteId").val();

    if (palettes != null) {
        var palette = palettes.find(x => x.Id == paletteId);
        var r = document.querySelector(':root');

        r.style.setProperty('--primary-color', palette.PRIMARY_COLOR);
        r.style.setProperty('--secondary-color', palette.SECONDARY_COLOR);
        r.style.setProperty('--text-color', palette.TEXT_COLOR);
        r.style.setProperty('--background-color', palette.BACKGROUND_COLOR);
        r.style.setProperty('--special-area-color', palette.SPECIAL_AREA_COLOR);

    }

})