// *******************************
// *       AUTOCOMPLETE         *
// *******************************


import 'jquery-ui/ui/widgets/autocomplete';

const filterNames = [];

// Auto-complete jquery plugin.
const autocomplete = $(document).ready(function () {
    $("#filter").autocomplete({
        source: filterNames,
        autoFocus: true,
        select: function (e, ui) {
            global.userInput(ui.item.value);
        }
    });
});

export {
    filterNames,
    autocomplete
};