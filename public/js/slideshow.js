var $ = jQuery;

var itemEditor = $('#item-editor');

itemEditor.on('click', '.js-Remove', function (e) {
	e.preventDefault();
	$(this).parents('.js-Slide').remove();
	updateIndices();
});

itemEditor.on('click', '.js-AddSlide', function (e) {
	e.preventDefault();
	var textEl = document.createElement('div');
	var textBox = '/editor/fragment/slide';
	$(textEl).load(textBox, function () {
		itemEditor.find('.js-ContentDynamic').append($(textEl).html());
		updateIndices();
	});
});


function updateIndices() {
	itemEditor.find('.js-Slide').each(function (i) {
		$(this).find("[name*='images']").each(function () {
			const name = $(this).attr('name');
			$(this).attr('name', name.replace(/\[\d?\]/, `[${i}]`));
		});
	});
}