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
        font: "Meiryo",
        reverse: false
      },
      content: {
        text: "",
        size: 18
      },
      image: {
        src: ""
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

    var title = setting.title.text.replace(/([0-9 ０-９]{1,4})/g, function($) {
      nums = $.replace(/[Ａ-Ｚａ-ｚ０-９]/, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
      });
      return "<span style='-ms-text-combine-horizontal:all;text-combine-upright:all;'>"+nums+"</span>";
    });

    // タイトル
    var title = $("<h2></h2>", {
      width: setting.title.size,
      css: {
        "position": "absolute",
        "top": "0",
        "font-family": setting.title.font,
        "margin": "0",
        "overflow": "hidden",
        "font-size": setting.title.size+"px",
      },
      html: title
    });
    var offset = setting.rows[0].width - setting.title.size;
    setting.position.align == "left" ? title.css({"left": offset+"px"}) : title.css({"right": "0"})
    title.css('padding-right', '1px');
    title.css('padding-right', '1px');    
    if(setting.title.reverse == true) {
      title.css("color", "white");
      title.css("background", "rgb(54,57,78)");
    }
    Box.append(title)

    // 画像
    if(setting.image.src != "") {
      var image = $("<img>", {
        width: 200,
        height: setting.rows[0].height,
        css: {
          "position": "absolute",
          "top": "0",
          "left": 0,
          "margin": "0",
          "font-size": setting.title.size,
        },
        src: setting.image.src
      })
      Box.append(image)
      setting.rows[0].width -= 210;
    }

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

      var str = setting.content.text.substr(pos, count.total)

      // 半角数字を縦書きに
      var body = str.replace(/([0-9 ０-９]{1,4})/g, function($) {
        nums = $.replace(/[Ａ-Ｚａ-ｚ０-９]/, function(s) {
          return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
        return "<span style='-ms-text-combine-horizontal:all;text-combine-upright:all;'>"+nums+"</span>";
      });
      //if(i == setting.rows.length-1) { body = body.match(/(.+。)/)[0]; }

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
        html: body
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
