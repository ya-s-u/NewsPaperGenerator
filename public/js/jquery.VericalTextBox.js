(function($) {
  // プラグイン宣言
  $.fn.VerticalTextBox = function(options){
    // グローバル変数宣言
    var Box = this;

    // デフォルト引数
    var defaults = {
      position: {
        x: 20,
        y: 20,
        align: "right"
      },
      rows: [
        {width: 0, height: 0}
      ],
      title: {
        text: "",
        size: 22,
        reverse: false
      },
      content: {
        text: "",
        size: 18
      },
      rules: [
        "、", "。", "）", "～"
      ]
    };
    var setting = $.extend(defaults, options);

    // ボックス定義
    var frame = {width: 0, height: 0}
    $.each(setting.rows, function(i, val) {
      if(val.width > frame.width) frame.width = val.width
      frame.height += val.height
    })
    Box.width(frame.width)
    Box.height(frame.height)

    // タイトル
    var title = $("<h2></h2>", {
      width: setting.title.size,
      css: {
        "position": "absolute",
        "top": "0",
        "margin": "0",
        "font-size": setting.title.size,
      },
      html: setting.title.text
    });
    var offset = setting.rows[0].width - setting.title.size
    setting.position.align == "left" ? title.css({"left": offset+"px"}) : title.css({"right": "0"})
    Box.append(title)

    // 段落
    var top = 0, pos = 0, width = setting.rows[0].width;
    $.each(setting.rows, function(i, val) {
      var count = {
        horizon: Math.floor((val.width == width ? val.width - setting.title.size : val.width)/setting.content.size/1.2-1),
        vertical: Math.floor(val.height/setting.content.size)
      }
      count.total = count.horizon * count.vertical

      var prohibit = 0;
      for(var j=0; j<count.horizon; j++) {
        var char = setting.content.text[pos+count.vertical+j*count.vertical]
        if($.inArray(char, setting.rules) > -1) prohibit++
      }
      count.total -= prohibit

      var row = $("<p></p>", {
        width: val.width == width ? val.width - setting.title.size : val.width,
        height: val.height-1,
        css: {
          "overflow": "hidden",
          "position": "absolute",
          "top": top+"px",
          "font-size": setting.content.size+"px",
          "border-bottom": "1px solid #aaa",
        },
        html: setting.content.text.substr(pos, count.total)
      });
      top += val.height
      pos += count.total
      var offset = setting.title.size+"px"
      setting.position.align == "left" ? row.css({"left": "0"}) : row.css({"right": offset})
      Box.append(row)
    })

    // デザイン
    Box.addClass("box");
    Box.css({
      "overflow": "hidden",
      "position": "absolute",
      "left": setting.position.x,
      "top": setting.position.y,
      "-webkit-writing-mode": "vertical-rl",
      "line-height": "1.5em",
    })

    // メソッドチェーン対応
    return(this);
  };
})(jQuery);
