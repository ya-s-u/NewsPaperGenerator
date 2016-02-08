$(function(){
  var articleModal = $(".articleModal")
  var editorModal = $(".editorModal")
  var overlay = $(".overlay")
  var selectedIndex = 0;

  $(".editor .articles li").click(function(){
    editorModal.css({"display": "block"})
    overlay.css({"display": "block"})
    selectedIndex = $('.editor .articles li').index(this);
  });

  $(".addArticle").click(function(){
    var url = "http://localhost:8080/content?url=" + $('.urlInput').val()
    $.ajax({
      url: url,
      type: 'GET',
    })
    .done(function(data) {
      console.log(data)
      $('.editor .articles li').eq(selectedIndex).html("\
      <h2>"+ data.title +"</h2>\
      <p>"+ data.content +"</p>\
      <p>"+ data.content +"</p>\
      <p>"+ data.content +"</p>\
      <p>"+ data.content +"</p>\
      <p>"+ data.content +"</p>\
      ")
    })
    .fail(function(data) {
      console.log(data)
    });
  });

  $(".preview .articles li").click(function(){
    articleModal.css({"display": "block"})
    overlay.css({"display": "block"})
    articleModal.html(this.innerHTML)
  });

  $(".overlay").click(function(){
    articleModal.css({"display": "none"})
    editorModal.css({"display": "none"})
    overlay.css({"display": "none"})
  });

  $('#sortable').sortable();
  $('#sortable').disableSelection();
})
