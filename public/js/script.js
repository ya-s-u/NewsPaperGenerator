$(function(){

  // 4:3と16:9を変更
  $("#switch_btn").click(function() {
    if( $(this).hasClass("by_16_9") ) {
      $(this).removeClass("by_16_9");
      $(this).addClass("by_4_3");
      $(this).text("16 : 9");
      $(".articles_area").removeClass("by_16_9");
      $(".articles_area").addClass("by_4_3");
    } else {
      $(this).removeClass("by_4_3");
      $(this).addClass("by_16_9");
      $(this).text("4 : 3");
      $(".articles_area").removeClass("by_4_3");
      $(".articles_area").addClass("by_16_9");
    }
  });

  var modal = $("#modal");
  var overlay = $(".overlay")
  var selectedIndex = 0;

  $(".editor .articles li").click(function(){
    modal.fadeIn("normal");
    overlay.fadeIn("normal");
    selectedIndex = $('.editor .articles li').index(this);

    var html = $('.editor .articles li').eq(selectedIndex).html();
    $("#modal .preview").html(html);
  });

  // 記事を追加を押したら記事をliに流し込む
  $("#addArticle").click(function(){
    var url = "http://localhost:8080/content?url=" + $('.urlInput').val();
    nowLoading();
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
      ");
      stopLoading();
      $('.urlInput').val('');
    })
    .fail(function(data) {
      console.log(data)
      stopLoading();
    });
  });

  $(".preview .articles li").click(function(){
    articleModal.css({"display": "block"})
    overlay.css({"display": "block"})
    articleModal.html(this.innerHTML)
  });

  $(".overlay").click(function(){
    modal.fadeOut("normal");
    overlay.fadeOut("normal");
  });

  $('#sortable').sortable();
  $('#sortable').disableSelection();

  // ロード中に表示
  function nowLoading() {
    $(".loading").show();
  }
  function stopLoading() {
    $(".loading").hide();
    modal.fadeOut("normal");
    overlay.fadeOut("normal");
  }

})
