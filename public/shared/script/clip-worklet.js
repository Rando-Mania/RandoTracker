class maskImage {
    static get inputProperties() { 
      return [
        '--vidWidth',
        '--vidAspect',
        '--videoX',
        '--videoY',
        '--border'
      ];
    }
    
    paint(ctx, size, props) {

      let border = parseFloat(props.get("--border"));
      let vidWidth = parseFloat(props.get("--vidWidth")) - 2 * border;
      let vidAspect = parseFloat(props.get("--vidAspect"));
      let vidX = parseFloat(props.get("--videoX")) + border;
      let vidY = parseFloat(props.get("--videoY")) + border;

      let vidHeight = vidWidth * (1 / vidAspect);

      const vidX2 = 1280 - vidX - vidWidth;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 1280, 720);
      
      ctx.globalCompositeOperation = 'destination-out';

      ctx.fillRect(vidX, vidY, vidWidth, vidHeight);
      ctx.fillRect(vidX2, vidY, vidWidth, vidHeight);
    }
  }
  registerPaint("clipMask", maskImage);