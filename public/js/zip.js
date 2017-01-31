// $(function() {
//   $('#confirm').on('click', function(e) {
//     e.preventDefault();
//     const zip = e.target.val();
//     $.ajax({
//       url: `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=AIzaSyA7KP1IzEaZnUB-ho2ffdUvq1bYK-qxfkk`,
//       method: 'GET',
//
//     })
//     .done(function(data) {
//       var state = data.results[0]["address_components"][3]["short_name"];
//
//     })
//   })
// })
