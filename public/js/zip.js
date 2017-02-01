$(function() {
  var source = $('#compliancy-template').html();
  var template = Handlebars.compile(source);
  var context = {};
  var placeholder = $('#main')
  var states = ['AK', 'CA', 'CO', 'DC', 'FL', 'HI', 'IA', 'ID', 'IN', 'KS', 'LA', 'MA', 'MD', 'ME', 'MN', 'MO', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'OR', 'PA', 'SC', 'TN', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']


  console.log(source);
  $('#confirm').on('click', function(e) {
    e.preventDefault()
    placeholder.empty();
    const zip = $('#zip').val()
    console.log(zip);
    $.ajax({
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=AIzaSyA7KP1IzEaZnUB-ho2ffdUvq1bYK-qxfkk`,
      method: 'GET',

    })
    .done(function(data) {
      console.log(data.results[0]["address_components"]);
      var state = data.results[0]["address_components"][3]["short_name"];
      var longState = data.results[0]["address_components"][3]["long_name"];
      var data = states.indexOf(state) !== -1 ? 'Good news! We ship to ' + longState : 'Looks like you need to move to another state, we dont ship to ' + longState
      context.data = data
      var html = template(context);
      console.log(context);
      placeholder.append(html)
    })
  })
})
