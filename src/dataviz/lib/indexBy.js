Keen.Dataviz.prototype.indexBy = function(str){
  if (!arguments.length) return this.view.attributes.indexBy;
  this.view.attributes.indexBy = (str ? String(str) : Keen.Dataviz.defaults.indexBy);
  _runIndexBy.call(this);
  return this;
};

function _runIndexBy(){
  var self = this,
      root = this.dataset.meta.schema || this.dataset.meta.unpack,
      newOrder = this.indexBy().split(".").join(Keen.Dataset.defaults.delimeter);
  // Replace in schema and re-run dataset.parse()
  each(root, function(def, i){
    // update 'select' configs
    if (i === "select" && def instanceof Array) {
      each(def, function(c, j){
        if (c.path.indexOf("timeframe -> ") > -1) {
          self.dataset.meta.schema[i][j].path = newOrder;
        }
      });
    }
    // update 'unpack' configs
    else if (i === "unpack" && typeof def === "object") {
      self.dataset.meta.schema[i]['index'].path = newOrder;
    }
  });
  this.dataset.parse();
}
