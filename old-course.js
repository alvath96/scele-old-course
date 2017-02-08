$(document).ready(function() {
	var course_base_link = 'https://scele.cs.ui.ac.id/course/view.php?id=';
	var courses = null;
	var show_old = false;
	var $my_course = $('#inst25 > .content');
	var npmText = $('.usertext').text().match(/\d{10}/g);
	var npm = npmText != null && npmText.length > 0 ? npmText[0] : null;
	
	function saveData() {
		if (npm) {
			localStorage.setItem(npm, JSON.stringify(courses));
		}
	}

	function getLocalData() {
		if (npm) {
			return JSON.parse(localStorage.getItem(npm));
		}
	}

	function getCourseData() {
		courses = {};
		
		course_new = {};
		$course_list = $my_course.children('ul').children('li');
		$course_list.each(function () {
			$link = $(this).children('div').children('a');
			var id = "" + $link.attr('href').match(/id=([^&]+)/)[1];
			course_new["i" + id] = {
				'id': id,
				'name': $link.text(),
			};
		});

		courses['new'] = course_new;
		courses['old'] = {};

		saveData();
		return courses;
	}

	function modifyMyCourses() {
		// check if "My Courses" board exists
		if (npm == null || $('#inst25 > .header > div > h2').text() != "My courses") {
			return;
		}

		$my_course.children('ul').remove();

		html = '<ul class="unlist">';
		$.each(courses.new, function (index, course) {
			html += '<li><div class="course column c1">'
					+ '<img src="https://scele.cs.ui.ac.id/theme/image.php/lambda/core/1472119013/i/course" class="icon" alt="">'
					+ '<a href="' + course_base_link + course.id + '">' + course.name + '</a>'
					+ ' <a href="#" class="mark-old" title="mark as old course" data-id="' + course.id +'">o</a>'
					+ '</div></li>';
			
		});
		if (Object.keys(courses.old).length > 0) {
			html += '<div id="old"><a id="btn-old-course" href="#">Show old courses</a></div>';
		}

		html += '</ul>';

		$my_course.prepend(html);
		displayOldCourse();

		$("#btn-old-course").click(function(e) {
			e.preventDefault();
			show_old = !show_old;
			displayOldCourse();
			saveData();
		});

		$(".mark-old").click(function (e) {
			e.preventDefault();
			var id = $(this).attr('data-id');
			course = courses.new["i" + id];
			delete courses.new["i" + id];
			courses.old["i" + id] = course;
			modifyMyCourses();
			saveData();
		});
	}

	function displayOldCourse() {
		if (!show_old) {
			$('#oldlist').remove();
			$('#btn-old-course').text('Show old course');
		} else {
			html = '<ul id="oldlist" class="unlist">';

			$.each(courses.old, function (index, course) {
				html += '<li><div class="course column c1">'
						+ '<img src="https://scele.cs.ui.ac.id/theme/image.php/lambda/core/1472119013/i/course" class="icon" alt="">'
						+ '<a href="' + course_base_link + course.id + '">' + course.name + '</a>'
						+ ' <a href="#" class="mark-new" title="mark as new course" data-id="' + course.id + '">n</a>'
						+ '</div></li>';
			});

			html += '</ul>';

			$("#old").append(html);
			$('#btn-old-course').text('Hide old course');

			$(".mark-new").click(function (e) {
				e.preventDefault();
				var id = $(this).attr('data-id');
				course = courses.old["i" + id];
				delete courses.old["i" + id];
				courses.new["i" + id] = course;
				modifyMyCourses();
				saveData();
			});
		}
	}

	courses = getLocalData();
	if (courses == null || courses == undefined) {
		getCourseData();
	}

	if (npm) {
		$navs = $('.nav > li');
		$my_course_nav = $navs[$navs.length - 2];
		$nav_courses = $($my_course_nav).children('ul').children('li');
		
		$nav_courses.each(function() {
			$link = $(this).children('a');
			$link.text($link.attr('title'));
		});
	}

	modifyMyCourses();
});