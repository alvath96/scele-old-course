'use strict';

$(window).load(function() {
	function parse(data, archived) {
		return $.map(data, function (link, key) {
			return {
				href: $(link).attr('href'),
				text: $(link).text(),
				archived: archived
			};
		});
	}

	var all_courses = $('#inst25 > div > ul > li > div > a');
	// all courses, default is hidden (later will be filtered with "enrolled courses")
	var all = parse(all_courses, false);

	function changeDisplay(courses) {
		var $nav = $('.nav > li:nth-last-child(1)').children('ul').empty();
		var $inst25 = $('#inst25 > div > ul').empty();

		$.each(courses, function (key) {
			// append to navbar
			$nav.append('<li><a href="' + this.href + '">' + this.text + '</a></li>');
			
			// append to "my courses"
			$inst25.append('<li class="' + (this.archived ? 'enrolled' : 'archived hidden') +'"><div class="column c1"><a href="' + this.href + '">'
							+ '<img src="https://scele.cs.ui.ac.id/theme/image.php/lambda/core/1472119013/i/course" class="icon" alt="" />' 
							+ this.text + '</a></div></li>');

			// if next course is archived
			if (courses[key].archived && !courses[key + 1].archived) {
				$nav.append('<span style="padding:10px;">Archieved Courses</span>');
				
				$inst25.append('<li><div class="column c1" style="float:left"><a href="#" id="btn_display">Show/Hide courses</a>');
				$inst25.append('<span style="float:right"><a href="https://scele.cs.ui.ac.id/blocks/my_enrolled_courses/showhide.php?contextid=16984" title="Settings">'
								+ '<img class="iconsmall actionmenu" alt="" src="https://scele.cs.ui.ac.id/theme/image.php/lambda/core/1472119013/t/edit" />'
								+ '</a></span></div></li><br />');

				$('#btn_display').click(function (e) {
					e.preventDefault();
					if ($('.archived:nth(1)').hasClass('hidden')) $('.archived').removeClass('hidden');
					else $('.archived').addClass('hidden');
				});
			}
		});
	}

	if ($('#block-login').length == 0) {
		$.ajax({
			url: 'https://scele.cs.ui.ac.id/my'
		}).done(function($data) {
			var enrolled_courses = $($data).find('#course_list_in_block > li > div > a');

			if (enrolled_courses.length > 0) {
				var shown = parse(enrolled_courses, true);
				var hrefs = $.map(shown, function (val, key) { return val.href; });

				var hidden = all.filter(function(val, key) {
					return (hrefs.indexOf(val.href) == -1);
				});

				var courses = shown.concat(hidden);
				changeDisplay(courses);
			}
		});
	}
});