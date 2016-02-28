$(function(){
  var modal = $("#modal");
  var overlay = $(".overlay");
  var lastLayouts = 1;
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
    reload();
  });

  // レイアウト変更
  $(".layouts").click(function() {
    var id = $(this).attr("data-id");
    var lastLayoutsClass = "layout" + lastLayouts;
    var nowLayoutsClass = "layout" + id;
    console.log(lastLayoutsClass, nowLayoutsClass);
    $(".articles").removeClass(lastLayoutsClass);
    $(".articles").addClass(nowLayoutsClass);
    lastLayouts = id;
    $("." + lastLayoutsClass).removeClass("selected");
    $(this).addClass("selected");
    reload();
  });

  $(".dropdown").click(function() {
    $(this).next(".dropdown-menu").toggle();
  });

  // フォント一覧表示
  var selecetd_font = "sans-serif";
  $(".dropdown-menu.font li").click(function() {
    $(".dropdown-menu.font li.selected").removeClass("selected");
    $(this).addClass("selected");
    selected_font = $(this).find("span").text();
  });  

  // タイトルフォントサイズ変更
  var title_size = '24';
  $('.dropdown-menu.title_size li').click(function() {
    $(".dropdown-menu.title_size li.selected").removeClass('selected');
    $(this).addClass('selected');
    title_size = $(this).text();
  });

  var body_size = '16';
  $('.dropdown-menu.body_size li').click(function() {
    $(".dropdown-menu.body_size li.selected").removeClass('selected');
    $(this).addClass('selected');
    body_size = $(this).text();
  });

  var background = 'normal';
  $('.dropdown-menu.background li').click(function() {
    $('.dropdown-menu.background li.selected').removeClass('selected');
    $(this).addClass('selected');
    background = $(this).attr('data-bg');
  });

  // 再挿入
  function reload() {
    $(".editor .articles li").each(function(i, elem) {
      var articleData = getDataFromArticle(i);
      insertArticle(i, articleData.title, articleData.title_size, articleData.body, articleData.body_size, articleData.image, articleData.font, articleData.background, articleData.hasImage);
    });
  }

  // 記事をクリックしたらモダール表示
  $(".editor .articles li").click(function(){
    openModal();
    selectedIndex = $('.editor .articles li').index(this);
    var articleData = getDataFromArticle(selectedIndex);
    $("#article_title").val(articleData.title);
    $("#article_body").val(articleData.body);
    $("#confirmation_image").attr("src", articleData.image);
    if(articleData.image == "") {
      $("#confirmation_image").hide();
    } else {
      $("#confirmation_image").show();
    }
    if(articleData.hasImage == true) {
      $("#show_image").prop("checked", true);
    } else {
      $("#show_image").prop("checked", false);
    }
  });

  // 記事更新を押したらフォームの内容を記事に流し込む
  $("#update").click(function(e) {
    e.preventDefault();
    var title = $("#article_title").val();
    var body = $("#article_body").val();
    var image = $("#confirmation_image").attr("src");
    var selected_font = $(".selected span").text();
    if( $("#show_image").prop("checked") ) {
      var hasImage = true;
    } else {
      var hasImage = false;
    }
    insertArticle(selectedIndex, title, title_size, body, body_size, image, selected_font, background, hasImage);
    closeModal();
  });

  // indexの記事にtitle, body, imageの記事を挿入
  function insertArticle(index, title, title_size, body, body_size, image, font, background, hasImage) {
    // 全角を半角に変更
    title = title.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    body = body.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });

    $this = $('.editor .articles li').eq(index);
    $this.empty();
    $this.removeAttr("style");
    $this.attr("body", body);
    $this.attr('title_size', title_size);
    $this.attr('body_size', body_size);
    $this.attr("image", image);
    $this.attr('background', background)
    //$this.prop("reverse", reverse);
    $this.prop("hasImage", hasImage);
    if(title=="" && body=="") return;
    var width = $this.width();
    var height = $this.height();
    if( height < 230 ) {
      var rows = [{width: width, height: height}];
    } else if (height < 460) {
      var rows = [
        {width: width, height: height / 2},
        {width: width, height: height / 2}
      ];
    } else {
      var rows = [
        {width: width, height: height / 3},
        {width: width, height: height / 3},
        {width: width, height: height / 3}
      ];
    }

    var imageUrl = (hasImage) ? image : ""

    $this.VerticalTextBox( {
      position: {
        x: $this.position().left,
        y: $this.position().top,
        align: "right"
      },
      rows: rows,
      title: {
        text: title,
        size: title_size,
        font: font,
        reverse: background
      },
      content: {
        text: body,
        size: body_size
      },
      image: {
        src: imageUrl
      }
    });
  }

  // クリックした記事からタイトルなどの情報を取得する　return title:string, body:string, image:string, font:font, reverse:boolean
  function getDataFromArticle(index) {
    var $this = $('.editor .articles li').eq(index);
    var title = $this.find("h2").text() || "";
    var title_size = $this.attr("title_size") || "22";
    var body = $this.attr("body") || "";
    var body_size = $this.attr("body_size") || "18";
    var image = $this.attr("image") || "";
    //var reverse = $this.prop("reverse") || false;
    var background = $this.attr('background') || "normal";
    var font = $this.find("h2").css("font-family") || "";
    var hasImage = $this.prop("hasImage") || "";
    return {title: title, title_size: title_size, body: body,  body_size: body_size, image: image, font: font, background: background, hasImage: hasImage}
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
  var originTop, originLeft;
  // 記事をドラッグ開始
  $(".editor .articles li").draggable( {
    opacity: 0.5,
    cursor: "pointer",
    helper: "clone",
    start: function(event, ui) {
      draggingIndex = $('.editor .articles li').index(this);
    },
    stop: function(event, ui) {
      var top = event.pageY;
      var left = event.pageX;
      $(".editor .articles li").each(function(i, elem) {
        var l = $(elem).offset().left;
        var t = $(elem).offset().top;
        var w = $(elem).width();
        var h = $(elem).height();
        // 当たり判定
        if( (l < left) && (left < l+w) && (t < top) && (top < t+h) ) {
          console.log(draggingIndex, i);
          if(i != draggingIndex) {
            swapArtcile(i, draggingIndex);
          }
          return;
        }
      });
    }
  });

  // index1とindex2の記事を入れ替える
  function swapArtcile(index1, index2) {
    var article1Data = getDataFromArticle(index1);
    var article2Data = getDataFromArticle(index2);

    insertArticle(index1, article2Data.title, article2Data.title_size, article2Data.body, article2Data.body_size, article2Data.image, article2Data.font, article2Data.reverse, article2Data.hasImage);
    insertArticle(index2, article1Data.title, article1Data.title_size, article1Data.body, article1Data.body_size, article1Data.image, article1Data.font, article1Data.reverse, article1Data.hasImage);
    reload();
  }

  // htmlとしてアウトプット
  $("#html_output").click(function() {
    var html = $(".wrapper").html();
    console.log(html);
    var url = $(this).attr("href") + "?width=" + $(".wrapper").width() + "&height=" + $(".wrapper").height() +"&html=" + html;
    window.open(url, "_blank");
    return false;
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
