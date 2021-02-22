class Border {
    static get inputProperties() { return ['--border-outside-color', '--border-inside-color']; }
    
    paint(ctx, geom, properties) {
      const outsideColor = properties.get('--border-outside-color');
      const insideColor = properties.get('--border-inside-color');
  
      ctx.lineWidth = 2;
      ctx.strokeStyle = outsideColor; 
      ctx.strokeRect(3, 3, geom.width - 6, geom.height - 6);
      
      ctx.lineDashOffset = -1;
      ctx.setLineDash([geom.width - 8, 2, geom.height - 8, 2]);
      
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, geom.width - 6, geom.height - 6);
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = insideColor; 
      ctx.strokeRect(3, 3, geom.width - 6, geom.height - 6);
    }
  }
  registerPaint("ffr-border", Border);