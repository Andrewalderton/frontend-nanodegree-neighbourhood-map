import 'jquery-ui/ui/widgets/autocomplete';
//import 'knockout';

// Auto-complete jquery plugin.
var filterNames = [];
//var userInput;
var autocomplete = $(document).ready(function () {
    $("#filter").autocomplete({
        source: filterNames,
        autoFocus: true,
        select: function (e, ui) {
            global.userInput(ui.item.value);
            console.log(global.userInput());
        }
    });
});

export {
    filterNames,
    autocomplete
};