

$(document).ready(function() {
  $('.delete-article').on('click', function(e) {
    $target = $(e.target);
    const id = $target.attr('data-id');

    $.ajax({
      type: 'DELETE', // delete request
      url: '/article/' +id, // where the request goes
      success: function(response) {
        alert('deleting article post');
        window.location.href = '/';
      },
      failure: function(err) {
        console.log(err)
      }
    })

  })
});
