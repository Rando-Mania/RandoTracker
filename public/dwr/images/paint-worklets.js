class stampBorder {
  static get inputProperties() { return ['--border-color'];}

    paint(ctx, geom, properties) {
      const borderColor = properties.get('--border-color').toString();

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 4; ctx.strokeRect(2, 2, geom.width - 4, geom.height - 4);
      ctx.lineWidth = 2; ctx.strokeRect(7, 7, geom.width - 14, geom.height - 14);
  
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#000';
      ctx.setLineDash([2, 6]);
      ctx.lineDashOffset = 1;
  
      function drawDashes(dx){
        ctx.beginPath();
        ctx.moveTo(dx, dx);
        ctx.lineTo(geom.width - dx, dx);
        ctx.lineTo(geom.width - dx, geom.height - dx);
        ctx.lineTo(dx, geom.height - dx);
        ctx.closePath();
        ctx.stroke();
      }
  
      drawDashes(.5);
      drawDashes(6.5);
    }
  }
  registerPaint("dq9Stamp", stampBorder);

  class dw1Border {  
    paint(ctx, geom) {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 4; 
      ctx.strokeRect(2, 2, geom.width - 4, geom.height - 4);

      ctx.fillStyle = '#fff';
      ctx.fillRect(2, 1, geom.width - 4, geom.height - 2);
      ctx.fillRect(1, 2, geom.width - 2, geom.height - 4);
      ctx.clearRect(4, 3, geom.width - 8, geom.height - 6);
      ctx.clearRect(3, 4, geom.width - 6, geom.height - 8);
    }
  }
  registerPaint("dw1Border", dw1Border);

  class dw2Border {  
    paint(ctx, geom) {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 4; 
      ctx.strokeRect(2, 2, geom.width - 4, geom.height - 4);

      ctx.fillStyle = '#fff';
      ctx.fillRect(2, 1, geom.width - 4, geom.height - 2);
      ctx.fillRect(1, 2, geom.width - 2, geom.height - 4);
      ctx.clearRect(4, 3, geom.width - 8, geom.height - 6);
      ctx.clearRect(3, 4, geom.width - 6, geom.height - 8);
    }
  }
  registerPaint("dw2Border", dw2Border);