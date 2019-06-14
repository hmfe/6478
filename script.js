$(document).ready(function() {
  // Create search field
  $(".user-data-from-api").select2({
    minimumInputLength: 1,
    delay: 300, // delay search for the api
    ajax: {
      url: "https://5d00ea66d021760014b754e0.mockapi.io/users",
      data: function(params) {
        var query = {
          search: params.term
        };
        // Query parameters will be ?search=[term]
        return query;
      },
      dataType: "json",
      maximumSelectionLength: 0, // Don't display values in input field
      processResults: function(data, params) {
        // Process results before displayed for the user
        var dataArray = [];

        // Prepare data as id and text to display correctly for select2
        $.each(data, function(i, item) {
          dataArray.push({ id: item.id, text: item.name });
        });

        // Make typed in chars bold in result
        return {
          results: $.map(dataArray, function(obj) {
            var term = params.term;
            var reg = new RegExp(term, "gi");
            var optionText = obj.text;
            var boldTermText = optionText.replace(reg, function(optionText) {
              return `<strong>${optionText}</strong>`;
            });
            var text = $(`<span> ${boldTermText}  </span>`);
            return { id: obj.id, text: text };
          })
        };
      }
    }
  });

  // When pressing Enter, catch the event and save history
  $(".user-data-from-api").on("select2:select", function(e) {
    var data = e.params.data;

    var username = data.text.text();
    var dateString = getDateString(new Date());

    // Append to search history list
    $(".no-history").html("");
    $(".search-history-list").append(
      '<li class="list-group-item">' +
        '<div class="row"><div class="col-7 pl-0">' +
        username +
        "</div>" +
        '<div class="col-4 text-right date">' +
        dateString +
        "</div>" +
        '<div class="col-1 text-right">' +
        "<a href='' class='delete'><i class='fas fa-times'></i></a>" +
        "</div>" +
        "</li>"
    );
  });
});

// Remove closest li when clicking the delete-icon
$(".search-history-list").on("click", "li a.delete", function() {
  $(this)
    .closest("li")
    .remove();
  return false;
});

// Clear all history in list and add the "No search history yet."-text
$("#clear-search-history").on("click", function() {
  $(".search-history-list").html(
    $("<li/>")
      .addClass("list-group-item no-history pl-0")
      .text("No search history yet")
  );
  return false;
});

$("ul .select2-selection__rendered").append(
  '<span class="select2-selection__clear" title="Remove all items" data-select2-id="26">×</span>'
);

// Return formated date + time
// (Eg. 2019-06-13 2:19 PM)
function getDateString(date) {
  var yyyy = date.getFullYear();
  var MM = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1); // get month with 2 digits
  var dd = (date.getDate() < 10 ? "0" : "") + date.getDate(); // get day with 2 digits
  var time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });

  return yyyy + "-" + MM + "-" + dd + " " + time;
}
