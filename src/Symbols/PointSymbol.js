EsriLeafletRenderers.PointSymbol = EsriLeafletRenderers.Symbol.extend({
  statics: {
    MARKERTYPES:  ['esriSMSCircle','esriSMSCross', 'esriSMSDiamond', 'esriSMSSquare', 'esriSMSX', 'esriPMS']
  },
  initialize: function(symbolJson, options){
    EsriLeafletRenderers.Symbol.prototype.initialize.call(this, symbolJson);
    if(options) {
      this.serviceUrl = options.url;
    }
    if(symbolJson){
      if(symbolJson.type === 'esriPMS'){
        this._createIcon();
      } else {
        this._fillStyles();
      }
    }
  },

  _fillStyles: function(){
    if(this._symbolJson.outline && this._symbolJson.size > 0){
      this._styles.stroke = true;
      this._styles.weight = this.pixelValue(this._symbolJson.outline.width);
      this._styles.color = this.colorValue(this._symbolJson.outline.color);
      this._styles.opacity = this.alphaValue(this._symbolJson.outline.color);
    }else{
      this._styles.stroke = false;
    }
    if(this._symbolJson.color){
      this._styles.fillColor = this.colorValue(this._symbolJson.color);
      this._styles.fillOpacity = this.alphaValue(this._symbolJson.color);
    } else {
      this._styles.fillOpacity = 0;
    }

    if(this._symbolJson.style === 'esriSMSCircle'){
      this._styles.radius = this.pixelValue(this._symbolJson.size) / 2.0;
    }
  },

  _createIcon: function(){
    var height = this.pixelValue(this._symbolJson.height);
    var width = this.pixelValue(this._symbolJson.width);
    var xOffset = width / 2.0 + this.pixelValue(this._symbolJson.xoffset);
    var yOffset = height / 2.0 + this.pixelValue(this._symbolJson.yoffset);
    var url = this.serviceUrl + 'images/' + this._symbolJson.url;

    this.icon = L.icon({
      iconUrl: url,
      iconSize: [width, height],
      iconAnchor: [xOffset, yOffset]
    });
  },

  pointToLayer: function(geojson, latlng, visualVariables){
    if (this._symbolJson.type === 'esriPMS'){
      return L.marker(latlng, {icon: this.icon});
    }

    var size = this.pixelValue(this._symbolJson.size);

    if (visualVariables) {
      for (var i = 0; i < visualVariables.length; i++){
        if (visualVariables[i].type === 'sizeInfo'){
          var calculatedSize = this.pixelValue(this.getSize(geojson, visualVariables[i]));
          if (calculatedSize) {
            size = calculatedSize;
          }
        }
      }
    }

    switch(this._symbolJson.style){
      case 'esriSMSSquare':
        return EsriLeafletRenderers.squareMarker(latlng, size, this._styles);
      case 'esriSMSDiamond':
        return EsriLeafletRenderers.diamondMarker(latlng, size, this._styles);
      case 'esriSMSCross':
        return EsriLeafletRenderers.crossMarker(latlng, size, this._styles);
      case 'esriSMSX':
        return EsriLeafletRenderers.xMarker(latlng, size, this._styles);
    }
    this._styles.radius = size / 2.0;
    return L.circleMarker(latlng, this._styles);
  }
});
EsriLeafletRenderers.pointSymbol = function(symbolJson, options){
  return new EsriLeafletRenderers.PointSymbol(symbolJson, options);
};
