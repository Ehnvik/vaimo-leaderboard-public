$(() => {
    $('button').hover(
        function() {
            $(this).text('Go!');
        },
        function() {
            $(this).text('Ready');
        }
     );
});
