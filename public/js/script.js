$(function(){
  var modal = $("#modal");
  var overlay = $(".overlay");
  var selectedIndex = 0;

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

  // 記事をクリックしたらモダール表示
  $(".editor .articles li").click(function(){
    openModal();
    selectedIndex = $('.editor .articles li').index(this);
    $this = $('.editor .articles li').eq(selectedIndex);
    var title = $this.attr("title") || "";
    var body = $this.attr("body") || "";
    var image = $this.attr("image") || "";
    $("#article_title").val(title);
    $("#article_body").val(body);
    $("#confirmation_image").attr("src", image);
    if(image == "") {
      $("#confirmation_image").hide();
    } else {
      $("#confirmation_image").show();
    }
  });

  // 画像を追加したらそれを即時プレビュー
  $("#article_image").change(function() {
    if (!this.files.length) return;
    var file = this.files[0];
    var $img = $("#confirmation_image");
    var fileReader = new FileReader();
    fileReader.onload = function(event) {
      $img.attr("src", event.target.result);
      $img.show();
    }
    fileReader.readAsDataURL(file);
  });


  // 記事更新を押したらフォームの内容を記事に流し込む
  $("#update").click(function(e) {
    e.preventDefault();
    var title = $("#article_title").val();
    var body = $("#article_body").val();
    var image = $("#confirmation_image").attr("src");

    $this = $('.editor .articles li').eq(selectedIndex);
    $this.attr("title", title);
    $this.attr("body", body);
    $this.attr("image", image);

    console.log( $this.css("width") );
    console.log( $this.css("height"));

    $(".editor .articles li").eq(selectedIndex).html("<h2>"+title+"</h2><br><p>"+body+"</p>");

    // $(".editor .articles li").eq(selectedIndex).VerticalTextBox( {
    //   position: {
    //     x: $this.position().left,
    //     y: $this.position().top,
    //     align: "right" 
    //   },
    //   rows: [
    //     {width: $this.css("width"), height: $this.css("height")}
    //   ],
    //   title: {
    //     text: title,
    //     size: 24,
    //     reverse: false
    //   },
    //   content: {
    //     text: body,
    //     size: 18
    //   }
    // });
    closeModal();
  });

  // 記事を追加を押したら一旦フォームに
  $("#search_article").click(function(){
    var url = "http://localhost:8080/content?url=" + $('#article_url').val();
    console.log(url);
    nowLoading();
    $.ajax({
      url: url,
      type: 'GET',
    })
    .done(function(data) {
      console.log(data);
      $("#article_title").val(data.title);
      $("#article_body").val(data.content);
      $("#confirmation_image").attr("src", data.pic);
      $("#confirmation_image").show();
      stopLoading();
      $('#article_url').val('');
    })
    .fail(function(data) {
      console.log(data);
      alert("URLが不正です");
      stopLoading();
    });
  });

  $('#sortable').sortable();
  $('#sortable').disableSelection();


  // オーバーレイクリックでモーダル非表示
  $(".overlay").click(function(){
    closeModal();
  });

  // modal表示
  function openModal() {
    modal.fadeIn("normal");
    overlay.fadeIn("normal"); 
  }

  // modal非表示
  function closeModal() {
    modal.fadeOut("normal");
    overlay.fadeOut("normal");   
  }

  // ロード中に表示
  function nowLoading() {
    $(".loading").show();
  }
  // ロード終了
  function stopLoading() {
    $(".loading").hide();
  }

})
