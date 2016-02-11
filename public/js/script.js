$(function(){
  var modal = $("#modal");
  var overlay = $(".overlay");
  var selectedIndex = 0;

  // 4:3と16:9を変更
  $("#switch_btn").click(function() {
    if( $(this).hasClass("by_16_9") ) {
      $(this).removeClass("by_16_9");
      $(this).addClass("by_4_3");
      $(this).text("16 : 9 に変更");
      $(".articles_area").removeClass("by_16_9");
      $(".articles_area").addClass("by_4_3");
    } else {
      $(this).removeClass("by_4_3");
      $(this).addClass("by_16_9");
      $(this).text("4 : 3 に変更");
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
    var reverse = $this.attr("reverse") || "false";
    $("#article_title").val(title);
    $("#article_body").val(body);
    $("#confirmation_image").attr("src", image);
    if(image == "") {
      $("#confirmation_image").hide();
    } else {
      $("#confirmation_image").show();
    }
    if(reverse == "true") {
      $("#reverse").prop("checked", true);
    } else {
      $("#reverse").prop("checked", false);
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
    var selected_font = $(".selected span").text();
    if( $("#reverse").prop('checked') ) {
      var reverse = true;
    } else {
      var reverse = false;
    }
    insertArticle(selectedIndex, title, body, image, selected_font, reverse);
    closeModal();
  });

  // indexの記事にtitle, body, imageの記事を挿入
  function insertArticle(index, title, body, image, font, reverse) {
    $this = $('.editor .articles li').eq(index);
    $this.attr("title", title);
    $this.attr("body", body);
    $this.attr("image", image);
    $this.attr("font", font);
    $this.attr("reverse", reverse);
    if(title == "" && body == "") return;
    $this.html("");
    //$this.html("<h2>"+title+"</h2><br><p>"+body+"</p>");

    var width = $this.width();
    var height = $this.height();
    if( height < 180 ) {
      var rows = [{width: width, height: height}];
    } else if (height < 360) {
      var rows = [
        {width: width, height: height / 2},
        {width: width, height: height / 2}
      ];
    } else if (height < 540) {
      var rows = [
        {width: width, height: height / 3},
        {width: width, height: height / 3},
        {width: width, height: height / 3}
      ];
    } else {
      var rows = [
        {width: width, height: height / 4},
        {width: width, height: height / 4},
        {width: width, height: height / 4},
        {width: width, height: height / 4}
      ];
    }

    $(".editor .articles li").eq(selectedIndex).VerticalTextBox( {
      position: {
        x: $this.position().left,
        y: $this.position().top,
        align: "right" 
      },
      rows: rows,
      title: {
        text: title,
        size: 24,
        font: font,
        reverse: reverse
      },
      content: {
        text: body,
        size: 15
      }
    });
  }

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
  

  var draggingIndex;
  // 記事をドラッグ開始
  $(".editor .articles li").draggable( {
    opacity: 0.5,
    cursor: "pointer",
    zIndex: 100,
    start: function(event, ui) {
      draggingIndex = $('.editor .articles li').index(this);
    },
    stop: function(event, ui) {
      var left = ui.offset.left + $("#articles").offset().left;
      var top = ui.offset.top + $("#articles").offset().top - 30;
      $(".editor .articles li").each(function(i, elem) {
        var l = $(elem).offset().left;
        var t = $(elem).offset().top;
        var w = $(elem).width();
        var h = $(elem).height();
        // 当たり判定
        if( (l < left) && (left < l+w) && (t < top) && (top < t+h) ) {
          console.log(i, "と同じ位置");
          swapArtcile(draggingIndex, i);
        }
      });
    }
  });

  // index1とindex2の記事を入れ替える
  function swapArtcile(index1, index2) {
    $index1 = $(".editor .articles li").eq(index1);
    $index2 = $(".editor .articles li").eq(index2);

    var title1 = $index1.attr("title") || "";
    var body1 = $index1.attr("body") || "";
    var image1 = $index1.attr("image") || "";
    var font1 = $index1.attr("font") || "";
    var reverse1 = $index1.attr("reverse") || false;

    var title2 = $index2.attr("title") || "";
    var body2 = $index2.attr("body") || "";
    var image2 = $index2.attr("image") || "";
    var font2 = $index2.attr("font") || "";
    var reverse2 = $index2.attr("reverse") || false;

    $index1.removeAttr("style");
    $index2.removeAttr("style");

    insertArticle(index1, title2, body2, image2, font2, reverse2);
    insertArticle(index2, title1, body1, image1, font1, reverse1);
  }

  // htmlとしてアウトプット
  $("#html_output").click(function() {
    var url = $(this).attr("href") + "?html=" + $(".wrapper").html();
    window.open(url, "_blank");
    return false;
  });

  // 画像としてアウトプット
  $("#image_output").click(function() {
    // html2canvas(document.body, {
    //   onrendered: function(canvas) {
    //     $("#ss").attr('src', canvas.toDataURL("image/png") );
    //     $("#ss").show();
    //   }
    // })

    var url = "http://localhost:8080/public/editor.html";
    var url = "http://localhost:8080/output_as_html" + "?html=" + $(".wrapper").html();
    var top = $("#articles").offset().top;
    var left = $("#articles").offset().left;
    var width = $("#articles").width();
    var height = $("#articles").height();
    $.ajax({
      url: "/capture",
      data: {url: url,top: top, left: left, width: width, height: height},
      type: "get"
    })
    .done(function(data) {
      $("#ss").attr("src", "data:image/png;base64," + data);
      $("#ss").show();
    })
    .fail(function(data) {
      alert("failed");
    });
    stopLoading();

    return false;
  });

  // フォント一覧表示
  var selecetd_font = "sans-serif";
  $(".dropdown").click(function() {
    $(".dropdown-menu").toggle();
  });
  $(".dropdown-menu li").click(function() {
    $(".dropdown-menu li.selected").removeClass("selected");
    $(this).addClass("selected");
    selected_font = $(this).find("span").text();
  });

  // リバースかどうか
  $("#reverse").click(function() {
    if($(this).val() == "true") {
      $(this).val("false");
    } else {
      $(this).val("true");
    }
  });

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
