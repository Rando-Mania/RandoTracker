class Back {
  
  paint(ctx, geom) {

    const w = Math.round(geom.width / 6);
    const h = Math.round(geom.height / 3);
    var colorArrays = [
      ['#000', '#000', '#232607', '#000', '#2e271f', '#212e10'],
      ['#121211', '#000', '#011e00', '#001a1a', '#182702', '#232607'],
      ['#000', '#000d00', '#000', '#2e271f', '#000', '#2e271f']
    ];
    
    for (var i = 0; i < colorArrays[0].length; i++) {
      ctx.fillStyle = colorArrays[0][i];
      ctx.fillRect(w * i, 0, w, h);
      ctx.fillStyle = colorArrays[1][i];
      ctx.fillRect(w * i, h * 1, w, h);
      ctx.fillStyle = colorArrays[2][i];
      ctx.fillRect(w * i, h * 2, w, h);
    }
  }
}
registerPaint("fallbackImage", Back);