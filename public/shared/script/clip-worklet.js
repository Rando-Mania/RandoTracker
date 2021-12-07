class maskImage {
    static get inputProperties() { 
      return [
        '--vidWidth',
        '--vidAspect', 
        '--vidHeight',
        '--videoX',
        '--videoY',
        '--border'
      ];
    }
    
    paint(ctx, geom, properties) {

      let border = parseFloat(properties.get("--border"));
      let vidWidth = parseFloat(properties.get("--vidWidth")) - 2 * border;
      let vidAspect = parseFloat(properties.get("--vidAspect"));
      let vidX = parseFloat(properties.get("--videoX")) + border;
      let vidY = parseFloat(properties.get("--videoY")) + border;

      let vidHeight = vidWidth * (1 / vidAspect) - .5 * border;

      const vidX2 = 1280 - vidX - vidWidth;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 1280, 720);
      
      ctx.globalCompositeOperation = 'destination-out';

      ctx.fillRect(vidX, vidY, vidWidth, vidHeight);
      ctx.fillRect(vidX2, vidY, vidWidth, vidHeight);
    }
  }
  registerPaint("clipMask", maskImage);